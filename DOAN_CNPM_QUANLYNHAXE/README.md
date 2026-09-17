# Đồ án CNPM - Quản lý nhà xe

Hệ thống quản lý và điều hành nhà xe thông minh tích hợp chatbot và bán vé trực tuyến

1. **Cách kết nối để xem được DB**
    - B1: Tải MySQL v8. và MySQL Workbench
    - B2: Sau khi tải xong vào MySQL Workbench tạo New Connection
    - B3: Nhập như sau:
      | Trường | Giá trị |
      |---------------|----------------------------------|
      |Connection Name|railway |
      |Hostname |metro.proxy.rlwy.net |
      |Port | 27667 |
      |Username | root |
      |Password | kAGTFyZbXvwDsHuyhKhqlzTCwqqyddEu |
      |Default Schema | railway |
    - B4: OK để connect
    - \*\*Lưu ý: Không được sửa đổi dữ liệu trong DB, chỉ có BE mới được làm

2. \*\*Cấu trúc source code
    - src/app/config/db: để cấu hình về DB
    - src/app/models: để tạo model trong sqlalchemy để lưu trữ dữ liệu
    - src/app/schemas: để validate dữ liệu nhận vào và trả ra
    - src/app/controllers: để chứa các hàm xử lý logic, function handler
    - src/app/routers: để định nghĩa các API endpoint

\*\*Tài liệu tham khảo:

- Docs FastAPI với SQL: https://www.geeksforgeeks.org/python/fastapi-sqlite-databases/
