import moment from "moment";
import SVGS from "@setup_assets/image/svgs";
import { ModalDataType } from "@type";
import { currencyMap } from "./DataInit";

// Lấy tổng số ngày chủ nhật của 1 tháng
export const getSundaysInMonth = (year: number, month: number) => {
  let sundays = [];
  // Bắt đầu từ ngày 1 của tháng đã cho
  let date = new Date(Date.UTC(year, month, 1)); 
  
  while (date.getUTCMonth() === month) {
    // getUTCDay() === 0 là Chủ Nhật (Sunday)
    if (date.getUTCDay() === 0) {
      // Đẩy đối tượng Date dưới dạng UTC
      sundays.push(new Date(date)); 
    }
    // Tăng ngày lên 1 (sử dụng setUTCDate để tránh lỗi DST)
    date.setUTCDate(date.getUTCDate() + 1); 
  }

  return sundays;
};

// lấy ngày hiện tại
export const getCurrentDate = () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  return moment(`${day}/${month}/${year}`, "DD/MM/YYYY").format("DD/MM/YYYY");
};

// lấy số ngày trong tháng
export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month+1, 0).getDate();
}

// lấy số ngày chủ nhật của tháng hiện tại tính đến ngày hôm nay
export const getSundaysInMonthToToday = (year: number, month: number) => {
  let sundays = [];
  const today = new Date(); // Lấy ngày hôm nay
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())); // Lấy ngày hôm nay dưới dạng UTC

  // 1. Kiểm tra nếu tháng truyền vào không phải là tháng hiện tại (cả năm và tháng)
  if (year !== today.getFullYear() || month !== today.getMonth()) {
    // Nếu không phải tháng hiện tại, nên trả về mảng rỗng hoặc xử lý lỗi
    console.warn("Chỉ tính Chủ Nhật đến ngày hôm nay trong tháng hiện tại.");
    return [];
  }
  
  // Bắt đầu từ ngày 1 của tháng đã cho (sử dụng UTC)
  let date = new Date(Date.UTC(year, month, 1)); 

  // 2. Sửa lỗi logic: date.getTime() <= todayUTC.getTime()
  // Lặp cho đến khi ngày truyền vào KHÔNG vượt quá ngày hôm nay (tính theo UTC)
  while (date.getUTCMonth() === month && date.getTime() <= todayUTC.getTime()) {
    if (date.getUTCDay() === 0) {
      sundays.push(new Date(date));
    }
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return sundays;
};

// Hàm lấy ngày đầu tiên của tháng hiện tại
export const getDateFirstInMonthCurrent = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  return moment(`01/${month}/${year}`, "DD/MM/YYYY").toDate();
};

// Hàm lấy ngày đầu tiên của tháng hiện tại
export const getDateFirstInYearCurrent = () => {
  const year = new Date().getFullYear();

  return moment(`01/01/${year}`, "DD/MM/YYYY").toDate();
};

// Hàm lấy ngày đầu tiên của tháng
export const getDateFirstInMonth = (m: number) => {
  const now = new Date();
  const year = now.getFullYear();

  return moment(`01/${m}/${year}`, "DD/MM/YYYY").toDate();
};

export const getDateFirstInMonthYear = (m: number, year: number) => {
  return moment(`01/${m}/${year}`, "DD/MM/YYYY").toDate();
};

// Hàm lấy ngày cuối cùng của tháng
export const getDateFinalInMonth = (month: number) => {
  const now = new Date();
  const year = now.getFullYear();
  const date = new Date(year, month, 0).getDate();

  return moment(`${date}/${month}/${year}`, "DD/MM/YYYY").toDate();
};

export const getDateFinalInMonthYear = (month: number, year: number) => {
  const date = new Date(year, month, 0).getDate();

  return moment(`${date}/${month}/${year}`, "DD/MM/YYYY").toDate();
};

// Hàm tính công
export function calculateWorkUnits(startDate: Date, endDate: Date): number {
  if (!startDate || !endDate || endDate <= startDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  let totalUnits = 0;

  const startDay = new Date(start);
  startDay.setHours(0, 0, 0, 0);

  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);

  const dayDiff = Math.floor(
    (endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 👉 Nếu trong cùng 1 ngày
  if (dayDiff === 0) {
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours <= 4 ? 0.5 : 1;
  }

  // 👉 Ngày đầu
  const endOfStartDay = new Date(start);
  endOfStartDay.setHours(23, 59, 59, 999);
  const firstDayHours =
    (endOfStartDay.getTime() - start.getTime()) / (1000 * 60 * 60);
  totalUnits += firstDayHours <= 4 ? 0.5 : 1;

  // 👉 Ngày cuối
  const startOfEndDay = new Date(end);
  startOfEndDay.setHours(0, 0, 0, 0);
  const lastDayHours =
    (end.getTime() - startOfEndDay.getTime()) / (1000 * 60 * 60);
  totalUnits += lastDayHours <= 4 ? 0.5 : 1;

  // 👉 Các ngày giữa
  if (dayDiff > 1) {
    totalUnits += dayDiff - 1;
  }

  return totalUnits;
}

export const formatDate = (val: string) => {
  if (!val) {
    console.log("Giá trị ngày không hợp lệ:", val);
    return "--/--/----";
  }; // Tránh lỗi nếu val bị null/undefined
  
  // Truyền trực tiếp chuỗi vào moment
  const date = moment(val); 
  
  if (!date.isValid()) {
    return "--/--/----"; // Hoặc trả về val ban đầu
  }

  return date.format("DD/MM/YYYY");
};

export const formatDateDayAndMonth = (val: string, type?: number) => {
  if(type === 1) {
    return moment(new Date(val)).format("DD:MM");
  }
  return moment(new Date(val)).format("DD/MM");
};

export const formatDate2 = (val: string) => {
  return moment(val).format("DD-MM-YYYY");
};

export const formatDateTime = (val?: string) => {
  if(val === undefined || val === null || val === "") {
    return "--";
  }
  return moment(val).format("HH:mm:ss DD-MM-YYYY");
};

export const formatTime = (val?: string) => {
  if (val === undefined || val === null || val === "") {
    return "--";
  }
  return moment(val).format("HH:mm");
};

// Hàm check đi muộn hay không
export const checkLate = (timeString: string) => {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return true; // timestamp không hợp lệ → tính là muộn

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    // Nếu đến trong khoảng 08:01–12:00 → muộn
    if (totalMinutes > 8 * 60 && totalMinutes < 12 * 60) {
      return true;
    }

    // Nếu đến trong khoảng 13:01–16:00 → muộn
    if (totalMinutes > 13 * 60 && totalMinutes < 16 * 60) {
      return true;
    }

    // Còn lại → ko muộn
    return false;
};

// Hàm tính có đi muộn hay không trả về số phút muộn
export const checkLateReturnMinues = (timeString: string) => {
  const date = new Date(timeString);
  if (isNaN(date.getTime())) return true; // timestamp không hợp lệ → tính là muộn

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Nếu đến trong khoảng 08:01–11:00 → muộn
  if (totalMinutes > 8 * 60 && totalMinutes < 11 * 60) {
    return totalMinutes - (8 * 60); // Trả về số phút muộn
  }

  // Nếu đến trong khoảng 13:01–16:00 → muộn
  if (totalMinutes > 13 * 60 && totalMinutes < 16 * 60) {
    return totalMinutes - (13 * 60); // Trả về số phút muộn
  }

  // Còn lại → ko muộn
  return 0; // Không muộn, trả về 0 phút
};

// mapping định dạng file
export const mappingTypeFile = (type: string) => {
  switch(type){
    case 'doc':
      return SVGS.ic_doc
    case 'xls':
    case 'xlsx':
      return SVGS.ic_xls
    case 'pdf':
      return SVGS.ic_pdf
    case 'ppt':
      return SVGS.ic_ppt
    case 'txt':
      return SVGS.ic_txt
  }
}

function readGroup(group: string) {
  let readDigit = [
    " Không",
    " Một",
    " Hai",
    " Ba",
    " Bốn",
    " Năm",
    " Sáu",
    " Bảy",
    " Tám",
    " Chín",
  ];
  var temp = "";
  if (group == "000") return "";
  temp = readDigit[parseInt(group.substring(0, 1))] + " Trăm";
  if (group.substring(1, 2) == "0")
    if (group.substring(2, 3) == "0") return temp;
    else {
      temp += " Lẻ" + readDigit[parseInt(group.substring(2, 3))];
      return temp;
    }
  else temp += readDigit[parseInt(group.substring(1, 2))] + " Mươi";
  if (group.substring(2, 3) == "5") temp += " Lăm";
  else if (group.substring(2, 3) != "0")
    temp += readDigit[parseInt(group.substring(2, 3))];
  return temp;
}

export function readMoney(num: string) {
   if (num == null || num == "") return "";
   let isNegative = false;
   if (num.startsWith("-")) {
     isNegative = true;
     num = num.substring(1);
   }
   num = num.replace(/[^0-9]/g, "");
   let temp = "";
   while (num.length < 18) {
     num = "0" + num;
   }
  let g1 = num.substring(0, 3);
  let g2 = num.substring(3, 6);
  let g3 = num.substring(6, 9);
  let g4 = num.substring(9, 12);
  let g5 = num.substring(12, 15);
  let g6 = num.substring(15, 18);
  if (g1 != "000") {
    temp = readGroup(g1);
    temp += " Triệu";
  }
  if (g2 != "000") {
    temp += readGroup(g2);
    temp += " Nghìn";
  }
  if (g3 != "000") {
    temp += readGroup(g3);
    temp += " Tỷ";
  } else if ("" != temp) {
    temp += " Tỷ";
  }
  if (g4 != "000") {
    temp += readGroup(g4);
    temp += " Triệu";
  }
  if (g5 != "000") {
    temp += readGroup(g5);
    temp += " Nghìn";
  }
  temp = temp + readGroup(g6);
  temp = temp.replaceAll("Một Mươi", "Mười");
  temp = temp.trim();
  temp = temp.replaceAll("Không Trăm", "");
  temp = temp.trim();
  temp = temp.replaceAll("Mười Không", "Mười");
  temp = temp.trim();
  temp = temp.replaceAll("Mươi Không", "Mươi");
  temp = temp.trim();
  if (temp.indexOf("Lẻ") == 0) temp = temp.substring(2);
  temp = temp.trim();
  temp = temp.replaceAll("Mươi Một", "Mươi Mốt");
  temp = temp.trim();
  let result =
    temp.substring(0, 1).toUpperCase() + temp.substring(1).toLowerCase();
  return (
    (isNegative ? "Âm " : "") + (result == "" ? "Không" : result) + " đồng chẵn"
  );
}

export const formatMoney = (num: number) => {
  const value = num.toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
  return value.replace("VND", "");
};

export const formatMoneyUSD = (num: number) => {
  const value = num.toLocaleString("it-IT", {
    style: "currency",
    currency: "USD",
  });
  return value.replace("USD", "");
};

export const mapListCurrencyProps = (val: string[]): ModalDataType[] => {
  return val
    .map((code) => currencyMap[code])
    .filter((item): item is ModalDataType => !!item);
};

export const mapCurrencyProps = (val: string): ModalDataType | undefined => {
  return currencyMap[val.toUpperCase()];
};

export function validateAndFormatMoney(value: string | number): string {
  let str = typeof value === "number" ? value.toString() : value;
  // Chỉ giữ số và dấu phẩy (,) và dấu chấm (.)
  str = str.replace(/[^0-9.,]/g, "");
  if (!str) return "0";
  // Nếu có nhiều dấu phẩy hoặc chấm, chỉ lấy dấu phẩy cuối cùng làm phân cách thập phân
  // Đổi tất cả dấu chấm thành rỗng (loại bỏ dấu chấm cũ)
  str = str.replace(/\./g, "");
  // Tách phần nguyên và phần thập phân theo dấu phẩy cuối cùng
  const lastComma = str.lastIndexOf(",");
  let intPart = lastComma !== -1 ? str.slice(0, lastComma) : str;
  let decPart = lastComma !== -1 ? str.slice(lastComma + 1) : undefined;
  // Loại bỏ số 0 ở đầu phần nguyên
  intPart = intPart.replace(/^0+/, "") || "0";
  // Format phần nguyên với dấu chấm ngăn cách hàng nghìn
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decPart !== undefined && decPart.length > 0
    ? `${intPart},${decPart}`
    : intPart;
}

export function parseMoneyInput(value: string): number {
  // Chỉ giữ số và dấu phẩy
  let str = value.replace(/[^0-9,]/g, "");
  // Đổi dấu phẩy thành dấu chấm để parseFloat hiểu đúng
  str = str.replace(",", ".");
  return parseFloat(str) || 0;
}

export function parseMoney(value: string): string {
  // 1. Giữ lại chỉ số và dấu chấm
  let str = value.replace(/[^0-9.]/g, "");

  // 2. Parse thành số thực
  const number = parseFloat(str);
  if (isNaN(number)) return "0";

  // 3. Làm tròn tối đa 3 chữ số thập phân
  const rounded = number.toFixed(3);

  // 4. Tách phần nguyên và phần thập phân
  const [intPart, decimalPart] = rounded.split(".");

  // 5. Format phần nguyên với dấu chấm phân cách hàng nghìn
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // 6. Nếu phần thập phân là "000" → bỏ, ngược lại thêm `,` + phần thập phân
  return decimalPart === "000"
    ? formattedInt
    : `${formattedInt},${decimalPart.replace(/0+$/, "")}`; // bỏ số 0 dư cuối
}

export function sanitizeVNDecimalInput(input: string) {
  // 1. Nếu bắt đầu bằng dấu phẩy → thêm 0 phía trước
  if (input.startsWith(",")) {
    input = "0" + input;
  }

  // 2. Giữ lại chỉ số và dấu phẩy đầu tiên
  input = input.replace(/[^0-9,]/g, ""); // chỉ giữ số và dấu ,
  const parts = input.split(",");

  // 3. Chỉ giữ lại phần nguyên và tối đa 1 dấu phẩy
  const integerPart = parts[0];

  let decimalPart = parts[1] || "";
  decimalPart = decimalPart.slice(0, 3); // giới hạn 3 số sau dấu ,

  return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
}

export function sanitizeVNDecimalInputLive(input: string) {
  if (!input) return "";

  if (input.startsWith(",")) input = "0" + input;

  // Giữ lại chỉ số và dấu phẩy đầu tiên
  input = input.replace(/[^0-9,]/g, "");

  const parts = input.split(",");
  const intPart = parts[0];
  let decimalPart = parts[1] ?? "";

  decimalPart = decimalPart.slice(0, 3);

  // Nếu người dùng chỉ mới nhập dấu , → giữ nguyên
  if (input.endsWith(",") && parts.length === 2 && decimalPart === "") {
    return `${intPart},`;
  }

  return decimalPart ? `${intPart},${decimalPart}` : intPart;
}

export function parseVNDecimal(input: string) {
  if (typeof input !== "string") return 0;

  // Bỏ tất cả dấu . (dù thường không có), đổi , thành .
  const normalized = input.replace(/\./g, "").replace(",", ".");

  const number = parseFloat(normalized);
  return isNaN(number) ? 0 : number;
}

export function parseDecimal2(input: string) {
  if (typeof input !== "string") return 0;

  // Bỏ khoảng trắng và đổi , thành .
  const normalized = input.trim().replace(",", ".");
  const num = parseFloat(normalized);
  if (isNaN(num)) return 0;

  // Làm tròn thường đến 2 chữ số sau dấu thập phân
  return Math.round(num * 100) / 100;
}

// hàm lọc đơn duy nhất theo khoảng thời gian
export function filterUniqueRequests(requests: any[]): any[] {
  if (!Array.isArray(requests)) return [];

  const uniqueMap = new Map<string, any>();

  requests.forEach((req) => {
    const key = `${req.startDate}_${req.endDate}`; // tạo khóa duy nhất theo thời gian
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, req); // chỉ thêm nếu chưa có
    }
  });

  return Array.from(uniqueMap.values());
}

/**
 * Làm tròn tổng số phút thành giờ theo quy tắc:
 * 0-25 phút lẻ -> 0.0
 * 26-50 phút lẻ -> 0.5
 * 51-60 phút lẻ -> 1.0
 *
 * @param {number} totalMinutes Tổng số phút cần làm tròn.
 * @returns {number} Tổng số giờ đã được làm tròn.
 */
export function roundTotalMinutesToHours(totalMinutes: number) {
  // 1. Đảm bảo đầu vào là số hợp lệ
  if (totalMinutes < 0) {
    return 0;
  }

  // 2. Tách số giờ nguyên (wholeHours) và số phút lẻ còn lại (remainingMinutes)
  const wholeHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  let roundedFraction = 0.0;

  // 3. Áp dụng logic làm tròn cho số phút lẻ
  if (remainingMinutes <= 25) {
    roundedFraction = 0.0;
  } else if (remainingMinutes <= 50) {
    roundedFraction = 0.5;
  } else {
    // 51 đến 59 phút, làm tròn thành 1.0 giờ
    roundedFraction = 1.0;
  }

  // 4. Cộng giờ nguyên và phần giờ làm tròn
  return wholeHours + roundedFraction;
}

export function getFirstDayOfWeek(date: Date): Date {
  const day = date.getDay(); // Lấy ngày trong tuần (0-6)
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Tính ngày đầu tuần (Thứ Hai)
  return new Date(date.setDate(diff));
}
// trừ ngày
export function subtractDays(days: number): Date {
  const today = new Date();
  today.setDate(today.getDate() - days);
  return today;
}

/**
 * So sánh hai giá trị thời gian
 * @param date1 Thời gian thứ nhất (string, Date, hoặc Moment)
 * @param date2 Thời gian thứ hai (string, Date, hoặc Moment)
 * @returns -1 nếu date1 < date2, 1 nếu date1 > date2, 0 nếu bằng nhau
 */
export const compareDates = (date1: string | Date, date2: string | Date) => {
  const m1 = moment(date1);
  const m2 = moment(date2);

  // Kiểm tra tính hợp lệ
  if (!m1.isValid() || !m2.isValid()) {
    return -2; // Hoặc ném ra lỗi tùy bạn xử lý
  }

  if (m1.isBefore(m2)) return -1;
  if (m1.isAfter(m2)) return 1;
  return 0;
};

export const calculateHours = (start: Date, end: Date): number => {
  if (!start || !end || end <= start) return 0;

  // Tính tổng số giờ thô
  const diffMs = end.getTime() - start.getTime();
  let totalHours = diffMs / 3600000; // 1000 * 60 * 60

  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;

  if (start.toDateString() === end.toDateString()) {
    // Cùng ngày: Trừ 1h nếu khoảng thời gian bao phủ giờ nghỉ trưa
    if (startHour < 13 && endHour > 12) totalHours -= 1;
  } else {
    // Khác ngày: Trừ cho ngày đầu, ngày cuối và các ngày ở giữa
    const daysDiff = Math.floor(diffMs / 86400000);
    if (startHour < 13) totalHours -= 1;
    if (endHour > 12) totalHours -= 1;
    if (daysDiff > 1) totalHours -= (daysDiff - 1);
  }

  return Math.round(Math.max(0, totalHours) * 10) / 10;
};