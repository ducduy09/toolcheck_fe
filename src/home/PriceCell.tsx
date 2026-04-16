import { PriceProps } from "@src/type";
import { useEffect, useRef, useState } from "react";

// ── PriceCell ─────────────────────────────────────────────────────────────────
export const PriceCell = ({ type, prices }: { type: string; prices: PriceProps[] }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
 
  // Đóng khi click ngoài
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !btnRef.current?.contains(target) &&
        !popupRef.current?.contains(target)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
 
  // Đóng khi scroll
  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener("scroll", handler, true);
    return () => window.removeEventListener("scroll", handler, true);
  }, [open]);
 
  // Đóng khi unmount
  useEffect(() => () => setOpen(false), []);
 
  if (prices.length === 0)
    return <span style={{ color: "#a0a090", fontSize: 12 }}>—</span>;
 
  const base = prices[0];
  const hasLadder = prices.length > 1;
 
  // Lấy vị trí trực tiếp từ event, không dùng ref
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (open) { setOpen(false); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const popupWidth = 224;
    const left = rect.left + popupWidth > window.innerWidth
      ? rect.right - popupWidth
      : rect.left;
    setPos({ top: rect.bottom + 8, left });
    setOpen(true);
  };
 
  return (
    <>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold" style={{ color: "#2a2a1e", fontFamily: "'DM Sans', sans-serif" }}>
          {type === "lcsc" || type === "mouser" || type === "dgkey"  ? base.price.toFixed(3) : base.price.toLocaleString()} {type === "lcsc" || type === "mouser"|| type === "dgkey" ? "$" : "đ"}
        </span>
        {hasLadder && (
          <button
            ref={btnRef}
            onClick={handleClick}
            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold transition-all hover:scale-110"
            style={{
              background: open ? "#8fa650" : "#e8f0d8",
              color: open ? "#fff" : "#5d7a2a",
            }}
          >
            {prices.length}
          </button>
        )}
      </div>
 
      {open && (
        <div
          ref={popupRef}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: 224,
            zIndex: 9999,
            background: "#fff",
            border: "1.5px solid #e5e0d6",
            borderRadius: 14,
            boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
            animation: "fadeInPop 0.13s ease",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-3 py-2.5"
            style={{ background: "#f7f5ef", borderBottom: "1px solid #e5e0d6" }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#7a7a6a", fontFamily: "'DM Sans', sans-serif" }}>
              Bảng giá bậc thang
            </span>
            <button
              onClick={() => setOpen(false)}
              className="w-5 h-5 rounded flex items-center justify-center transition-colors hover:bg-stone-200"
              style={{ color: "#9a9a8a" }}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1 1l7 7M8 1L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
 
          {/* Col headers */}
          <div
            className="grid px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ gridTemplateColumns: "1fr 1fr", color: "#b0b0a0", fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid #f0ece4" }}
          >
            <span>Qty (min)</span>
            <span className="text-right">Unit Price</span>
          </div>
 
          {/* Price rows */}
          {prices.map((p, i) => (
            <div
              key={i}
              className="grid items-center transition-colors hover:bg-stone-50"
              style={{
                gridTemplateColumns: "1fr 1fr",
                padding: "7px 12px",
                borderTop: i > 0 ? "1px solid #f0ece4" : undefined,
                background: i === 0 ? "#fafdf6" : undefined,
              }}
            >
              <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: "#3a3a2e", fontFamily: "'DM Sans', sans-serif" }}>
                {p.quantity >= 1000
                  ? `${(p.quantity / 1000).toFixed(p.quantity % 1000 === 0 ? 0 : 1)}k`
                  : p.quantity}
                {i === 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{ background: "#e8f0d8", color: "#5d7a2a" }}>
                    base
                  </span>
                )}
              </span>
              <span className="text-xs font-bold text-right" style={{ color: i === 0 ? "#2a2a1e" : "#5d7a2a", fontFamily: "'DM Sans', sans-serif" }}>
                {type === "lcsc" || type === "mouser" || type === "dgkey" ? p.price.toFixed(3) : p.price.toLocaleString()} {type === "lcsc" || type === "mouser" || type === "dgkey" ? "$" : "đ"}
              </span>
            </div>
          ))}
 
          <style>{`
            @keyframes fadeInPop {
              from { opacity: 0; transform: translateY(-6px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
};