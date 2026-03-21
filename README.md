# ⚛️ Components Checker Frontend

> **React + Vite** — Giao diện Dashboard tra cứu linh kiện điện tử đa nguồn, kết nối trực tiếp với Spring Boot Backend để hiển thị bảng giá, tồn kho và so sánh dữ liệu thời gian thực.

---

## 🚀 Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 🔍 **Smart Search Bar** | Tìm kiếm theo Model linh kiện: ESP32, STM32, 10k resistor... |
| 📊 **Bảng so sánh đa nguồn** | Hiển thị kết quả từ 5 nhà cung cấp trên cùng một giao diện |
| ⚡ **Trạng thái Real-time** | Theo dõi tiến trình từng nguồn riêng biệt |
| 🎛️ **Bộ lọc nâng cao** | Lọc theo giá, số lượng tồn kho hoặc Manufacturer |
| 📱 **Responsive Design** | Tối ưu cho cả máy tính và máy tính bảng (phục vụ anh em kho bãi) |

---

## 🏗️ Công nghệ sử dụng

| Layer | Công nghệ |
|-------|-----------|
| **Core** | React 18+ (Vite) |
| **Styling** | Tailwind CSS / SCSS / Ant Design |
| **HTTP Client** | Axios |
| **Icons** | Lucide React / FontAwesome |

> ⚠️ **TanStack Query** là thành phần quan trọng nhất — xử lý toàn bộ việc gọi API đa luồng từ nhiều nguồn cùng lúc.

---

## ⚙️ Hướng dẫn cài đặt

### 1. Clone và cài đặt thư viện

```bash
git clone <your-repo-url>
cd toolcheck_fe
yarn install
```

### 2. Cấu hình biến môi trường (`.env`)

Sửa file helper trong đường dẫn @src/setup/axios để chỉnh lại url server - nếu cần

### 3. Chạy môi trường Development

```bash
yarn dev
```

---

## 🛠️ Scripts hữu ích

| Lệnh | Mô tả |
|------|-------|
| `yarn dev` | Chạy server Development với Hot Reload |
| `yarn build` | Đóng gói dự án để triển khai lên Production (Nginx/Vercel) |

---

## 💡 Lưu ý cho Developer

### Xử lý Đa luồng trên UI

Vì Backend trả về dữ liệu của 5 nguồn cùng lúc, hãy sử dụng **React Query** để quản lý trạng thái:

- Tránh giao diện bị "đơ" khi một nguồn (như BanLinhKien) phản hồi chậm hơn các nguồn khác.
- Hiệu ứng Loading nên chia theo từng **Section** của từng nhà cung cấp.

### Format dữ liệu tiền tệ

Dữ liệu giá có đơn vị khác nhau (USD từ LCSC, VND từ TGIC,...). Có thể tự thêm hàm format để quy đổi hoặc hiển thị rõ đơn vị:

```javascript
// Ví dụ format tiền Việt
export const formatVND = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
```

---

## 🔗 Liên kết liên quan

- **Backend**: [Spring Boot Components Checker API](http://localhost:8080/)