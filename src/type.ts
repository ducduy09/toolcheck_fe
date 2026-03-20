export interface ProductProps {
  lcsc: LinhKienResult[];
  tgic: LinhKienResult[];
  cxt: LinhKienResult[];
  lkcl: LinhKienResult[];
  blk: LinhKienResult[];
}

export interface LinhKienResult {
    name: string;           // Tên model đầy đủ (productModel)
    mfrPart: string;        // Mã nhà sản xuất (productCodeManufacturer)
    manufacturer: string;   // Hãng sản xuất (brandNameEn)
    batchNumber: string;    // Số lô (batchNumber)
    stock: string;         // Tồn kho (stockNumber) - QUAN TRỌNG
    source: string;         // Nguồn dữ liệu (Ví dụ: "LCSC")
    datasheetUrl: string;   // Link PDF (nếu có)
    description: string;   // mô tả
    imageUrl: string;      // Link ảnh (nếu có)
    productUrl: string;    // Link sản phẩm (nếu có)
    prices: PriceProps[]; // Danh sách giá bậc thang
}
export interface PriceProps {
  quantity: number; //ladder
  price: number; // usdPrice
}
