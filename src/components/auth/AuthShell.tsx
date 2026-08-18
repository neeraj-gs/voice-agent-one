/**
 * Sign-in / sign-up shell.
 *
 * Two halves: the room on the left with the instrument running quietly, the
 * panel on the right carrying the form. The display is not decoration here —
 * it is the same component the product runs on, which is the point of putting
 * it at the door.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SignalDisplay } from '../three/SignalDisplay';
import { Legend, Lamp } from '../system/primitives';

export const AuthShell: React.FC<{
  /** Silkscreened above the form. */
  eyebrow: string;
  title: React.ReactNode;
  /** One line under the title, in the interface's voice. */
  lede: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}> = ({ eyebrow, title, lede, children, footer }) => (
  <div className="grid min-h-screen bg-ink lg:grid-cols-[1.05fr_minmax(26rem,0.95fr)]">
    {/* ── THE ROOM ── */}
    <aside className="relative hidden flex-col justify-between border-r border-edge-soft p-10 lg:flex xl:p-14">
      <Link to="/" className="flex items-baseline gap-2.5 outline-offset-4">
        <span className="display-lite text-[15px] text-bone">Voice Agent</span>
        <span className="readout text-[15px] text-amber">One</span>
        <span aria-hidden className="h-3 w-px bg-edge" />
        <span className="readout text-[10px] text-bone-faint">VA-1</span>
      </Link>

      <SignalDisplay compact className="h-[46vh] min-h-[19rem] w-full" />

      <div className="max-w-md">
        <p className="display text-[clamp(1.75rem,2.6vw,2.5rem)]">
          Every call
          <br />
          gets answered
        </p>
        <p className="mt-4 text-[14px] leading-relaxed text-bone-dim">
          Your agents keep taking calls whether or not you are signed in. This is just
          where you come to read the transcripts.
        </p>
      </div>
    </aside>

    {/* ── THE PANEL ── */}
    <main className="flex flex-col justify-center bg-steel px-5 py-12 shadow-bevel sm:px-10 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-sm">
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 legend transition-colors hover:text-amber lg:hidden"
        >
          <ArrowLeft size={12} /> Voice Agent One
        </Link>

        <div className="flex items-center gap-2">
          <Lamp state="ready" />
          <Legend>{eyebrow}</Legend>
        </div>

        <h1 className="display mt-4 text-[clamp(1.75rem,4vw,2.5rem)]">{title}</h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-bone-dim">{lede}</p>

        <div className="mt-9">{children}</div>

        <div className="mt-8 border-t border-edge-soft pt-6">{footer}</div>

        <Link
          to="/"
          className="mt-10 hidden items-center gap-2 legend transition-colors hover:text-amber lg:inline-flex"
        >
          <ArrowLeft size={12} /> Back to the homepage
        </Link>
      </div>
    </main>
  </div>
);
