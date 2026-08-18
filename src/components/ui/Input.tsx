/**
 * Panel inputs.
 *
 * A field is a cut-out in the metal: recessed, dark, with the value sitting
 * down inside it. The label is silkscreened above in mono caps. Focus lights
 * a hairline along the left edge — the way a channel arms.
 *
 * Errors say what went wrong and what to do. They do not apologise.
 */

import React, { useId } from 'react';
import { cn } from '../../utils/cn';

const fieldBase = cn(
  'w-full rounded-panel border bg-ink px-3.5 py-2.5 text-[15px] text-bone shadow-recess',
  'placeholder:text-bone-faint caret-amber',
  'transition-[border-color,box-shadow] duration-200',
  'focus:outline-none focus:border-amber focus:shadow-[inset_0_2px_6px_rgba(0,0,0,0.75),-2px_0_0_0_theme(colors.amber.DEFAULT)]',
  'disabled:opacity-45'
);

const Shell: React.FC<{
  id: string;
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, label, hint, error, children, className }) => (
  <div className={cn('w-full', className)}>
    {label && (
      <label htmlFor={id} className="mb-1.5 flex items-center gap-2">
        <span className={cn('legend', error && 'text-clip')}>{label}</span>
        {error && <span aria-hidden className="lamp lamp-clip" />}
      </label>
    )}
    {children}
    {hint && !error && (
      <p id={`${id}-hint`} className="mt-1.5 font-mono text-[11px] leading-snug text-bone-faint">
        {hint}
      </p>
    )}
    {error && (
      <p id={`${id}-error`} className="mt-1.5 font-mono text-[11px] leading-snug text-clip">
        {error}
      </p>
    )}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, hint, className, id, ...props }) => {
  const auto = useId();
  const inputId = id || auto;

  return (
    <Shell id={inputId} label={label} hint={hint} error={error}>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={cn(fieldBase, error && 'border-clip', className)}
        {...props}
      />
    </Shell>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  className,
  id,
  ...props
}) => {
  const auto = useId();
  const inputId = id || auto;

  return (
    <Shell id={inputId} label={label} hint={hint} error={error}>
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={cn(fieldBase, 'resize-y font-mono text-[13px] leading-relaxed', error && 'border-clip', className)}
        {...props}
      />
    </Shell>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  hint,
  options,
  className,
  id,
  ...props
}) => {
  const auto = useId();
  const inputId = id || auto;

  return (
    <Shell id={inputId} label={label} hint={hint} error={error}>
      <div className="relative">
        <select
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={cn(fieldBase, 'appearance-none pr-10', error && 'border-clip', className)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-steel text-bone">
              {option.label}
            </option>
          ))}
        </select>
        {/* Rotary indicator rather than a chevron — this is a selector switch. */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b border-r border-bone-dim"
        />
      </div>
    </Shell>
  );
};

/* ── TOGGLE ────────────────────────────────────────────────────────────────
   A latching rocker switch. Reads its state as a legend, not just a colour. */

export const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
  onLabel?: string;
  offLabel?: string;
  className?: string;
}> = ({ checked, onChange, label, hint, onLabel = 'ON', offLabel = 'OFF', className }) => (
  <div className={cn('flex items-start justify-between gap-6', className)}>
    <div className="min-w-0">
      <div className="legend text-bone-dim">{label}</div>
      {hint && <p className="mt-1 text-[13px] leading-snug text-bone-faint">{hint}</p>}
    </div>

    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative flex h-8 w-[4.5rem] shrink-0 items-center rounded-panel border shadow-recess transition-colors duration-200',
        checked ? 'border-amber-deep bg-amber-shadow' : 'border-edge bg-ink'
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-0.5 w-[calc(50%-2px)] rounded-panel border shadow-bevel transition-transform duration-200 ease-attack',
          checked
            ? 'translate-x-[calc(100%+2px)] border-amber-deep bg-amber'
            : 'translate-x-0.5 border-edge-bright bg-steel-high'
        )}
      />
      <span
        className={cn(
          'relative z-10 flex w-1/2 justify-center font-mono text-[9px] tracking-widest',
          checked ? 'text-amber/70' : 'text-bone-dim'
        )}
      >
        {offLabel}
      </span>
      <span
        className={cn(
          'relative z-10 flex w-1/2 justify-center font-mono text-[9px] tracking-widest',
          checked ? 'text-ink' : 'text-bone-faint'
        )}
      >
        {onLabel}
      </span>
    </button>
  </div>
);
