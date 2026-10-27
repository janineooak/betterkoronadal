import { useEffect, type ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Inbox, Loader2, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SENSITIVE_KINDS } from './helpers';

type Variant = 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost';

const variants: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary:
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-amber-600 text-white hover:bg-amber-700',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
};

export function Button({
  variant = 'primary',
  size = 'md',
  busy,
  icon,
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: 'sm' | 'md';
  busy?: boolean;
  icon?: ReactNode;
}) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || busy}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
        variants[variant],
        className
      )}
    >
      {busy ? (
        <Loader2
          className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4', 'animate-spin')}
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}

export function Notice({
  tone,
  children,
  onClose,
  className,
}: {
  tone: 'success' | 'error' | 'info';
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  const styles = {
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-700',
    info: 'border-primary-100 bg-primary-50 text-primary-800',
  }[tone];
  const Icon = tone === 'success' ? CheckCircle2 : AlertTriangle;
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start justify-between gap-3 rounded-lg border p-3 text-sm',
        styles,
        className
      )}
    >
      <span className="flex items-start gap-2">
        {tone !== 'info' && <Icon className="mt-0.5 h-4 w-4 shrink-0" />}
        <span>{children}</span>
      </span>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" className="shrink-0">
          <X className="h-4 w-4 opacity-60 hover:opacity-100" />
        </button>
      )}
    </div>
  );
}

/** Bottom-corner toast that clears itself. */
export function Toast({
  toast,
  onDone,
}: {
  toast: { tone: 'success' | 'error'; text: string; id: number } | null;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDone, toast.tone === 'error' ? 8000 : 4000);
    return () => clearTimeout(t);
  }, [toast, onDone]);
  if (!toast) return null;
  return (
    <div className="fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6">
      <Notice
        tone={toast.tone}
        onClose={onDone}
        className="w-full max-w-sm shadow-lg"
      >
        {toast.text}
      </Notice>
    </div>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <div className="rounded-full bg-gray-100 p-3">
        <Inbox className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-900">{title}</p>
      {children && <p className="text-sm text-gray-500">{children}</p>}
    </div>
  );
}

export function KindBadge({ kind }: { kind: string }) {
  const sensitive = SENSITIVE_KINDS.has(kind);
  return (
    <span
      className={cn(
        'rounded-md px-2 py-0.5 text-xs font-medium capitalize',
        sensitive ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
      )}
    >
      {kind.replace(/_/g, ' ')}
    </span>
  );
}

/** Render arbitrary JSON as a readable key/value list. */
export function DataList({ data }: { data: unknown }) {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const entries = Object.entries(data as Record<string, unknown>).filter(
      ([, v]) => v !== null && v !== undefined && v !== ''
    );
    if (!entries.length)
      return <p className="text-xs text-gray-400">No extra data.</p>;
    return (
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-[9rem_1fr]">
        {entries.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-semibold capitalize text-gray-500">
              {k.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')}
            </dt>
            <dd className="whitespace-pre-wrap break-words text-gray-800">
              {typeof v === 'string' ? (
                /^https?:\/\//.test(v) ? (
                  <a
                    href={v}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-700 underline"
                  >
                    {v}
                  </a>
                ) : (
                  v
                )
              ) : (
                <code className="text-[11px]">
                  {JSON.stringify(v, null, 1)}
                </code>
              )}
            </dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <p className="whitespace-pre-wrap text-xs text-gray-800">
      {typeof data === 'string' ? data : JSON.stringify(data)}
    </p>
  );
}
