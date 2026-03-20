// ── StockBadge ────────────────────────────────────────────────────────────────
export const StockBadge = ({ stock }: { stock: string }) => {
  const num = parseInt(stock.replace(/\D/g, ""), 10);
  const color = isNaN(num) ? "#8a8a7a" : num > 1000 ? "#15803d" : num > 0 ? "#b45309" : "#dc2626";
  return (
    <span className="text-sm font-medium" style={{ color, fontFamily: "'DM Sans', sans-serif" }}>
      {stock || "—"}
    </span>
  );
};