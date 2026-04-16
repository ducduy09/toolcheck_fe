import { SourceKey } from "@src/StatusBadge";

// ── Source config ─────────────────────────────────────────────────────────────
export const SOURCE_CONFIG: Record<SourceKey, { label: string; color: string; bg: string }> = {
  lcsc: { label: "LCSC", color: "#1a56a0", bg: "#dbeafe" },
  tgic: { label: "TGIC", color: "#6d28d9", bg: "#ede9fe" },
  cxt:  { label: "CXT",  color: "#b45309", bg: "#fef3c7" },
  lkcl: { label: "LKCL", color: "#065f46", bg: "#d1fae5" },
  blk:  { label: "BLK",  color: "#5f0656", bg: "#f8d1fa" },
  mouser:  { label: "MOUSER",  color: "#5f3606", bg: "#fae7d1" },
  dgkey:  { label: "DGKEY",  color: "#e7240e", bg: "#fad1d1" },
};