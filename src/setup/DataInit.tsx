import { KeyNameProps, ModalDataType } from "@type";

export const currencyMap: Record<string, ModalDataType> = {
  USD: { value: "USD", title: "🇺🇸 USD", details: "United State Dollar" },
  EUR: { value: "EUR", title: "🇪🇺 EUR", details: "EURO" },
  CZK: { value: "CZK", title: "🇨🇿 CZK", details: "Czech koruna" },
  CNY: { value: "CNY", title: "🇨🇳 CNY", details: "Chinese yuan" },
  AUD: { value: "AUD", title: "🇦🇺 AUD", details: "Australian Dollar" },
  GBP: { value: "GBP", title: "🇬🇧 GBP", details: "British Pound" },
  CHF: { value: "CHF", title: "🇨🇭 CHF", details: "Swiss Franc" },
  JPY: { value: "JPY", title: "🇯🇵 JPY", details: "Japanese Yen" },
  NDT: { value: "NDT", title: "🇳🇵 NDT", details: "Nepalese rupee" },
  RUB: { value: "RUB", title: "🇷🇺 RUB", details: "Russian ruble" },
  SGD: { value: "SGD", title: "🇸🇬 SGD", details: "Singapore Dollar" },
  HUF: { value: "HUF", title: "🇭🇺 HUF", details: "Hungarian forint" },
  VND: { value: "VND", title: "🇻🇳 VND", details: "Vietnamese Dong" },
  PLN: { value: "PLN", title: "🇵🇱 PLN", details: "Polish złoty" },
  TWD: { value: "TWD", title: "🇹🇼 TWD", details: "New Taiwan dollar" },
  SAR: { value: "SAR", title: "🇸🇦 SAR", details: "Saudi Arabian riyal" },
  KWD: { value: "KWD", title: "🇰🇼 KWD", details: "Kuwaiti dinar" },
  INR: { value: "INR", title: "🇮🇳 INR", details: "Indian rupee" },
  MYR: { value: "MYR", title: "🇲🇾 MYR", details: "Malaysian ringgit" },
  KRW: { value: "KRW", title: "🇰🇷 KRW", details: "South Korean won" },
  XAU: { value: "XAU", title: "⚜️ XAU", details: "GOLD" },
  KPW: { value: "KPW", title: "🇰🇵 KPW", details: "North Korean won" },
  IDR: { value: "IDR", title: "🇮🇩 IDR", details: "Indonesian rupiah" },
  SEK: { value: "SEK", title: "🇸🇪 SEK", details: "Swedish krona" },
  NZD: { value: "NZD", title: "🇳🇿 NZD", details: "New Zealand dollar" },
  NOK: { value: "NOK", title: "🇳🇴 NOK", details: "Norwegian krone" },
  HKD: { value: "HKD", title: "🇭🇰 HKD", details: "Hong Kong dollar" },
  DKK: { value: "DKK", title: "🇩🇰 DKK", details: "Danish krone" },
  THB: { value: "THB", title: "🇹🇭 THB", details: "Thai baht" },
  CAD: { value: "CAD", title: "🇨🇦 CAD", details: "Canadian Dollar" },
  AED: { value: "AED", title: "🇦🇪 AED", details: "United Arab Emirates" },
  ZAR: { value: "ZAR", title: "🇿🇦 ZAR", details: "South Africa Republic" },
};


export const statusColor: Record<string, string> = {
  APPROVED: "bg-green-100 text-green-700",
  REFUSED: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  MAKEUP: "bg-blue-100 text-blue-700",
  //   "On Sale": "bg-blue-100 text-blue-700",
  //   Bouncing: "bg-purple-100 text-purple-700",
};

export const statusUserColor: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  DELETE: "bg-red-100 text-red-700",
  INACTIVE: "bg-yellow-100 text-yellow-700",
  //   "On Sale": "bg-blue-100 text-blue-700",
  //   Bouncing: "bg-purple-100 text-purple-700",
};

export const statusHolidayColor: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  DELETE: "bg-red-100 text-red-700",
}

export const statusMakeupColor: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  DELETED: "bg-red-100 text-red-700",
}

export const listStatusRequest: Record<string, string> = {
  APPROVED: "approved",
  REFUSED: "refused",
  PENDING: "pending",
  MAKEUP: "makeup"
};

export const listTypeRequest: Record<string, string> = {
  OFF: "off",
  LATE: "late",
  OVERTIME: "overtime",
  FORGET: "forgetCheck",
  PART_OFF: "partOff",
  MAKEUP: "makeup"
};

export const listMonth: KeyNameProps[] = [
  { id: "1", name: "month1" },
  { id: "2", name: "month2" },
  { id: "3", name: "month3" },
  { id: "4", name: "month4" },
  { id: "5", name: "month5" },
  { id: "6", name: "month6" },
  { id: "7", name: "month7" },
  { id: "8", name: "month8" },
  { id: "9", name: "month9" },
  { id: "10", name: "month10" },
  { id: "11", name: "month11" },
  { id: "12", name: "month12" },
];

export const listYearActive: KeyNameProps[] = [
  { id: "2025", name: "Năm 2025" },
  { id: "2026", name: "Năm 2026" },
];

export const listDepartment: KeyNameProps[] = [
  { id: "DIP", name: "DIP" },
  { id: "SMT", name: "SMT" },
  { id: "KHO", name: "KHO" },
  { id: "QC", name: "QC" },
  { id: "HR", name: "Nhân sự"},
  { id: "TECH", name: "Kỹ thuật"},
];
export const listPosition: KeyNameProps[] = [
  { id: "USER_MANAGEMENT", name: "Nhân viên" },
  { id: "ADMIN_USER_MANAGEMENT", name: "Quản lý" },
  { id: "ALL", name: "Sếp tổng" },
];

export const listWorkShift: KeyNameProps[] = [
  { id: "FULL", name: "Cả ngày" },
  { id: "MORNING", name: "Ca sáng" },
  { id: "AFTERNOON", name: "Ca chiều" },
]