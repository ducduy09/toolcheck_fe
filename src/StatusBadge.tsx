import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ProductProps, LinhKienResult } from "./type";
import { fetchProduct } from "./api/data";
import LoadingManager from "@component/loading/LoadingManager";
import { PriceCell } from "./home/PriceCell";
import { StockBadge } from "./home/StockBadge";
import { SOURCE_CONFIG } from "./home/config";
import { SourceBadge } from "./home/SourceBadge";
import images from "@setup_assets/image/images";


export type SourceKey = keyof ProductProps;

const PAGE_SIZE = 10;

// ── Flatten ProductProps → flat list ──────────────────────────────────────────
function flattenProduct(data: ProductProps): LinhKienResult[] {
  return (Object.keys(data) as SourceKey[]).flatMap((key) =>
    (data[key] ?? []).map((item) => ({ ...item, source: key.toUpperCase() }))
  );
}

// ── Grid columns ──────────────────────────────────────────────────────────────
// ☐ | Ảnh | Tên SP + mô tả | mfrPart + lô | Hãng | Tồn kho | Giá | Source | Links
const GRID = "36px 48px 2fr 1.4fr 1fr 90px 110px 62px 72px";
// ── LinkButton ────────────────────────────────────────────────────────────────
const LinkButton = ({ href, title }: { href?: string; title: string }) => {
  if (!href) return <span className="w-7 h-7 inline-flex" style={{ color: "#e0ddd6" }}>—</span>;
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer" title={title}
      className="inline-flex items-center justify-center w-7 h-7 rounded-lg transition-colors hover:bg-stone-100"
      style={{ color: "#5d7a2a" }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M8 1h4v4M12 1L6.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  );
};

const LinkPDF = ({ href, title }: { href?: string; title: string }) => {
  if (!href) return <span className="w-7 h-7 inline-flex" style={{ color: "#e0ddd6" }}>—</span>;
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer" title={title}
      className="inline-flex items-center justify-center w-7 h-7 rounded-lg transition-colors hover:bg-stone-100"
      style={{ color: "#5d7a2a" }}
    >
      <img src={images.pdf_icon} alt={title} className="w-6"/>
    </a>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdvertisementsPage() {
  const loadingRef = useRef<any>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeSource, setActiveSource] = useState<SourceKey | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ProductProps>({ lcsc: [], tgic: [], cxt: [], lkcl: [], blk: [], mouser: [], dgkey: [] });

  const handleSearchComponent = useCallback(async (query: string) => {
    try {
      const result = await fetchProduct(query);
      if (result) setData(result);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadingRef && LoadingManager.register(loadingRef);
    return () => {
      LoadingManager.unregister(loadingRef);
    };
  }, []);

  // Bỏ handleSearch riêng, gộp vào onChange luôn
  // setPage(1) khi search thay đổi
  useEffect(() => {
    setPage(1);
  }, [search]);

  const allItems = flattenProduct(data);

  const sourceCounts = useMemo(() => {
    const c: Record<string, number> = { all: allItems.length };
    (Object.keys(data) as SourceKey[]).forEach((k) => { c[k] = data[k]?.length ?? 0; });
    return c;
  }, [allItems, data]);

  const filtered = useMemo(() => {
    if (activeSource === "all") return allItems;
    return allItems.filter((item) => item.source.toLowerCase() === activeSource);
  }, [allItems, activeSource]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const rowKey = (item: LinhKienResult) => `${item.name}-${item.mfrPart}-${item.prices.length > 0 ? item.prices[0].price : 0}`;

  const toggleRow = (key: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const toggleAll = () => {
    const keys = paginated.map(rowKey);
    const allChecked = keys.every((k) => selected.has(k));
    setSelected((prev) => {
      const n = new Set(prev);
      allChecked ? keys.forEach((k) => n.delete(k)) : keys.forEach((k) => n.add(k));
      return n;
    });
  };

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleSource = (s: SourceKey | "all") => { setActiveSource(s); setPage(1); };

  const pageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const allPageChecked = paginated.length > 0 && paginated.every((i) => selected.has(rowKey(i)));

  return (
      <div className="min-h-screen p-6" style={{ background: "#6b7f3e" }}>
      <div
        className="w-full max-w-[1400px] mx-auto rounded-3xl shadow-2xl flex flex-col"
        style={{ background: "#f7f5ef", height: "calc(100vh - 48px)" }}
      >
        {/* ── Top bar (sticky) ── */}
        <div className="flex-shrink-0 flex items-center gap-3 px-6 py-4 border-b rounded-t-3xl" style={{ borderColor: "#e5e0d6", background: "#f7f5ef" }}>
          {/* Search */}
          <div className="relative" style={{ flex: "0 0 420px" }}>
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Tìm tên, mã linh kiện, hãng sản xuất..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchComponent(e.currentTarget.value);
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: "#fff", border: "1.5px solid #e5e0d6", color: "#3a3a2e", fontFamily: "'DM Sans', sans-serif" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#8fa650")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e0d6")}
            />
          </div>
 
          {/* Source tabs */}
          <div className="flex items-center gap-1 ml-auto">
            {(["all", ...Object.keys(SOURCE_CONFIG)] as (SourceKey | "all")[]).map((src) => {
              const isActive = activeSource === src;
              const cfg = src !== "all" ? SOURCE_CONFIG[src as SourceKey] : null;
              return (
                <button
                  key={src}
                  onClick={() => handleSource(src)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: isActive ? (cfg?.bg ?? "#e8f0d8") : "transparent",
                    color: isActive ? (cfg?.color ?? "#3a3a2e") : "#8a8a7a",
                    border: `1.5px solid ${isActive ? (cfg?.color ?? "#3a3a2e") + "33" : "transparent"}`,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {src === "all" ? "Tất cả" : cfg!.label}
                  <span
                    className="inline-flex items-center justify-center rounded-full text-[10px] font-bold px-1.5"
                    style={{
                      background: isActive ? `${cfg?.color ?? "#3a3a2e"}22` : "#f0ece4",
                      color: isActive ? (cfg?.color ?? "#3a3a2e") : "#8a8a7a",
                      minWidth: 20, height: 18,
                    }}
                  >
                    {sourceCounts[src] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
 
        {/* ── Table ── */}
        <div className="flex-1 flex flex-col overflow-hidden px-6 pt-5 pb-6">
          <div className="flex-1 flex flex-col rounded-2xl overflow-hidden" style={{ border: "1.5px solid #e5e0d6", background: "#fff" }}>
 
            {/* Tiêu đề cột — cố định */}
            <div
              className="flex-shrink-0 grid text-[11px] font-semibold px-4 py-3 uppercase tracking-wide"
              style={{ gridTemplateColumns: GRID, color: "#8a8a7a", fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid #f0ece4", background: "#fff" }}
            >
              <div className="flex items-center">
                <input type="checkbox" checked={allPageChecked} onChange={toggleAll} className="w-4 h-4 rounded cursor-pointer accent-green-600" />
              </div>
              <div />
              <div>Tên SP</div>
              <div>mfrPart</div>
              <div>Hãng SX</div>
              <div>Tồn kho</div>
              <div>Giá</div>
              <div>Source</div>
              <div>Links</div>
            </div>
 
            {/* Rows — chỉ phần này cuộn */}
            <div className="flex-1 overflow-y-auto">
              {paginated.length === 0 ? (
                <div className="py-20 text-center" style={{ color: "#a0a090", fontFamily: "'DM Sans', sans-serif" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                  <div className="text-sm font-medium">Không tìm thấy kết quả</div>
                </div>
              ) : (
                paginated.map((item, idx) => {
                  const key = rowKey(item);
                  const isSelected = selected.has(key);
                  return (
                    <div
                      key={key}
                      className="grid px-4 py-3 items-center"
                      style={{
                        gridTemplateColumns: GRID,
                        borderTop: idx > 0 ? "1px solid #f0ece4" : undefined,
                        background: isSelected ? "#f5f9ee" : undefined,
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#fafaf7"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? "#f5f9ee" : ""; }}
                    >
                      {/* Checkbox */}
                      <div>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleRow(key)} className="w-4 h-4 rounded cursor-pointer accent-green-600" />
                      </div>
 
                      {/* Ảnh */}
                      <div className="flex items-center justify-center">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-9 h-9 rounded-lg object-contain" style={{ border: "1px solid #f0ece4" }} />
                        ) : (
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#f0f4e6" }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "#8fa650" }}>
                              <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                              <circle cx="5.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                              <path d="M1 11l4-3 3 2.5 2.5-2 4.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>
 
                      {/* Tên SP + mô tả */}
                      <div className="pr-3 min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color: "#2a2a1e", fontFamily: "'DM Sans', sans-serif" }}>
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-xs truncate mt-0.5" style={{ color: "#9a9a8a", fontFamily: "'DM Sans', sans-serif" }}>
                            {item.description}
                          </div>
                        )}
                      </div>
 
                      {/* mfrPart + Lô */}
                      <div className="pr-2 min-w-0">
                        <span className="text-xs font-mono truncate block" style={{ color: "#5a7a2a", letterSpacing: "0.02em" }}>
                          {item.mfrPart}
                        </span>
                        <span className="text-[10px] mt-0.5 block truncate" style={{ color: "#b0b0a0", fontFamily: "'DM Sans', sans-serif" }}>
                          Lô: {item.batchNumber || "—"}
                        </span>
                      </div>
 
                      {/* Hãng SX */}
                      <div className="text-sm truncate pr-2" style={{ color: "#3a3a2e", fontFamily: "'DM Sans', sans-serif" }}>
                        {item.manufacturer}
                      </div>
 
                      {/* Tồn kho */}
                      <div><StockBadge stock={item.stock} /></div>
 
                      {/* Giá */}
                      <div><PriceCell type={item.source.toLocaleLowerCase()} prices={item.prices} /></div>
 
                      {/* Source */}
                      <div><SourceBadge source={item.source} /></div>
 
                      {/* Links */}
                      <div className="flex items-center gap-0.5">
                        <LinkPDF href={item.datasheetUrl || undefined} title="Datasheet PDF" />
                        <LinkButton href={item.productUrl || undefined} title="Trang sản phẩm" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
 
          {/* ── Pagination — cố định ── */}
          <div className="flex-shrink-0 flex items-center justify-between pt-4 px-1">
            <span className="text-xs" style={{ color: "#a0a090", fontFamily: "'DM Sans', sans-serif" }}>
              {filtered.length} kết quả · Trang {page}/{totalPages}
            </span>
            <div className="flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg transition-all disabled:opacity-30"
                style={{ color: "#5a5a4a" }}>← Prev
              </button>
              {pageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`e${i}`} className="px-2 text-sm" style={{ color: "#a0a090" }}>...</span>
                ) : (
                  <button key={p} onClick={() => setPage(p as number)}
                    className="w-8 h-8 rounded-full text-sm font-medium transition-all"
                    style={{ background: page === p ? "#8fa650" : "transparent", color: page === p ? "#fff" : "#5a5a4a" }}>
                    {p}
                  </button>
                )
              )}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg transition-all disabled:opacity-30"
                style={{ color: "#5a5a4a" }}>Next →
              </button>
            </div>
          </div>
        </div>
      </div>
 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        input[type="checkbox"] { cursor: pointer; }
      `}</style>
    </div>
  );
}