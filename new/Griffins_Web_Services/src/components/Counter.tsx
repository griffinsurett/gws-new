import { useEffect, useState } from "react";

interface CounterProps {
  start?: number;
  end: number;
  duration?: number;
  className?: string;
  onComplete?: () => void;
}

export default function Counter({
  start = 0,
  end,
  duration = 2000,
  className = "",
  onComplete,
}: CounterProps) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    const range = end - start;
    if (range === 0) return;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    const increment = end > start ? 1 : -1;

    const timer = setInterval(() => {
      current += increment;
      setCount(current);
      if (current === end) {
        clearInterval(timer);
        onComplete?.();
      }
    }, Math.max(stepTime, 16));

    return () => clearInterval(timer);
  }, [start, end, duration, onComplete]);

  return <span className={className}>{count}</span>;
}
