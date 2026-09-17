# Dự Án Quản Lý Xe Khách (Frontend)

Đây là mã nguồn frontend cho hệ thống Quản lý xe khách. Dự án được xây dựng bằng **React**, **Vite**, **Tailwind CSS**, và **React Router**, tổ chức theo mô hình MVC (áp dụng các custom hooks để quản lý state và gọi API, tách biệt logic ra khỏi UI component).

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu hệ thống:
- **Node.js** (Phiên bản khuyến nghị: >= 18)

### Các bước cài đặt và khởi chạy:

1. **Cài đặt các gói phụ thuộc (Dependencies):**
   ```bash
   npm install
   ```
   *(Nếu bạn sử dụng PowerShell và gặp lỗi do Execution Policy bị hạn chế, hãy sử dụng lệnh `npm.cmd install`)*

2. **Chạy server phát triển (Development Server):**
   ```bash
   npm run dev
   ```
   *(Tương tự, dùng `npm.cmd run dev` nếu gặp lỗi trên PowerShell. Sau khi chạy lệnh này, terminal sẽ hiển thị một đường link localhost, ví dụ: `http://localhost:5173`. Bạn hãy mở link đó trên trình duyệt)*

3. **Build dự án cho Môi trường Thực tế (Production):**
   ```bash
   npm run build
   ```

4. **Xem trước bản Build (Preview):**
   ```bash
   npm run preview
   ```

---

##  Cấu trúc thư mục dự án

Dự án được tổ chức gọn gàng và phân chia rõ ràng theo từng module và trách nhiệm của code (bên trong thư mục `src/` và các thư mục cấp gốc):

- **`src/`**: Chứa toàn bộ mã nguồn React của ứng dụng.
  - **`api/`**: Chứa các file khai báo endpoint và hàm gọi API (sử dụng thư viện `axios`).
    - *Ví dụ:* `axiosClient.js` (cấu hình cơ sở cho axios), `chuyenXeApi.js`, `authApi.js`...
  - **`hooks/`**: Chứa các Custom Hook (ví dụ: `useChuyenXe.js`, `useNhanVien.js`). Chức năng của chúng là đóng gói các logic xử lý dữ liệu (fetch, loading, error state) để tái sử dụng nhiều nơi và tách biệt hoàn toàn khỏi phần hiển thị (UI).
  - **`constants/`**: Chứa các biến, hằng số cấu hình hệ thống (như URL Backend, định dạng ngày tháng...).
  - **`contexts/`**: Chứa các React Context dùng để quản lý state toàn cục (Global State) trên toàn ứng dụng, nổi bật nhất là việc quản lý trạng thái Đăng nhập/Xác thực người dùng (Auth).
  - **`utils/`**: Chứa các hàm tiện ích chung có thể dùng ở mọi nơi (hàm định dạng tiền tệ, xử lý ngày giờ...).
  - **`index.css`**: File CSS chính của dự án, chứa các import cấu hình cho Tailwind CSS.
  - **`main.jsx`**: File khởi chạy gốc (Entry Point) của React, làm nhiệm vụ kết xuất (render) toàn bộ ứng dụng vào trong thẻ HTML.

- **`AppRouter.jsx`** *(Thường nằm cùng cấp với `main.jsx` hoặc thư mục gốc)*: File điều hướng trung tâm, cấu hình toàn bộ các tuyến đường (Routing) của ứng dụng thông qua thư viện `react-router-dom`. Quyết định đường link nào thì hiển thị giao diện nào.

- **`components/`**: Chứa các UI Component nhỏ gọn, được sử dụng lại ở nhiều chỗ trên hệ thống:
  - `bus/`: Các Component chuyên dụng cho xe và chuyến xe.
  - `common/`: Các element phổ biến (Nút bấm, Ô nhập liệu, Bảng biểu...).
  - `shared/`: Các phần giao diện dùng chung giữa nhiều trang.

- **`layouts/`**: Chứa các khung giao diện bọc ngoài trang (Layout). Mỗi Layout sẽ định nghĩa sẵn Header, Sidebar, Footer phù hợp với một vai trò (Role):
  - `AdminLayout.jsx`: Dành cho Quản trị viên (có thanh điều hướng cho các chức năng quản lý cốt lõi).
  - `StaffLayout.jsx`: Dành cho Nhân viên điều hành (Nhân viên bán vé, xếp chuyến).
  - `DriverLayout.jsx`: Dành cho Tài xế.
  - `ClientLayout.jsx`: Dành cho Khách hàng vãng lai truy cập đặt vé.

- **`pages/`**: Nơi chứa toàn bộ các Trang (Màn hình), được chia nhỏ theo từng nhóm người dùng:
  - **`admin/`**: Màn hình của Quản trị viên (`AdminDashboard`, `VehicleManagement`, `TripManagementAdmin`, `ReportsDashboard`...).
  - **`staff/`**: Màn hình của Nhân viên (`QuanLyChuyenXe`, `QuanLyDatVe`, `PhanCongTaiXe`...).
  - **`driver/`**: Màn hình của Tài xế (`DriverDashboard`, `IncidentReport`...).
  - **`auth/`**: Các màn hình Đăng nhập / Đăng ký (`LoginPage`, `InternalLogin`).
  - **`client/`**: Giao diện hướng đến Khách hàng thao tác tự do.

- **`data/`**: Chứa dữ liệu giả (Mock Data) như `adminMockData.js`. Được dùng khi API Backend chưa phát triển xong, giúp lập trình viên Frontend vẫn có thể thiết kế giao diện như thật.

---

## Cơ chế hoạt động của dự án

Dự án áp dụng kiến trúc tách bạch rõ ràng giữa Giao diện (UI) và Dữ liệu (Data/Logic):

1. **Cơ chế Điều hướng & Hiển thị (Routing & Layouting):**
   - Khi người dùng nhập URL hoặc chuyển hướng (ví dụ: `/admin/dashboard`), file `AppRouter.jsx` sẽ quét và áp dụng đúng **Layout** (`AdminLayout`).
   - Bên trong Layout, thẻ `<Outlet />` (của React Router) sẽ chịu trách nhiệm kết xuất nội dung của **Page** (`AdminDashboard`) tại phần nội dung chính, trong khi Sidebar và Header vẫn giữ nguyên cố định.

2. **Luồng dữ liệu và Gọi API (Data Fetching):**
   - Các Page hoặc Component **không gọi API trực tiếp**. Thay vào đó, chúng sẽ gọi các **Custom Hook** (như `const { data, isLoading } = useChuyenXe()`).
   - **Custom Hook** sẽ xử lý logic và gọi hàm fetch tương ứng từ thư mục `api/` (`chuyenXeApi.js`).
   - File trong thư mục `api/` sẽ thông qua instance `axiosClient.js` để gửi Request HTTP thực tế lên Backend Server. `axiosClient` được thiết kế có sẵn các lớp đánh chặn (interceptors) để tự động bổ sung Token xác thực vào Header của mọi request.

3. **Cơ chế Bảo mật & Xác thực (Authentication):**
    - Dự án dùng `AuthContext` kết hợp với Token (JWT) được lưu vào `localStorage`.
   - Khi đăng nhập thành công, hệ thống phân tích quyền (Role) và tự động đẩy người dùng vào đúng phân hệ (Admin, Staff hoặc Driver). Các tuyến đường yêu cầu xác thực sẽ kiểm tra trạng thái trong `AuthContext` để chặn các hành vi truy cập trái phép.

4. **Xây dựng Giao diện (Styling):**
   - Sử dụng **Tailwind CSS** làm công cụ chính để code giao diện (Utility-First CSS) trực tiếp trên các thẻ JSX.
   - Để hỗ trợ hiển thị icon, dự án cài đặt thư viện **`lucide-react`**.
   - Một số chức năng phức tạp (ở trang của Staff) có kết hợp thêm file `.css` thuần để tinh chỉnh hiển thị dạng lưới/bảng đặc thù.

---

## Một số chú ý khác khi phát triển

- **Thao tác Form / Modal:** Theo thiết kế tích hợp với Backend, nhiều Modal thêm mới/chỉnh sửa (như Chuyến Xe) đã được tối ưu đi các trường không cần thiết nhập tay (Mã chuyến, Tổng số ghế...) vì Backend có khả năng tự động sinh hoặc tính toán, giúp người dùng bớt thao tác rườm rà.
- Để hiểu rõ việc phân công cụ thể các màn hình thuộc nhóm nào, hãy xem cấu trúc trong thư mục `pages/` và đối chiếu với đường dẫn (path) tại `AppRouter.jsx`.