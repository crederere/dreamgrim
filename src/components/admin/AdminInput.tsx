import { cn } from "@/lib/utils/cn";

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function AdminInput({ label, error, className, ...props }: AdminInputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-[12px] text-text-muted/50 font-medium">{label}</label>}
      <input
        className={cn(
          "w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted/25 focus:border-primary-500/30 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-colors",
          error && "border-fortune-low/30",
          className,
        )}
        {...props}
      />
      {error && <p className="text-[11px] text-fortune-low/70">{error}</p>}
    </div>
  );
}

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function AdminSelect({ label, options, className, ...props }: AdminSelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-[12px] text-text-muted/50 font-medium">{label}</label>}
      <select
        className={cn(
          "w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-text-primary focus:border-primary-500/30 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-colors appearance-none",
          className,
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface-100 text-text-primary">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function AdminTextarea({ label, className, ...props }: AdminTextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-[12px] text-text-muted/50 font-medium">{label}</label>}
      <textarea
        className={cn(
          "w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted/25 focus:border-primary-500/30 focus:outline-none focus:ring-1 focus:ring-primary-500/20 transition-colors resize-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}
