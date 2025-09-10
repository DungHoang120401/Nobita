📄 License: [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)

# Nobita

> 🛠 Một thư viện hỗ trợ kiểm tra tốc độ mạng, xử lý truy vấn YouTube và tạo mô hình 3D character figure bằng JavaScript.

---

## 📂 Cấu trúc thư mục

- **Scripts/** – Chứa các script như `Speed_Test_Master.js` và `3D_Character_Scene.js`
- **Module/** – Các mô-đun mở rộng hoặc hỗ trợ
- **3D_Character/** – Hệ thống tạo mô hình 3D character figure

---

## 🎨 3D Character Figure

Tính năng mới: Tạo mô hình 3D character figure với:
- **Character 3D** đứng trên đế nhựa tròn
- **Hộp display** với hình ảnh in của character
- **Màn hình máy tính** hiển thị quá trình modeling trong Blender
- **Môi trường indoor** với ánh sáng và texture realistic

### Cách sử dụng 3D Character:
```bash
# Mở trực tiếp trong browser
open 3D_Character/index.html

# Hoặc chạy demo tương tác
open 3D_Character/demo.html

# Hoặc dùng server local
npm run serve
# Sau đó truy cập http://localhost:8000/3D_Character/
```

---

## 🚀 Cách sử dụng

```bash
# Clone repo
git clone https://github.com/DungHoang120401/Nobita.git
cd Nobita

# Cài đặt gói nếu cần
npm install

# Chạy script chính (ví dụ)
node Scripts/Speed_Test_Master.js

# Xem 3D Character Scene
# Mở file 3D_Character/index.html trong trình duyệt web
# hoặc chạy server local:
npm run serve
