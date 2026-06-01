import { cn } from "@/lib/utils";

interface MiniWaveformProps {
  bars: number[];
  accent?: string;
  active?: boolean;
  className?: string;
  height?: "sm" | "md" | "lg";
}

const heightMap = { sm: 14, md: 20, lg: 28 };

export function MiniWaveform({
  bars,
  accent = "var(--cr-amber)",
  active = false,
  className,
  height = "md",
}: MiniWaveformProps) {
  const h = heightMap[height];
  return (
    <div className={cn("flex items-end gap-0.5", className)} style={{ height: h }}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className="w-0.5 rounded-full transition-all duration-500"
          style={{
            height: `${bar}%`,
            background: accent,
            opacity: active ? 0.62 : 0.28,
            animation: active
              ? `breathe ${1.4 + (i % 5) * 0.25}s ease-in-out infinite`
              : `breathe ${3 + (i % 5) * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Deterministic bar heights from a numeric seed */
export function seedWaveBars(seed: number, count = 32): number[] {
  let s = ((seed * 1664525) + 1013904223) >>> 0;
  return Array.from({ length: count }, () => {
    s = ((s * 1664525) + 1013904223) >>> 0;
    return (s % 70) + 22;
  });
}
