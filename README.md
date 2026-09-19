# Hướng Dẫn Deploy 9router Lên Render.com (Miễn Phí 100%)

Thư mục này chứa đầy đủ mã nguồn để đưa 9router lên máy chủ đám mây Render.com hoàn toàn miễn phí mà không cần thẻ tín dụng.

---

## 🚀 Các Bước Thực Hiện (Chỉ Mất 2 Phút):

### Bước 1: Tạo một Repository mới trên GitHub
1. Vào GitHub: [github.com/new](https://github.com/new)
2. Đặt tên repository (ví dụ: `my-9router-service`), chọn **Public** (hoặc Private) và bấm **Create repository**.

### Bước 2: Đẩy thư mục này lên GitHub
Mở Terminal / PowerShell tại thư mục `deploy-9router` và chạy các lệnh:
```bash
cd deploy-9router
git init
git add .
git commit -m "Deploy 9router to Render"
git branch -M main
git remote add origin https://github.com/<tai-khoan-cua-ban>/my-9router-service.git
git push -u origin main
```

### Bước 3: Deploy trên Render.com
1. Đăng nhập vào [dashboard.render.com](https://dashboard.render.com) (đăng nhập bằng tài khoản GitHub).
2. Bấm nút **New +** ở góc trên bên phải $\rightarrow$ Chọn **Web Service**.
3. Chọn repository `my-9router-service` mà bạn vừa tạo trên GitHub $\rightarrow$ Bấm **Connect**.
4. Điền các thông số:
   - **Name:** `my-9router-service` (hoặc tên tùy thích)
   - **Region:** Singapore hoặc Oregon (khuyên dùng Singapore để có tốc độ nhanh nhất về Việt Nam)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Chọn gói **Free** ($0/month)
5. Bấm **Deploy Web Service**.

---

## 🎉 Sau Khi Deploy Thành Công:
Render sẽ cấp cho bạn một đường link HTTPS công khai cố định dạng:
`https://my-9router-service-xxxx.onrender.com`

1. Bạn truy cập vào link đó để mở giao diện quản trị 9router, cấu hình Kênh (Channels) và tạo API Key.
2. Cập nhật vào file `.env` của dự án web:
   ```env
   ROUTER_URL=https://my-9router-service-xxxx.onrender.com/v1
   ROUTER_API_KEY=sk-...
   ROUTER_IMAGE_MODEL=ag/gemini-3.1-flash-image
   ```
Lúc này dự án web của bạn có thể gọi vào 9router trên đám mây từ bất kỳ thiết bị nào!
