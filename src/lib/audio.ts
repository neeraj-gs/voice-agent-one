/**
 * SIGNAL SOURCE
 *
 * Feeds the spectrogram. Three sources, one interface:
 *
 *   synthetic  a speech model — formants, syllable rhythm, fricatives. Runs
 *              with no permission and no audio context, so the hero has
 *              something true to show the moment the page paints.
 *   mic        the visitor's own voice via getUserMedia.
 *   element    an <audio>/<video> element, for the agent talking back.
 *
 * Bins are spaced on the mel scale (80 Hz – 8 kHz), the same way a real
 * spectrogram is, so the formant bands land where a phonetician would expect
 * them rather than being crushed into the bottom eighth of the display.
 */

export type SourceMode = 'synthetic' | 'mic' | 'element';

export const BIN_COUNT = 72;

const F_MIN = 80;
const F_MAX = 8000;

const mel = (f: number) => 2595 * Math.log10(1 + f / 700);
const unmel = (m: number) => 700 * (10 ** (m / 2595) - 1);

/** Centre frequency of each display bin, mel-spaced. */
export const BIN_FREQS: number[] = (() => {
  const lo = mel(F_MIN);
  const hi = mel(F_MAX);
  return Array.from({ length: BIN_COUNT }, (_, i) =>
    unmel(lo + ((hi - lo) * i) / (BIN_COUNT - 1))
  );
})();

/* ── SPEECH MODEL ──────────────────────────────────────────────────────────
   Eight vowel targets as (F1, F2, F3) in Hz. These are real measured values
   for an adult speaker; using actual formant data is what makes the resting
   animation read as language instead of as a wobbling equaliser. */

const VOWELS: [number, number, number][] = [
  [730, 1090, 2440], // ah
  [270, 2290, 3010], // ee
  [300, 870, 2240], // oo
  [530, 1840, 2480], // eh
  [570, 840, 2410], // aw
  [440, 1020, 2240], // uh
  [390, 1990, 2550], // ih
  [640, 1190, 2390], // ae
];

/** Cheap deterministic hash so the "speech" is repeatable, not random noise. */
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export class SignalSource {
  bins = new Float32Array(BIN_COUNT);
  /** Broadband level, 0–1. Drives meters and the diaphragm. */
  level = 0;
  mode: SourceMode = 'synthetic';
  error: string | null = null;

  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private raw: Uint8Array | null = null;
  private srcNode: MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null = null;
  private smoothed = new Float32Array(BIN_COUNT);

  /* ── LIVE INPUT ───────────────────────────────────────────────────────── */

  async attachMic(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false },
      });
      this.stream = stream;
      this.buildGraph((ctx) => ctx.createMediaStreamSource(stream));
      this.mode = 'mic';
      this.error = null;
      return true;
    } catch (err) {
      // Denied or unavailable. The synthetic model keeps running, so the
      // display never goes blank — it just stops being the visitor's voice.
      this.error =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Microphone blocked. Allow access in your browser to see your own voice.'
          : 'No microphone found on this device.';
      return false;
    }
  }

  attachElement(el: HTMLMediaElement): boolean {
    try {
      this.buildGraph((ctx) => ctx.createMediaElementSource(el), true);
      this.mode = 'element';
      return true;
    } catch {
      return false;
    }
  }

  private buildGraph(
    make: (ctx: AudioContext) => MediaStreamAudioSourceNode | MediaElementAudioSourceNode,
    passthrough = false
  ) {
    this.teardownGraph();
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = new Ctor();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.55;
    analyser.minDecibels = -85;
    analyser.maxDecibels = -18;

    const node = make(ctx);
    node.connect(analyser);
    // The element source must still reach the speakers; a mic must not.
    if (passthrough) analyser.connect(ctx.destination);

    this.ctx = ctx;
    this.analyser = analyser;
    this.srcNode = node;
    this.raw = new Uint8Array(analyser.frequencyBinCount);
    void ctx.resume();
  }

  private teardownGraph() {
    this.srcNode?.disconnect();
    this.analyser?.disconnect();
    this.stream?.getTracks().forEach((t) => t.stop());
    void this.ctx?.close().catch(() => {});
    this.srcNode = null;
    this.analyser = null;
    this.stream = null;
    this.ctx = null;
    this.raw = null;
  }

  detach() {
    this.teardownGraph();
    this.mode = 'synthetic';
  }

  /* ── FRAME ────────────────────────────────────────────────────────────── */

  /** Fill `bins` for time `t` (seconds). Call once per rendered frame. */
  update(t: number) {
    if (this.analyser && this.raw) this.sampleLive();
    else this.sampleSynthetic(t);
  }

  private sampleLive() {
    const analyser = this.analyser!;
    const raw = this.raw!;
    analyser.getByteFrequencyData(raw as Uint8Array<ArrayBuffer>);

    const nyquist = (this.ctx?.sampleRate ?? 48000) / 2;
    const perBin = nyquist / raw.length;
    let sum = 0;

    for (let i = 0; i < BIN_COUNT; i++) {
      // Each display bin averages the FFT bins inside its mel band, so wide
      // high bands aren't under-sampled into flicker.
      const fLo = i === 0 ? F_MIN : (BIN_FREQS[i - 1] + BIN_FREQS[i]) / 2;
      const fHi = i === BIN_COUNT - 1 ? F_MAX : (BIN_FREQS[i] + BIN_FREQS[i + 1]) / 2;
      const lo = Math.max(0, Math.floor(fLo / perBin));
      const hi = Math.min(raw.length - 1, Math.ceil(fHi / perBin));

      let acc = 0;
      for (let k = lo; k <= hi; k++) acc += raw[k];
      const v = acc / Math.max(1, hi - lo + 1) / 255;

      this.bins[i] = v;
      sum += v;
    }
    this.level = Math.min(1, (sum / BIN_COUNT) * 1.7);
  }

  private sampleSynthetic(t: number) {
    // Syllables at roughly 4 Hz with an irregular beat, grouped into phrases
    // that leave gaps — a machine reading a booking back to a caller.
    const SYL = 0.26;
    const idx = Math.floor(t / SYL);
    const p = (t % SYL) / SYL;

    const h0 = hash(idx);
    const h1 = hash(idx + 1);

    // Every so often the speaker draws breath.
    const phrase = Math.floor(idx / 9);
    const silent = hash(phrase * 3.3) > 0.78 && idx % 9 > 6;

    const env = silent ? 0 : Math.sin(Math.PI * Math.min(1, p * 1.08)) ** 0.55;
    const voiced = h0 > 0.26;

    const a = VOWELS[Math.floor(h0 * VOWELS.length) % VOWELS.length];
    const b = VOWELS[Math.floor(h1 * VOWELS.length) % VOWELS.length];
    const g = smoothstep(Math.min(1, p * 1.4)); // formants glide, they don't jump

    const f1 = a[0] + (b[0] - a[0]) * g;
    const f2 = a[1] + (b[1] - a[1]) * g;
    const f3 = a[2] + (b[2] - a[2]) * g;

    // Pitch drifts across the phrase and falls at its end — declination.
    const f0 = 128 + Math.sin(t * 0.7) * 14 - (idx % 9) * 1.6;

    let sum = 0;
    for (let i = 0; i < BIN_COUNT; i++) {
      const f = BIN_FREQS[i];
      let v = 0;

      if (voiced) {
        // Three formant peaks, each wider and quieter as it goes up.
        v += 1.0 * Math.exp(-(((f - f1) / 110) ** 2));
        v += 0.72 * Math.exp(-(((f - f2) / 160) ** 2));
        v += 0.4 * Math.exp(-(((f - f3) / 240) ** 2));
        // Harmonic stack near the bottom gives the display its striated base.
        const nearest = Math.round(f / f0) * f0;
        v += 0.5 * Math.exp(-(((f - nearest) / 42) ** 2)) * Math.exp(-f / 1400);
      } else {
        // Fricative: broadband hiss weighted to the top of the range.
        v += 0.62 * Math.exp(-(((f - 4600) / 2400) ** 2));
      }

      // Source spectrum tilt — speech loses roughly 6 dB per octave.
      v *= 0.35 + 0.65 * Math.exp(-f / 3200);
      v *= env;
      v += 0.012; // the room is never truly silent

      // One-pole smoothing keeps the terrain continuous between frames.
      this.smoothed[i] += (v - this.smoothed[i]) * 0.4;
      this.bins[i] = Math.min(1, this.smoothed[i]);
      sum += this.bins[i];
    }

    this.level = Math.min(1, (sum / BIN_COUNT) * 2.6);
  }
}

/** One source per page is plenty; the hero and the meters share it. */
export const signal = new SignalSource();
