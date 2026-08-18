import type { Config } from 'tailwindcss';

/**
 * THE SIGNAL ROOM
 * ---------------
 * The product surfaces are built to read as a piece of professional broadcast
 * equipment: anodised graphite panels, silkscreened legends, one live amber
 * signal colour and one aged-copper structural colour. Nothing here is
 * decorative — every colour maps to a state a real machine would have.
 *
 *   ink      the room the rack sits in
 *   steel    the equipment face
 *   edge     machined hairline between units
 *   bone     silkscreened legend type (never pure white)
 *   amber    signal present / live / primary action
 *   patina   aged copper — structure, rails, secondary action
 *   clip     over level. errors only. never decoration.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0B0D',
          lift: '#0E1013',
        },
        steel: {
          DEFAULT: '#14181C',
          lift: '#1A1F25',
          high: '#232930',
        },
        edge: {
          DEFAULT: '#272D35',
          soft: '#1C2128',
          bright: '#3A424C',
        },
        bone: {
          DEFAULT: '#E7E1D4',
          dim: '#8D877B',
          faint: '#5B5750',
        },
        amber: {
          DEFAULT: '#FF9D2E',
          glow: '#FFC880',
          deep: '#B96D14',
          shadow: '#3A2409',
        },
        patina: {
          DEFAULT: '#3E8E7E',
          glow: '#6FBCAC',
          deep: '#225147',
          shadow: '#0F2622',
        },
        clip: {
          DEFAULT: '#E5484D',
          deep: '#7A2225',
        },

        /* ── GENERATED CUSTOMER SITES ────────────────────────────────────
           A separate system entirely. A dentist's website should not look
           like a rack of audio gear, so those pages are printed matter:
           paper, ruled lines, and the business's own colour as the single
           accent. Only the mono readout carries over from the product. */
        paper: {
          DEFAULT: '#F7F5F1',
          deep: '#EFEBE3',
          rule: '#DFD9CD',
        },
        graphite: {
          DEFAULT: '#17161B',
          soft: '#57534B',
          faint: '#8A857B',
        },
      },
      fontFamily: {
        display: ['Archivo', 'Archivo Expanded', 'system-ui', 'sans-serif'],
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
        // Customer sites only.
        serif: ['Petrona', 'Georgia', 'serif'],
        site: ['Instrument Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        legend: ['0.625rem', { lineHeight: '1', letterSpacing: '0.2em' }],
        micro: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      spacing: {
        rail: '4.5rem',
        unit: '7.5rem',
      },
      borderRadius: {
        // Equipment has machined corners, not pill shapes.
        panel: '2px',
        jack: '999px',
      },
      boxShadow: {
        bevel:
          'inset 0 1px 0 rgba(231,225,212,0.055), inset 0 -1px 0 rgba(0,0,0,0.55)',
        'bevel-deep':
          'inset 0 1px 0 rgba(231,225,212,0.07), inset 0 -1px 0 rgba(0,0,0,0.7), 0 1px 0 rgba(231,225,212,0.03)',
        recess:
          'inset 0 2px 6px rgba(0,0,0,0.75), inset 0 -1px 0 rgba(231,225,212,0.04)',
        lamp: '0 0 0 1px rgba(255,157,46,0.28), 0 0 22px -6px rgba(255,157,46,0.55)',
        'lamp-patina':
          '0 0 0 1px rgba(62,142,126,0.3), 0 0 22px -6px rgba(62,142,126,0.5)',
      },
      transitionTimingFunction: {
        // Meter needle ballistics: fast attack, slow release.
        attack: 'cubic-bezier(0.16, 1, 0.3, 1)',
        release: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'lamp-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        'tape-scroll': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-50%)' },
        },
        'needle-settle': {
          '0%': { transform: 'rotate(-42deg)' },
          '60%': { transform: 'rotate(6deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'trace-sweep': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'lamp-flicker': 'lamp-flicker 1.6s ease-in-out infinite',
        'needle-settle': 'needle-settle 0.9s cubic-bezier(0.16,1,0.3,1) both',
        'rise-in': 'rise-in 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'trace-sweep': 'trace-sweep 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
