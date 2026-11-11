import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import type { Guide } from "@/lib/tajweed/data";

export const toneChip: Record<Guide["tone"], string> = {
  emerald: "bg-emerald-soft text-emerald-deep",
  gold: "bg-gold-soft text-gold",
  clay: "bg-clay-soft text-clay",
  ink: "border border-line bg-paper text-ink",
};

export function Chip({ tone, children }: { tone: Guide["tone"]; children: string }) {
  return <span className={clsx("inline-flex rounded-control px-3 py-1 text-sm font-medium", toneChip[tone])}>{children}</span>;
}

export function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-emerald px-4 py-3 font-medium text-on-emerald transition-colors hover:bg-emerald-deep disabled:opacity-50",
        className,
      )}
    />
  );
}

export function GhostButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-line bg-paper px-4 py-3 font-medium text-ink transition-colors hover:bg-gold-soft disabled:opacity-50",
        className,
      )}
    />
  );
}
