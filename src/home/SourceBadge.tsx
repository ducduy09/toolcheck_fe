import { SourceKey } from "@src/StatusBadge";
import { SOURCE_CONFIG } from "./config";

// ── SourceBadge ───────────────────────────────────────────────────────────────
export const SourceBadge = ({ source }: { source: string }) => {
  const cfg = SOURCE_CONFIG[source.toLowerCase() as SourceKey] ?? { label: source, color: "#5a5a4a", bg: "#f0ece4" };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
};