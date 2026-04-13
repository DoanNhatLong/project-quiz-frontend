# Project Overview

This project is a comprehensive **Quiz Management System** designed to facilitate both student practice and real-time examination environments.

* **For Students:** The platform provides a space to practice and engage in **real-time exams**, allowing for synchronized participation and competitive learning.
* **For Instructors:** It offers powerful administrative tools to curate exams from **multiple question banks** and provides the functionality to manage and monitor **live exam rooms** effectively.

---

**Backend Source Code:** [Project_Quiz_BE](https://github.com/DoanNhatLong/project_quiz_backend) <br>
**Restful API:** [https://quiz-backend-v1.onrender.com](https://quiz-backend-v1.onrender.com)

### 🔑 Trải nghiệm hệ thống (Demo Credentials)

| Role | Tài khoản | Mật khẩu |
| :--- | :--- | :--- |
| **admin** | `admin` | `123` |
| **user** | `long1`  | `123` |
| **user** | `ha1`  | `123` |
| **user** | `ha2`  | `123` |

> **Lưu ý:** Đối với các phòng thi, phòng : `Kiểm tra kiến thức` , sử dụng mã phòng: `222`. Phòng thi có chức năng chống gian lận nên nếu acc bị đuổi ra có thể dùng acc khác để trải nghiệm

## 🚀 Các Tính Năng Chính (Core Features)

Dưới đây là 6 chức năng tiêu biểu đã được hoàn thiện trong hệ thống:

### 1. Giao diện luyện tập Quiz cho học viên
Cung cấp không gian học tập trực quan, giúp học viên dễ dàng thao tác và luyện tập các bộ câu hỏi trắc nghiệm để củng cố kiến thức (Guest cũng có thể vào luyện tập nhưng không xem lại đáp án đúng được ).
<br>
![practice](https://github.com/user-attachments/assets/97c2a9cc-fef5-429a-bd9c-5a3152eaa5d2)

---

### 2. Hệ thống làm bài thi tích hợp chống gian lận
Hỗ trợ làm bài trực tuyến với cơ chế tự động giám sát hành vi và tính năng Reconnect thông minh, giúp giữ nguyên đáp án đã chọn nếu gặp sự cố kết nối và bắt buộc phải dùng thiết bị khác làm tiếp.
<br>
![exam](https://github.com/user-attachments/assets/b6b30b8f-7b41-4139-a739-466a77eb1185)

---

### 3. Xem lại bài thi và lưu trữ Snapshot
Học viên dễ dàng tra cứu lại bài thi để biết các lỗi sai, đồng thời hệ thống lưu lại bản Snapshot dữ liệu làm bằng chứng xác thực trong trường hợp cần tranh khiếu nại.
<br>
![replay](https://github.com/user-attachments/assets/3b4186ae-7784-4b2f-88c4-e39b4bff4a29)

---
### Các chức năng của admin

### 4. Quản lý ngân hàng câu hỏi thông minh
Hỗ trợ đa dạng phương thức nhập liệu từ thêm thủ công kèm hình ảnh, nhập liệu hàng loạt qua file Excel, đến việc tích hợp AI để tự động khởi tạo câu hỏi nhanh chóng và chính xác.
<br>
![create_quiz](https://github.com/user-attachments/assets/d43a098f-6335-4836-99f8-a324e270c634)

---

### 5. Khởi tạo đề thi từ đa nguồn ngân hàng
Hỗ trợ quy trình tạo đề thi linh hoạt bằng cách cho phép lựa chọn và tổng hợp các câu hỏi từ nhiều bộ ngân hàng câu hỏi chuẩn khác nhau trong hệ thống.
<br>
![create_exam](https://github.com/user-attachments/assets/ac6f4e58-98e1-4bd2-a5aa-076244e63a01)

---

### 6. Nhật ký hệ thống và kiểm soát hành động nhạy cảm
Tự động ghi lại lịch sử hoạt động (Log) chi tiết của người dùng, giúp quản trị viên dễ dàng theo dõi, kiểm tra và truy vết các thao tác quan trọng hoặc nhạy cảm trên hệ thống.
<br>
![log](https://github.com/user-attachments/assets/1a45248d-bd51-4edc-9786-397bb34f44d1)
