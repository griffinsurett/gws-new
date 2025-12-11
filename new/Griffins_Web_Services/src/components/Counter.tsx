import { useEffect, useState, type CSSProperties } from "react";

interface CounterProps {
  start?: number;
  end: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  decimals?: number;
  onComplete?: () => void;
}

const getDecimalPlaces = (value?: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  const [, fraction] = value.toString().split(".");
  return fraction ? fraction.length : 0;
};

const formatValue = (value: number, decimals: number) =>
  decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();

export default function Counter({
  start = 0,
  end,
  duration = 2000,
  className = "",
  style,
  decimals,
  onComplete,
}: CounterProps) {
  const [displayValue, setDisplayValue] = useState(start);
  const resolvedDecimals =
    typeof decimals === "number" && !Number.isNaN(decimals)
      ? Math.max(0, decimals)
      : Math.max(getDecimalPlaces(start), getDecimalPlaces(end));

  useEffect(() => {
    let rafId: number;
    const range = end - start;
    if (range === 0) {
      setDisplayValue(end);
      return undefined;
    }

    const startTime = performance.now();
    const resolvedDuration = duration <= 0 ? 0 : duration;

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = resolvedDuration === 0 ? 1 : Math.min(elapsed / resolvedDuration, 1);
      const value = start + range * progress;
      setDisplayValue(value);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [start, end, duration, onComplete]);

  const formattedTarget = formatValue(end, resolvedDecimals);
  const minWidthCh = Math.max(1, formattedTarget.length);
  const baseClasses = ["counter-value", "tabular-nums", className]
    .filter(Boolean)
    .join(" ");
  const mergedStyles: CSSProperties = {
    display: "inline-block",
    minWidth: `calc(${minWidthCh}ch)`,
    ...style,
  };

  return (
    <span className={baseClasses} style={mergedStyles}>
      {formatValue(displayValue, resolvedDecimals)}
    </span>
  );
}
