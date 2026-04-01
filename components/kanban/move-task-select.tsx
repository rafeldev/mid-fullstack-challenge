"use client";

type MoveTaskSelectProps = {
  value: number;
  options: Array<{ id: number; name: string }>;
  disabled?: boolean;
  onChange: (columnId: number) => void;
};

export function MoveTaskSelect({
  value,
  options,
  disabled = false,
  onChange,
}: MoveTaskSelectProps) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-tertiary)]">
      Mover a
      <select
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface-2)] px-2 py-1 text-[11px] text-[var(--text-secondary)] outline-none transition focus:border-[var(--border-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}
