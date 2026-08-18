/**
 * THE DOCKET — generated customer sites.
 *
 * A second identity, deliberately unlike the product's. Where Voice Agent One
 * is a rack of equipment, a customer's site is printed matter: the service
 * docket a small business hands you. Paper ground, ruled tariff, a stamped
 * seal, a tear-off stub at the bottom. Structure comes from that artifact —
 * the docket number, the ruled columns, the perforation — so the layout means
 * something specific to a business that books appointments.
 *
 * The only thing carried over from the product is the mono readout: numbers a
 * machine printed look the same everywhere. Everything else diverges.
 *
 * The accent is the business's own colour, pulled into a legible range by
 * `makeTheme`, and used once per region — never as a gradient.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Clock, Mail, MapPin, Phone, Plus, Star } from 'lucide-react';
import type { BusinessConfig } from '../../types';
import { makeTheme } from './theme';
import { cn } from '../../utils/cn';

/* ── PARTS ─────────────────────────────────────────────────────────────────*/

const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span
    className={cn(
      'font-mono text-[10px] uppercase tracking-[0.2em] text-graphite-faint',
      className
    )}
  >
    {children}
  </span>
);

const SectionHead: React.FC<{
  index: string;
  label: string;
  title: React.ReactNode;
  lede?: string;
  accent: string;
}> = ({ index, label, title, lede, accent }) => (
  <header className="border-b border-paper-rule pb-6">
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-[10px] tracking-[0.2em]" style={{ color: accent }}>
        {index}
      </span>
      <Eyebrow>{label}</Eyebrow>
      <span aria-hidden className="h-px flex-1 bg-paper-rule" />
    </div>
    <h2 className="mt-4 font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.05] text-graphite">
      {title}
    </h2>
    {lede && (
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-graphite-soft">{lede}</p>
    )}
  </header>
);

/** The stamped seal. One per site, on the staff credential — the signature. */
const Seal: React.FC<{ initial: string; label: string; accent: string }> = ({
  initial,
  label,
  accent,
}) => (
  <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-6" role="img" aria-label={label}>
    <defs>
      {/* Started at the bottom-left so the wording reads left-to-right across
          the top of the stamp rather than upside down. */}
      <path id="seal-arc" d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
    </defs>
    {/* Paper disc so the stamp sits on top of whatever it overlaps. */}
    <circle cx="60" cy="60" r="53" fill="#F7F5F1" />
    <circle cx="60" cy="60" r="52" fill="none" stroke={accent} strokeWidth="1.25" opacity="0.6" />
    <circle cx="60" cy="60" r="46.5" fill="none" stroke={accent} strokeWidth="0.6" opacity="0.35" />
    <text
      fill={accent}
      fontSize="7"
      fontFamily="IBM Plex Mono, monospace"
      letterSpacing="2.4"
      opacity="0.75"
    >
      <textPath href="#seal-arc" startOffset="50%" textAnchor="middle">
        {label.toUpperCase()}
      </textPath>
    </text>
    <text
      x="60"
      y="61"
      textAnchor="middle"
      dominantBaseline="central"
      fill={accent}
      fontSize="38"
      fontFamily="Petrona, Georgia, serif"
      fontWeight="600"
    >
      {initial}
    </text>
  </svg>
);

/* ── PAGE ──────────────────────────────────────────────────────────────────*/

export const BusinessSite: React.FC<{
  config: BusinessConfig;
  /** Where the talk button goes. */
  callHref: string;
  /** Rendered above everything, for the owner's tools. Omitted publicly. */
  admin?: React.ReactNode;
  /** Modals and overlays owned by the parent page. */
  children?: React.ReactNode;
}> = ({ config, callHref, admin, children }) => {
  const t = makeTheme(config.branding?.primaryColor);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const agent = config.voiceAgent?.name || 'our assistant';
  const initial = (config.name || '?').charAt(0).toUpperCase();
  // Trade vocabulary is generated per business, so "appointment", "estimate"
  // and "session" all land in the same sentence slot. Pick the article.
  const a = (w: string) => `${/^[aeiou]/i.test(w) ? 'an' : 'a'} ${w}`;
  const money = (n: number) =>
    n > 0 ? `$${n.toLocaleString('en-US')}` : 'On request';

  // Group the tariff by category so the list reads as a real price sheet.
  const byCategory = config.services.reduce<Record<string, typeof config.services>>(
    (acc, s) => {
      const k = s.category || 'Services';
      (acc[k] ||= []).push(s);
      return acc;
    },
    {}
  );

  const nav = [
    ['Services', '#services'],
    ['About', '#about'],
    ['Reviews', '#reviews'],
    ['Questions', '#questions'],
  ];

  const TalkButton: React.FC<{ size?: 'sm' | 'lg'; className?: string; label?: string }> = ({
    size = 'sm',
    className,
    label,
  }) => (
    <Link
      to={callHref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-transform duration-200 ease-attack hover:-translate-y-px',
        size === 'lg' ? 'px-7 py-4 text-[15px]' : 'px-4 py-2.5 text-[13px]',
        className
      )}
      style={{ background: t.accent, color: t.onAccent }}
    >
      {label || `Talk to ${agent}`}
      <ArrowRight size={size === 'lg' ? 16 : 14} />
    </Link>
  );

  return (
    <div className="min-h-screen bg-paper font-site text-graphite antialiased">
      {admin}

      {/* ── MASTHEAD ── */}
      <header className="sticky top-0 z-40 border-b border-paper-rule bg-paper/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[80rem] items-center gap-5 px-5 sm:px-8">
          <a href="#top" className="font-serif text-[19px] font-semibold leading-none text-graphite">
            {config.name}
          </a>
          <span aria-hidden className="hidden h-4 w-px bg-paper-rule sm:block" />
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[13.5px] text-graphite-soft transition-colors hover:text-graphite"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <a
              href={`tel:${config.phone}`}
              className="hidden font-mono text-[13px] text-graphite transition-colors hover:opacity-70 sm:block"
            >
              {config.phone}
            </a>
            <TalkButton />
          </div>
        </div>
      </header>

      <main id="top">
        {/* ── DOCKET HEAD ── */}
        <section className="mx-auto w-full max-w-[80rem] px-5 py-14 sm:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-px w-8"
                  style={{ background: t.accent }}
                />
                <Eyebrow>
                  {config.industry} &nbsp;·&nbsp; {config.address.city}, {config.address.state}
                </Eyebrow>
              </div>

              <h1 className="mt-6 max-w-2xl font-serif text-[clamp(2.25rem,5.6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.015em] text-graphite text-balance">
                {config.tagline}
              </h1>

              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-graphite-soft text-pretty">
                {config.description}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <TalkButton size="lg" />
                <a
                  href={`tel:${config.phone}`}
                  className="inline-flex items-center gap-2 border-b py-2 text-[15px] text-graphite transition-colors"
                  style={{ borderColor: t.line }}
                >
                  <Phone size={15} style={{ color: t.accent }} />
                  {config.phone}
                </a>
              </div>

              <p className="mt-6 font-mono text-[11px] text-graphite-faint">
                {agent} answers day or night &mdash; no hold, no voicemail.
              </p>
            </motion.div>

            {/* The docket itself. */}
            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="border bg-paper-deep"
              style={{ borderColor: t.line }}
            >
              <div
                className="flex items-center justify-between border-b px-5 py-3"
                style={{ borderColor: t.line, background: t.wash }}
              >
                <Eyebrow>Booking docket</Eyebrow>
                <span className="font-mono text-[11px]" style={{ color: t.accent }}>
                  No. {String(Math.abs(hashCode(config.name)) % 9999).padStart(4, '0')}
                </span>
              </div>

              <dl className="divide-y divide-paper-rule px-5">
                <Row icon={Clock} label="Open" accent={t.accent}>
                  <span className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[12.5px]">
                    <span className="text-graphite-faint">Mon&ndash;Fri</span>
                    <span>{config.hours.weekdays}</span>
                    <span className="text-graphite-faint">Sat</span>
                    <span>{config.hours.saturday}</span>
                    <span className="text-graphite-faint">Sun</span>
                    <span>{config.hours.sunday}</span>
                  </span>
                </Row>

                <Row icon={MapPin} label="Find us" accent={t.accent}>
                  <span className="text-[13.5px] leading-relaxed">
                    {config.address.street}
                    <br />
                    {config.address.city}, {config.address.state} {config.address.zip}
                  </span>
                </Row>

                <Row icon={Phone} label="Call" accent={t.accent}>
                  <a href={`tel:${config.phone}`} className="font-mono text-[13.5px] hover:opacity-70">
                    {config.phone}
                  </a>
                </Row>

                {config.email && (
                  <Row icon={Mail} label="Write" accent={t.accent}>
                    <a
                      href={`mailto:${config.email}`}
                      className="break-all font-mono text-[13.5px] hover:opacity-70"
                    >
                      {config.email}
                    </a>
                  </Row>
                )}
              </dl>

              <div className="border-t p-5" style={{ borderColor: t.line }}>
                <TalkButton
                  size="lg"
                  className="w-full"
                  label={`Book ${a(config.terms.appointment)} by voice`}
                />
              </div>
            </motion.aside>
          </div>
        </section>

        {/* ── TARIFF ── */}
        <section id="services" className="border-t border-paper-rule scroll-mt-16">
          <div className="mx-auto w-full max-w-[80rem] px-5 py-14 sm:px-8 lg:py-20">
            <SectionHead
              index="01"
              label="Tariff"
              accent={t.accent}
              title={<>What we do, and what it costs</>}
              lede={`Every ${config.terms.service} below can be booked by talking to ${agent}. Prices are what you pay; there is nothing added at the counter.`}
            />

            <div className="mt-10 space-y-12">
              {Object.entries(byCategory).map(([category, items]) => (
                <div key={category}>
                  <div className="flex items-baseline gap-3">
                    <Eyebrow>{category}</Eyebrow>
                    <span aria-hidden className="h-px flex-1 bg-paper-rule" />
                    <span className="font-mono text-[10px] text-graphite-faint">
                      {String(items.length).padStart(2, '0')}
                    </span>
                  </div>

                  <ul className="mt-1">
                    {items.map((s) => (
                      <li
                        key={s.id}
                        className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-paper-rule py-5 transition-colors sm:grid-cols-[1fr_auto_auto]"
                      >
                        <div className="min-w-0">
                          <h3 className="font-serif text-[19px] font-semibold leading-snug text-graphite">
                            {s.name}
                          </h3>
                          <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-graphite-soft">
                            {s.description}
                          </p>
                        </div>
                        <span className="order-3 font-mono text-[12.5px] text-graphite-faint sm:order-none sm:w-24 sm:text-right">
                          {s.duration} min
                        </span>
                        <span
                          className="font-mono text-[15px] tabular-nums sm:w-28 sm:text-right"
                          style={{ color: t.accent }}
                        >
                          {money(s.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <TalkButton size="lg" label={`Book any of these with ${agent}`} />
              <p className="text-[13.5px] text-graphite-soft">
                Not sure which one? Ask &mdash; {agent} will work it out with you.
              </p>
            </div>
          </div>
        </section>

        {/* ── CREDENTIAL ── */}
        <section id="about" className="border-t border-paper-rule scroll-mt-16">
          <div className="mx-auto w-full max-w-[80rem] px-5 py-14 sm:px-8 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-16">
              <div>
                <SectionHead
                  index="02"
                  label="Who you are dealing with"
                  accent={t.accent}
                  title={<>About {config.name}</>}
                />
                <p className="mt-8 max-w-xl text-[16.5px] leading-relaxed text-graphite-soft text-pretty">
                  {config.description}
                </p>

                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    `${agent} answers every call, including out of hours`,
                    `Book, move or cancel ${a(config.terms.appointment)} by voice`,
                    `Straight answers about our ${config.terms.service}s`,
                    'No hold music and no phone tree',
                  ].map((l) => (
                    <li key={l} className="flex items-start gap-2.5 text-[14px] text-graphite-soft">
                      <Check size={14} className="mt-1 shrink-0" style={{ color: t.accent }} />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Credential card with the seal. */}
              <aside
                className="relative self-start border bg-paper-deep p-7"
                style={{ borderColor: t.line }}
              >
                <div className="absolute -right-5 -top-8">
                  <Seal initial={initial} label={`${config.terms.appointment}s by voice`} accent={t.accent} />
                </div>

                <Eyebrow>Your {config.terms.service} provider</Eyebrow>
                <h3 className="mt-4 max-w-[70%] font-serif text-[26px] font-semibold leading-tight text-graphite">
                  {config.staff.name}
                </h3>
                <p className="mt-1 text-[14px] text-graphite-soft">{config.staff.title}</p>

                {config.staff.bio && (
                  <p className="mt-5 border-t border-paper-rule pt-5 text-[14px] leading-relaxed text-graphite-soft">
                    {config.staff.bio}
                  </p>
                )}

                <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-paper-rule pt-5">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-graphite-faint">
                      Trade
                    </dt>
                    <dd className="mt-1 text-[14px] capitalize text-graphite">{config.industry}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-graphite-faint">
                      Serving
                    </dt>
                    <dd className="mt-1 text-[14px] text-graphite">{config.address.city}</dd>
                  </div>
                </dl>
              </aside>
            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        {config.testimonials?.length > 0 && (
          <section id="reviews" className="border-t border-paper-rule scroll-mt-16">
            <div className="mx-auto w-full max-w-[80rem] px-5 py-14 sm:px-8 lg:py-20">
              <SectionHead
                index="03"
                label="In their words"
                accent={t.accent}
                title={<>What our {config.terms.customer}s say</>}
              />

              <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                {config.testimonials.map((r, i) => (
                  <figure key={i} className="border-t-2 pt-5" style={{ borderColor: t.accent }}>
                    <div
                      className="flex items-center gap-1 font-mono text-[11px]"
                      style={{ color: t.accent }}
                      aria-label={`${r.rating} out of 5`}
                    >
                      {Array.from({ length: 5 }, (_, s) => (
                        <Star
                          key={s}
                          size={11}
                          fill={s < r.rating ? 'currentColor' : 'none'}
                          strokeWidth={1.5}
                          className={s < r.rating ? '' : 'opacity-30'}
                        />
                      ))}
                      <span className="ml-1.5 text-graphite-faint">{r.rating}.0</span>
                    </div>

                    <blockquote className="mt-4 font-serif text-[18px] leading-[1.5] text-graphite">
                      &ldquo;{r.content}&rdquo;
                    </blockquote>

                    <figcaption className="mt-4 border-t border-paper-rule pt-3">
                      <span className="block text-[14px] font-medium text-graphite">{r.name}</span>
                      <span className="mt-0.5 block font-mono text-[11px] text-graphite-faint">
                        {r.role}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── QUESTIONS ── */}
        {config.faqs?.length > 0 && (
          <section id="questions" className="border-t border-paper-rule scroll-mt-16">
            <div className="mx-auto w-full max-w-[80rem] px-5 py-14 sm:px-8 lg:py-20">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
                <SectionHead
                  index="04"
                  label="Before you book"
                  accent={t.accent}
                  title={<>Questions we get asked</>}
                  lede={`${agent} knows the answers to all of these, and to the ones we have not thought of.`}
                />

                <div className="border-t border-paper-rule">
                  {config.faqs.map((f, i) => {
                    const open = openFaq === i;
                    return (
                      <div key={i} className="border-b border-paper-rule">
                        <h3>
                          <button
                            type="button"
                            onClick={() => setOpenFaq(open ? null : i)}
                            aria-expanded={open}
                            className="group flex w-full items-baseline gap-4 py-5 text-left"
                          >
                            <span
                              className="font-mono text-[11px]"
                              style={{ color: open ? t.accent : undefined }}
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="flex-1 font-serif text-[18px] font-semibold leading-snug text-graphite">
                              {f.question}
                            </span>
                            <Plus
                              size={15}
                              aria-hidden
                              className={cn(
                                'mt-1 shrink-0 text-graphite-faint transition-transform duration-300 ease-attack',
                                open && 'rotate-45'
                              )}
                            />
                          </button>
                        </h3>
                        <div
                          className={cn(
                            'grid transition-all duration-300 ease-attack',
                            open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                          )}
                        >
                          <div className="overflow-hidden">
                            <p className="max-w-2xl pb-6 pl-9 text-[15px] leading-relaxed text-graphite-soft">
                              {f.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── CLOSE ── */}
        <section className="border-t" style={{ background: t.accent, borderColor: t.accent }}>
          <div className="mx-auto flex w-full max-w-[80rem] flex-col items-start gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:py-20">
            <div style={{ color: t.onAccent }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">
                Open now
              </span>
              <h2 className="mt-4 max-w-xl font-serif text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05]">
                Rather just talk to someone?
              </h2>
              <p className="mt-4 max-w-md text-[15.5px] leading-relaxed opacity-80">
                {agent} picks up straight away, knows the whole {config.terms.service} list, and can
                put {a(config.terms.appointment)} in the book while you are still on the line.
              </p>
            </div>

            <Link
              to={callHref}
              className="inline-flex shrink-0 items-center gap-3 px-8 py-4 text-[15px] font-medium transition-transform duration-200 ease-attack hover:-translate-y-px"
              style={{ background: t.onAccent, color: t.accent }}
            >
              Talk to {agent} <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      {/* ── TEAR-OFF STUB ── */}
      <footer className="bg-paper-deep">
        <div aria-hidden className="border-t border-dashed border-paper-rule" />
        <div className="mx-auto w-full max-w-[80rem] px-5 py-12 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-serif text-[20px] font-semibold text-graphite">{config.name}</p>
              <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-graphite-soft">
                {config.tagline}
              </p>
            </div>

            <div>
              <Eyebrow>Hours</Eyebrow>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-[12.5px] text-graphite-soft">
                <dt className="text-graphite-faint">Mon&ndash;Fri</dt>
                <dd>{config.hours.weekdays}</dd>
                <dt className="text-graphite-faint">Sat</dt>
                <dd>{config.hours.saturday}</dd>
                <dt className="text-graphite-faint">Sun</dt>
                <dd>{config.hours.sunday}</dd>
              </dl>
            </div>

            <div>
              <Eyebrow>Find us</Eyebrow>
              <address className="mt-3 not-italic text-[13.5px] leading-relaxed text-graphite-soft">
                {config.address.street}
                <br />
                {config.address.city}, {config.address.state} {config.address.zip}
                <br />
                {config.address.country}
              </address>
            </div>

            <div>
              <Eyebrow>Reach us</Eyebrow>
              <ul className="mt-3 space-y-2 font-mono text-[12.5px] text-graphite-soft">
                <li>
                  <a href={`tel:${config.phone}`} className="hover:text-graphite">
                    {config.phone}
                  </a>
                </li>
                {config.email && (
                  <li>
                    <a href={`mailto:${config.email}`} className="break-all hover:text-graphite">
                      {config.email}
                    </a>
                  </li>
                )}
              </ul>
              <TalkButton className="mt-4" />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-paper-rule pt-6">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-graphite-faint">
              &copy; {new Date().getFullYear()} {config.name}
            </span>
            <span aria-hidden className="hidden h-px flex-1 bg-paper-rule sm:block" />
            <a
              href="/"
              className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-graphite-faint transition-colors hover:text-graphite"
            >
              Voice by Voice Agent One
            </a>
          </div>
        </div>
      </footer>

      {children}
    </div>
  );
};

/* A docket needs a number, and the same business should always get the same
   one. Derived from the name rather than random so it is stable across loads. */
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}

const Row: React.FC<{
  icon: React.ElementType;
  label: string;
  accent: string;
  children: React.ReactNode;
}> = ({ icon: Icon, label, accent, children }) => (
  <div className="grid grid-cols-[auto_1fr] items-start gap-4 py-4">
    <span className="flex items-center gap-2 pt-0.5">
      <Icon size={13} style={{ color: accent }} />
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-graphite-faint">
        {label}
      </span>
    </span>
    <span className="text-graphite">{children}</span>
  </div>
);
