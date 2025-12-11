import type { ReactNode } from "react";
import Counter from "@/components/Counter";
import AnimatedBorder from "@/components/AnimatedBorder/AnimatedBorder";

type StatRecord = Record<string, any> | null | undefined;

const resolveField = (records: (Record<string, any> | undefined)[], key: string) => {
  for (const record of records) {
    if (!record || typeof record !== "object") continue;
    const value = record[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
};

const toNumericValue = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const getDecimalPlaces = (value?: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  const [, decimals] = value.toString().split(".");
  return decimals ? decimals.length : 0;
};

export interface StatCardProps {
  data?: StatRecord;
  className?: string;
}

export default function StatCard({ data, className = "" }: StatCardProps): ReactNode {
  const entry = (data && typeof data === "object" ? (data as Record<string, any>) : {}) ?? {};
  const fields = entry.data && typeof entry.data === "object" ? entry.data : undefined;
  const sources = [fields, entry];

  const statValueRaw = resolveField(sources, "statValue");
  const statStartRaw = resolveField(sources, "statStart");
  const statPrefixRaw = resolveField(sources, "statPrefix");
  const statSuffixRaw = resolveField(sources, "statSuffix");
  const statAnimateRaw = resolveField(sources, "statAnimate");
  const titleRaw = resolveField(sources, "title");
  const descriptionRaw = resolveField(sources, "description");

  const title = typeof titleRaw === "string" ? titleRaw : undefined;
  const description = typeof descriptionRaw === "string" ? descriptionRaw : undefined;

  const value = toNumericValue(statValueRaw);
  const startValue = toNumericValue(statStartRaw) ?? 0;
  const prefix = typeof statPrefixRaw === "string" ? statPrefixRaw : "";
  const suffix = typeof statSuffixRaw === "string" ? statSuffixRaw : "";
  const animate = statAnimateRaw !== false;

  const shouldAnimate = animate && typeof value === "number";
  const decimalPlaces = Math.max(
    getDecimalPlaces(value),
    getDecimalPlaces(startValue),
  );

  const formattedStaticValue =
    value !== undefined
      ? (decimalPlaces > 0 ? value.toFixed(decimalPlaces) : value.toString())
      : undefined;

  const fallbackText =
    value !== undefined
      ? `${prefix ?? ""}${formattedStaticValue}${suffix ?? ""}`
      : (title ?? "");

  const cardClasses = [
    "card-bg",
    "rounded-2xl",
    "border",
    "border-accent/15",
    "p-6",
    "text-center",
    "relative",
    "overflow-hidden",
    "outer-card-transition outer-card-hover-transition",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AnimatedBorder
      variant="progress-b-f"
      className={cardClasses}
      borderRadius="rounded-2xl"
      borderWidth={2}
      duration={800}
    >
      <p className="text-heading text-4xl font-bold">
        {shouldAnimate && typeof value === "number" ? (
          <span className="inline-flex items-baseline justify-center gap-1">
            {prefix && <span>{prefix}</span>}
            <Counter
              start={startValue}
              end={value}
              decimals={decimalPlaces}
              className="leading-none"
            />
            {suffix && <span>{suffix}</span>}
          </span>
        ) : (
          fallbackText || "—"
        )}
      </p>

      {title && (
        <p className="text-muted text-sm uppercase tracking-[0.35em] mt-2">
          {title}
        </p>
      )}

      {description && (
        <p className="text-muted text-sm leading-relaxed mt-3">
          {description}
        </p>
      )}
    </AnimatedBorder>
  );
}
