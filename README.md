# 💘 Dating App – Hệ thống ghép đôi & Đặt lịch hẹn

---

# 📜 Lời cam đoan

Tôi cam kết đây là bài làm do tôi trực tiếp thiết kế và triển khai.

Trong quá trình thực hiện, tôi có sử dụng AI (ChatGPT) như một công cụ hỗ trợ để:
- Tham khảo hướng tiếp cận vấn đề
- Tối ưu thuật toán
- Cải thiện cách trình bày và cấu trúc tài liệu

Tuy nhiên, toàn bộ logic nghiệp vụ, thiết kế hệ thống và việc triển khai code đều do tôi chủ động xây dựng và hiểu rõ cách hoạt động.

Tôi hoàn toàn chịu trách nhiệm về nội dung và chất lượng của bài làm này.

---

## 1. GitHub Repository

🔗 https://github.com/hunghoangphi2004/dating-app

---

## 2. Link Deploy Live

🔗 https://dating-app-bx9o.onrender.com/

🔗 https://dating-app-two-sigma.vercel.app/ 

Bạn có thể vào link còn lại nếu 1 trong 2 link bị lỗi

🔐 Tài khoản test

Bạn có thể sử dụng các tài khoản sau để đăng nhập:

Account 1

Email: nhph20049@gmail.com

Password: 123456

Account 2

Email: maitran21@gmail.com

Password: 123456

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

```
├── config/        # Cấu hình database
├── controllers/   # Xử lý logic nghiệp vụ
├── helpers/       # Format date, filter query, pagination
├── routes/        # Định nghĩa routes
├── models/        # Schema MongoDB
├── validates/     # Validate dữ liệu đầu vào
├── services/      # Logic match & scheduling
├── middlewares/   # Middleware (auth, validate, upload...)
├── views/         # Giao diện EJS
├── public/        # Static files
├── .env           # Biến môi trường
├── index.js       # Entry point
└── README.md
```


## Kiến trúc sử dụng

Project được tổ chức theo mô hình **MVC**:

- **Models:** Định nghĩa cấu trúc dữ liệu (User, Match, Slot).
- **Controllers:** Xử lý request/response.
- **Routes:** Định nghĩa các đường dẫn và điều hướng request.
- **Views:** Render giao diện bằng EJS.
- **Services:** Chứa thuật toán match và tìm slot trùng.
- **Middlewares:** Xử lý xác thực, upload, validate...

---

## Công cụ hỗ trợ

Trong quá trình phát triển, tôi có sử dụng AI (ChatGPT) như một công cụ hỗ trợ để:

- Gợi ý hướng giải quyết vấn đề
- Tham khảo cách tối ưu thuật toán
- Hỗ trợ refactor và cải thiện cấu trúc code
- Tìm hiểu thêm về best practices trong NodeJS và MongoDB


# 💾 4. Lưu trữ dữ liệu

Ứng dụng sử dụng **MongoDB Atlas (Cloud Database)** để lưu trữ toàn bộ dữ liệu phía backend thông qua **Mongoose ODM**.

Hệ thống **không sử dụng localStorage** cho các dữ liệu chính.  
Tất cả thông tin người dùng, match và lịch hẹn đều được xử lý và lưu trữ tập trung tại server.

---

## 🗂 Các Collection chính

### 1️⃣ users
Lưu thông tin người dùng:

- name
- age
- email
- password
- gender
- bio
- avatar
- token (phục vụ xác thực)
- status
- deleted (soft delete)
- createdAt, updatedAt (timestamps)

---

### 2️⃣ matchs
Lưu trạng thái tương tác giữa hai người dùng:

- userAId
- userBId
- actionA (like / dislike)
- actionB (like / dislike)
- matchedAt
- status (pending / matched / scheduled / rejected)
- scheduledDate
- scheduledStart
- scheduledEnd
- deleted
- createdAt, updatedAt

Collection này đóng vai trò trung tâm cho logic match và đặt lịch.

---

### 3️⃣ availabilities
Lưu các khung giờ rảnh của từng người trong một match:

- matchId
- userId
- date
- start
- end
- deleted
- createdAt, updatedAt

Dữ liệu này được sử dụng để tìm **slot thời gian trùng nhau** giữa hai người.

---

# 🧠 Logic hoạt động của hệ thống

Hệ thống gồm 4 phần chính:

1. Hiển thị danh sách người dùng
2. Cơ chế Like & Match
3. Đặt lịch hẹn (Schedule)
4. Tìm slot thời gian trùng nhau

---

## 1️⃣ Hiển thị danh sách người dùng

Khi user vào `/user/list`:

- Hệ thống lấy tất cả user:
  - Không bị xoá (`deleted: false`)
  - Đang hoạt động (`status: active`)
  - Không phải chính mình
  - Chưa từng like trước đó

- Có thể filter theo:
  - Giới tính
  - Độ tuổi (min – max)
  - Có phân trang (pagination)

👉 Mục tiêu: chỉ hiển thị những người có thể tương tác.

---

## 2️⃣ Cơ chế Like & Match

Khi user A bấm "Like" user B:

### Trường hợp 1: Chưa tồn tại Match
- Tạo mới một document Match
- Lưu:
  - userAId
  - userBId
  - actionA = "like"
  - actionAAt = thời điểm like
- Status mặc định = "pending"
- ```
  if (!match) {
            await Match.create({
                userAId: currentUserId,
                userBId: targetUserId,
                actionA: "like",
                actionAAt: new Date()

            });
            req.flash("success", "Đã thích!");
        }
  ```

### Trường hợp 2: Đã tồn tại Match
- Cập nhật actionA hoặc actionB tùy người thực hiện
- Nếu:
  actionA === "like" AND actionB === "like"
  
  → status chuyển sang "matched"
  → lưu matchedAt

  ```
  else {
            if (match.userAId.toString() === currentUserId.toString()) {
                match.actionA = "like";
                match.actionAAt = new Date();
            } else {
                match.actionB = "like";
                match.actionBAt = new Date();
            }

            if (match.actionA === "like" && match.actionB === "like") {
                match.status = "matched";
                match.matchedAt = new Date();
                req.flash("success", "It’s a Match");
            }

            await match.save();
        }
  ```

👉 Chỉ khi cả hai cùng like mới trở thành match thực sự.

---

## 3️⃣ Danh sách Match

Khi vào `/user/match`:

- Lấy tất cả match có:
  - status = matched hoặc scheduled
  - Có chứa currentUserId

- Sau đó lấy thông tin user còn lại
- Trả về danh sách người đã match

---

## 4️⃣ Đặt lịch hẹn (Schedule)

Sau khi match thành công:

- Mỗi người có thể thêm các khung giờ rảnh (Availability)
- Mỗi slot gồm:
  - date
  - start
  - end

Khi thêm slot hoặc xoá slot:
- Hệ thống gọi `matchService.checkAndScheduleMatch(matchId)`
- Hàm này sẽ kiểm tra xem có slot trùng không nếu thêm mới và reset match về trạng thái "matched" nếu xoá slot ảnh hưởng trực tiếp đến giờ đã hẹn

---

## 5️⃣ Logic tìm slot trùng

Nguyên tắc:

1. Lấy tất cả slot của user A
2. Lấy tất cả slot của user B
3. So sánh:
   - Cùng ngày
   - Khoảng thời gian giao nhau
4. Điều kiện kiểm tra overlap
```
if (dateA === dateB && a.start < b.end && a.end > b.start) {
```

Nếu tìm thấy:
- Cập nhật Match:
  - status = "scheduled"
  - scheduledDate
  - scheduledStart
  - scheduledEnd

Nếu một slot bị xoá:
- Nếu đang scheduled → reset về "matched"
- Sau đó tính lại từ đầu

👉 Hệ thống luôn đảm bảo trạng thái match phản ánh đúng dữ liệu slot hiện tại.

---

# 🔄 Luồng tổng thể

Like → Pending  
Cả hai Like → Matched  
Thêm slot → Kiểm tra trùng  
Có slot trùng → Scheduled  
Xoá slot → Tính lại  

---

# 🎯 Điểm mạnh trong thiết kế

- Tách Match và Availability → không nhồi dữ liệu vào 1 document
- Dùng Service để xử lý business logic
- Có soft delete
- Có reset trạng thái khi slot thay đổi
- Logic rõ ràng theo từng bước

---

# 🚀 Nếu có thêm thời gian, tôi sẽ cải thiện gì?

## 1️⃣ Tối ưu thuật toán tìm slot

Hiện tại dùng vòng lặp lồng nhau O(n × m).

Có thể cải thiện bằng cách:
- Sắp xếp slot theo thời gian
- Dùng kỹ thuật two-pointer để giảm độ phức tạp

Điều này quan trọng khi số lượng slot tăng lớn.

---

## 2️⃣ Cải thiện bảo mật hệ thống

Hiện tại hệ thống dùng token đơn giản và md5 để mã hóa mật khẩu.

Tôi sẽ:

- Dùng bcrypt để hash password an toàn hơn
- Thêm JWT cho cơ chế xác thực
- Thêm middleware kiểm tra quyền truy cập

Điều này giúp hệ thống:
- An toàn hơn khi triển khai thực tế
- Phù hợp tiêu chuẩn production

---

## 3️⃣ Thêm transaction khi cập nhật Match

Để tránh race condition nếu 2 người cùng thêm slot cùng lúc.

---

# 💡 Tính năng đề xuất thêm cho sản phẩm

## 1️⃣ Gợi ý thời gian tối ưu

Thay vì chọn slot trùng đầu tiên,
hệ thống có thể:

- Chọn slot gần nhất với hiện tại
- Hoặc slot có thời lượng dài nhất

→ Tăng trải nghiệm người dùng.

---

## 2️⃣ Thông báo real-time

Khi có match hoặc có slot trùng:
- Gửi notification
- Hoặc dùng WebSocket để cập nhật real-time

→ Trải nghiệm giống app dating thực tế.

---

## 3️⃣ Hết hạn match

Nếu sau X ngày không schedule được:
- Tự động huỷ match

→ Tránh hệ thống bị tồn nhiều match "chết".

---

---

# ⚙️ 5. Hướng dẫn cài đặt & chạy project

## B1: Clone repository

```bash
git clone https://github.com/hunghoangphi2004/dating-app.git
cd dating-app
```
## B2: Cài đặt dependencies
```
npm install
```
## B3: Cấu hình biến môi trường (.env)

Tạo file .env ở thư mục gốc và thêm các biến sau:

```
PORT=3000
MONGO_URL=your_mongodb_connection_string
CLOUD_NAME=your_cloudinary_name
CLOUD_KEY=your_cloudinary_key
CLOUD_SECRET=your_cloudinary_secret
```

Giải thích:

PORT: Cổng chạy server ở môi trường local (mặc định: 3000).

MONGO_URL: Chuỗi kết nối đến MongoDB Atlas (hoặc MongoDB local).
Dùng để backend kết nối tới database.

CLOUD_NAME: Tên Cloudinary account.

CLOUD_KEY: API Key của Cloudinary.

CLOUD_SECRET: API Secret của Cloudinary. Dùng để xác thực khi upload và quản lý ảnh.

## B4: Chạy ứng dụng
```
npm start
```

Hoặc :

```
node index.js
```

Ở thư mục gốc dự án

## B5: Truy cập hệ thống

Mở trình duyệt tại:

http://localhost:3000

📌 5. Yêu cầu hệ thống

Node.js >= 16

MongoDB Atlas hoặc MongoDB local

Tài khoản Cloudinary để upload ảnh

# 🎯 Tổng kết

Logic hiện tại:

- Đơn giản
- Dễ hiểu
- Phù hợp quy mô nhỏ – trung bình
- Đảm bảo tính đúng đắn của trạng thái match
