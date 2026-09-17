-- ============================================================
-- SEED DATA cho MySQL Local: quanlynhaxe_local
-- Tên cột khớp 100% với SQLAlchemy Models
-- ============================================================

-- Charset cho database
ALTER DATABASE quanlynhaxe_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- 1. BẢNG Quyen
-- ============================================================
INSERT INTO quyen (MaQuyen, TenQuyen) VALUES
('Q001', 'Admin'),
('Q002', 'Nhan vien'),
('Q003', 'Tai xe'),
('Q004', 'Khach hang');

-- ============================================================
-- 2. BẢNG NhanVien  (cột TrangThaiNV)
-- ============================================================
INSERT INTO nhanvien (MaNhanVien, Ten, GioiTinh, Email, ChucVu, Luong, HeSoLuong, TrangThaiNV) VALUES
-- Quan ly
('QL001', 'Hoang Thi Lan',    0, 'lan@gmail.com',   'Quan ly',         15000000, NULL,  'Dang lam'),
('QL002', 'Phan Van Hung',    1, 'hung@gmail.com',  'Quan ly',         14000000, NULL,  'Dang lam'),
('QL003', 'Vu Thi Ngoc',     0, 'ngoc@gmail.com',  'Quan ly',         15500000, NULL,  'Nghi phep'),
-- Nhan vien ban ve
('NV001', 'Nguyen Van An',   1, 'an@gmail.com',    'Nhan vien ban ve', 7000000, NULL,  'Dang lam'),
('NV002', 'Tran Thi Binh',   0, 'binh@gmail.com',  'Nhan vien ban ve', 7500000, NULL,  'Dang lam'),
('NV003', 'Nguyen Thi Mai',  0, 'mai@gmail.com',   'Nhan vien ban ve', 7200000, NULL,  'Dang lam'),
('NV004', 'Ly Thi Hoa',     0, 'hoa@gmail.com',   'Nhan vien ban ve', 6800000, NULL,  'Nghi phep'),
('NV005', 'Ngo Van Phuc',   1, 'phuc@gmail.com',  'Nhan vien ban ve', 7100000, NULL,  'Nghi viec'),
-- Tai xe
('TX001', 'Le Van Cuong',   1, 'cuong@gmail.com', 'Tai xe', NULL, 5000, 'Dang lam'),
('TX002', 'Pham Van Dung',  1, 'dung@gmail.com',  'Tai xe', NULL, 4800, 'Dang lam'),
('TX003', 'Do Van Nam',     1, 'nam@gmail.com',   'Tai xe', NULL, 5200, 'Nghi viec'),
('TX004', 'Trinh Van Hai',  1, 'hai@gmail.com',   'Tai xe', NULL, 5100, 'Dang lam'),
('TX005', 'Bui Van Khanh',  1, 'khanh@gmail.com', 'Tai xe', NULL, 5300, 'Dang lam'),
('TX006', 'Nguyen Van Tai', 1, 'tai@gmail.com',   'Tai xe', NULL, 4700, 'Nghi phep'),
('TX007', 'Huynh Van Son',  1, 'son@gmail.com',   'Tai xe', NULL, 4900, 'Dang lam');

-- ============================================================
-- 3. BẢNG TaiKhoan  (cột TrangThaiTK)
-- ============================================================
INSERT INTO taikhoan (TenTaiKhoan, MatKhau, MaQuyen, MaNhanVien, TrangThaiTK) VALUES
-- Admin (Quan ly)
('QL001', '123456', 'Q001', 'QL001', 1),
('QL002', '123456', 'Q001', 'QL002', 1),
('QL003', '123456', 'Q001', 'QL003', 1),
-- Nhan vien
('NV001', '123456', 'Q002', 'NV001', 1),
('NV002', '123456', 'Q002', 'NV002', 1),
('NV003', '123456', 'Q002', 'NV003', 1),
('NV004', '123456', 'Q002', 'NV004', 1),
('NV005', '123456', 'Q002', 'NV005', 0),
-- Tai xe
('TX001', '123456', 'Q003', 'TX001', 1),
('TX002', '123456', 'Q003', 'TX002', 1),
('TX003', '123456', 'Q003', 'TX003', 0),
('TX004', '123456', 'Q003', 'TX004', 1),
('TX005', '123456', 'Q003', 'TX005', 1),
('TX006', '123456', 'Q003', 'TX006', 1),
('TX007', '123456', 'Q003', 'TX007', 1);

-- ============================================================
-- 4. BẢNG TaiXe  (cột TrangThaiTX)
-- ============================================================
INSERT INTO taixe (MaTaiXe, SoBangLai, HangBang, NgayCap, NgayHetHan, KinhNghiemNam, TrangThaiTX) VALUES
('TX001', 'GPLX001', 'E', '2018-05-10', '2028-05-10', 7,  'San sang'),
('TX002', 'GPLX002', 'D', '2017-03-15', '2027-03-15', 9,  'San sang'),
('TX003', 'GPLX003', 'E', '2016-07-20', '2026-07-20', 10, 'Ngung hoat dong'),
('TX004', 'GPLX004', 'E', '2019-01-12', '2029-01-12', 6,  'San sang'),
('TX005', 'GPLX005', 'D', '2020-09-25', '2030-09-25', 5,  'San sang'),
('TX006', 'GPLX006', 'C', '2021-06-18', '2031-06-18', 4,  'San sang'),
('TX007', 'GPLX007', 'E', '2015-11-30', '2025-11-30', 12, 'San sang');

-- ============================================================
-- 5. BẢNG Xe  (cột TrangThaiX)
-- ============================================================
INSERT INTO xe (BienSo, LoaiXe, SoCho, HangXe, TrangThaiX) VALUES
('51B-12345', 'Giuong nam', 40, 'Thaco',        'San sang'),
('51B-23456', 'Giuong nam', 40, 'Hyundai',      'San sang'),
('51B-34567', 'Giuong nam', 44, 'Samco',        'Bao tri'),
('77A-11111', 'Ghe ngoi',  16, 'Ford Transit', 'San sang'),
('77A-22222', 'Ghe ngoi',  29, 'Hyundai',      'San sang'),
('77A-33333', 'Ghe ngoi',  45, 'Thaco',        'Ngung hoat dong'),
('92B-88888', 'Limousine',  9, 'Dcar',         'San sang'),
('92B-99999', 'Limousine',  9, 'Auto Kingdom', 'San sang'),
('43B-45678', 'Giuong nam', 40, 'Isuzu',       'San sang'),
('43B-56789', 'Ghe ngoi',  30, 'Hyundai',      'Bao tri'),
('30F-67890', 'Limousine', 11, 'Thaco',        'San sang'),
('30F-78901', 'Ghe ngoi',  35, 'Samco',        'San sang');

-- ============================================================
-- 6. BẢNG TuyenXe  (cột TrangThaiT)
-- ============================================================
INSERT INTO tuyenxe (MaTuyen, DiemDi, DiemDen, KhoangCachKm, ThoiGianDuKien, GiaCoBan, TrangThaiT) VALUES
('TX001', 'Gia Lai',   'Quy Nhon', 170,  240,  150000, 1),
('TX002', 'Da Nang',   'Hue',       100,  180,  120000, 1),
('TX003', 'TP.HCM',    'Vung Tau',   95,  150,  100000, 1),
('TX004', 'Gia Lai',   'Da Nang',   300,  480,  250000, 1),
('TX005', 'Quy Nhon',  'TP.HCM',   650,  720,  400000, 1),
('TX006', 'Da Nang',   'Nha Trang', 530,  600,  350000, 1),
('TX007', 'Gia Lai',   'Ha Noi',   1100, 1200,  750000, 1),
('TX008', 'TP.HCM',    'Ha Noi',   1700, 1800,  900000, 1),
('TX009', 'Can Tho',   'Da Nang',   950, 1000,  700000, 1),
('TX010', 'Hue',       'Quang Tri',  80,  120,   80000, 0),
('TX011', 'Gia Lai',   'Kon Tum',    50,   90,   60000, 0);

-- ============================================================
-- 7. BẢNG ChuyenXe  (cột TrangThaiCX)
-- ============================================================
INSERT INTO chuyenxe (MaChuyen, MaTuyen, MaTaiXe, MaXe, ThoiGianKhoiHanh, ThoiGianDuKienDen, GiaVe, TrangThaiCX) VALUES
('CX001', 'TX001', 'TX001', '51B-12345', '2026-09-15 08:00:00', '2026-09-15 12:00:00', 150000, 'Sap chay'),
('CX002', 'TX002', 'TX002', '77A-11111', '2026-09-15 09:00:00', '2026-09-15 12:00:00', 120000, 'Sap chay'),
('CX003', 'TX003', 'TX004', '92B-88888', '2026-09-15 13:00:00', '2026-09-15 16:00:00', 100000, 'Sap chay'),
('CX004', 'TX004', 'TX005', '51B-23456', '2026-09-15 20:00:00', '2026-09-16 04:00:00', 260000, 'Sap chay'),
('CX005', 'TX005', 'TX001', '77A-22222', '2026-09-16 06:00:00', '2026-09-16 18:00:00', 420000, 'Sap chay'),
('CX006', 'TX006', 'TX004', '43B-45678', '2026-09-14 08:00:00', '2026-09-14 18:00:00', 350000, 'Hoan thanh');

-- ============================================================
-- 8. BẢNG Ve  (cột TrangThaiV)
-- ============================================================
INSERT INTO ve (MaVe, MaChuyen, SoGhe, TenKhachHang, SoDienThoai, GiaVe, TrangThaiV) VALUES
('VE001', 'CX001', 'A1', 'Nguyen Van A', '0901111111', 150000, 'Da thanh toan'),
('VE002', 'CX001', 'A2', 'Tran Thi B',  '0902222222', 150000, 'Da dat'),
('VE003', 'CX002', 'A1', 'Pham Thi D',  '0904444444', 120000, 'Da thanh toan'),
('VE004', 'CX002', 'A2', 'Nguyen Van E','0905555555', 120000, 'Da dat'),
('VE005', 'CX003', 'B1', 'Hoang Van F', '0906666666', 100000, 'Da thanh toan'),
('VE006', 'CX004', 'C1', 'Bui Van H',   '0908888888', 260000, 'Da thanh toan'),
('VE007', 'CX005', 'A1', 'Ngo Van K',   '0910000000', 420000, 'Da dat');
