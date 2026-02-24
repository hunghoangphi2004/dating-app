# 💘 Dating App – Hệ thống Match & Tìm Slot Hẹn Hò

## 1. GitHub Repository

🔗 https://github.com/your-username/your-repo

---

## 2. Link Deploy Live

🔗 https://your-project-url.vercel.app  
(hoặc link Render nếu deploy bằng Render)

---

# 🧱 3. Mô tả cách tổ chức hệ thống

## Công nghệ sử dụng

- **Backend:** Node.js + Express
- **Template Engine:** EJS
- **Database:** MongoDB Atlas
- **Session & Authentication:** express-session
- **Flash Message:** express-flash
- **Upload ảnh:** Cloudinary
- **Deploy:** Vercel / Render

---

## Cấu trúc thư mục
├── api/ # Entry server (phục vụ deploy)
├── config/ # Cấu hình database
├── controllers/ # Xử lý logic nghiệp vụ
├── routes/ # Định nghĩa routes
├── models/ # Schema MongoDB
├── services/ # Logic match & scheduling
├── middlewares/ # Middleware (auth, validate, upload...)
├── views/ # Giao diện EJS
├── public/ # Static files
└── README.md


## Kiến trúc sử dụng

Project được tổ chức theo mô hình **MVC**:

- **Models:** Định nghĩa cấu trúc dữ liệu (User, Match, Slot).
- **Controllers:** Xử lý request/response.
- **Routes:** Điều hướng API.
- **Views:** Render giao diện bằng EJS.
- **Services:** Chứa thuật toán match và tìm slot trùng.
- **Middlewares:** Xử lý xác thực, upload, validate...

Việc tách riêng service giúp code dễ mở rộng và bảo trì hơn.

---

# 💾 4. Lưu trữ dữ liệu bằng gì?

Dữ liệu được lưu bằng **MongoDB Atlas (Cloud Database)**.

Các collection chính:

- `users`
- `matches`
- `slots`

Ứng dụng **không sử dụng localStorage**.  
Toàn bộ dữ liệu được xử lý và lưu ở backend.

---

# ❤️ 5. Logic Match hoạt động thế nào?

Một match được tạo khi:

1. Hai user tồn tại trong hệ thống.
2. Hệ thống tạo một document `match` gồm:
   - `userA`
   - `userB`
   - `status` (pending / matched / scheduled)

## Quy trình hoạt động

- User A gửi yêu cầu match.
- Nếu User B đồng ý,
- → Status chuyển thành `matched`.

Mỗi cặp user chỉ có **1 match duy nhất** để tránh trùng lặp dữ liệu.

---

# 📅 6. Logic tìm Slot trùng hoạt động thế nào?

Mỗi user có thể thêm các khoảng thời gian rảnh:
{
date,
startTime,
endTime,
userId,
matchId
}


## Thuật toán tìm slot trùng

1. Lấy tất cả slot của User A.
2. Lấy tất cả slot của User B.
3. So sánh theo điều kiện:

- Cùng ngày
- Thời gian giao nhau

### Điều kiện giao nhau:
startA < endB && startB < endA


Nếu tồn tại slot thỏa điều kiện:

- Match chuyển sang trạng thái `scheduled`
- Lưu lại ngày và thời gian hẹn

Cách này đảm bảo tìm được mọi khoảng thời gian giao nhau hợp lệ.

---

# 🚀 7. Nếu có thêm thời gian tôi sẽ cải thiện gì?

1. Tối ưu MongoDB bằng index theo `matchId` và `date`.
2. Refactor toàn bộ scheduling logic sang service layer rõ ràng hơn.
3. Chuyển từ session sang JWT để phù hợp kiến trúc serverless.

---

# 💡 8. Đề xuất thêm 1–3 tính năng cho sản phẩm

## 1️⃣ Thông báo real-time

Sử dụng WebSocket để thông báo khi:
- Có match mới
- Có slot trùng

→ Tăng trải nghiệm người dùng.

---

## 2️⃣ Smart Matching

Nâng cấp match dựa trên:
- Sở thích
- Địa điểm
- Mức độ trùng thời gian rảnh

→ Tăng chất lượng match.

---

## 3️⃣ Chat sau khi Match

Sau khi match thành công:
- Cho phép nhắn tin
- Lưu lịch sử chat

→ Tăng mức độ tương tác và giữ chân người dùng.

---

# 🎯 Tổng kết

Project được xây dựng theo kiến trúc MVC rõ ràng,  
sử dụng MongoDB để lưu trữ dữ liệu,  
và triển khai thuật toán tìm slot trùng để tự động lên lịch hẹn.

Hệ thống có thể mở rộng thêm nhiều tính năng để trở thành một nền tảng dating hoàn chỉnh.
