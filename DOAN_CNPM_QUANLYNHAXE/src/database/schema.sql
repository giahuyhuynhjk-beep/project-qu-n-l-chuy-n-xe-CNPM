ALTER SCHEMA railway
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

CREATE TABLE Quyen (
	MaQuyen VARCHAR(20) PRIMARY KEY,
    TenQuyen VARCHAR(50) UNIQUE
);

CREATE TABLE NhanVien (
    MaNhanVien VARCHAR(50) PRIMARY KEY,
    Ten VARCHAR(100) NOT NULL,
    GioiTinh BIT,
    Email VARCHAR(100) UNIQUE,
    ChucVu VARCHAR(50) NOT NULL,
    Luong DECIMAL(10,2), -- nhân viên, quản lý lương cố định
    HeSoLuong DECIMAL(10, 2), -- tài xế hệ số lương * số km chạy
    TrangThaiNV VARCHAR(50) DEFAULT 'Đang làm' NOT NULL, -- đang làm/nghỉ phép/nghỉ việc 
    CONSTRAINT CHK_Luong CHECK (Luong >= 0 OR Luong IS NULL),
    CONSTRAINT CHK_HeSoLuong CHECK (HeSoLuong >= 0 OR HeSoLuong IS NULL),
    CONSTRAINT CHK_NV_TrangThaiNV CHECK (TrangThaiNV IN ('Đang làm', 'Nghỉ phép', 'Nghỉ việc'))
);


CREATE TABLE TaiKhoan (
	TenTaiKhoan VARCHAR(50) PRIMARY KEY,
    MatKhau VARCHAR(255) NOT NULL,
    MaQuyen VARCHAR(20) NOT NULL,
    MaNhanVien VARCHAR(20) UNIQUE NOT NULL,
    TrangThaiTK BIT DEFAULT 1, -- hoạt động/bị khoá
    CONSTRAINT FK_TaiKhoan_Quyen FOREIGN KEY (MaQuyen) REFERENCES Quyen(MaQuyen),
    CONSTRAINT FK_TaiKhoan_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien)
);

CREATE TABLE TaiXe (
    MaTaiXe VARCHAR(20) PRIMARY KEY,
    SoBangLai VARCHAR(50) UNIQUE NOT NULL,
    HangBang VARCHAR(10) NOT NULL,
    NgayCap DATE NOT NULL,
    NgayHetHan DATE NOT NULL,
    KinhNghiemNam INT,
    TrangThaiTX VARCHAR(50) DEFAULT 'Ngưng hoạt động' NOT NULL, -- sẵn sàng/đang lái/ngưng hoạt động
    CONSTRAINT FK_TaiXe_NhanVien FOREIGN KEY (MaTaiXe) REFERENCES NhanVien(MaNhanVien),
    CONSTRAINT CHK_HanBang CHECK (NgayHetHan > NgayCap),
    CONSTRAINT CHK_TX_TrangThaiTX CHECK (TrangThaiTX IN ('Sẵn sàng', 'Đang lái', 'Ngưng hoạt động'))
);

CREATE TABLE Xe (
    BienSo VARCHAR(20) PRIMARY KEY,
    LoaiXe VARCHAR(50) NOT NULL,
    SoCho INT NOT NULL,
    HangXe VARCHAR(50),
    TrangThaiX VARCHAR(50) NOT NULL, -- sẵn sàng/đang chạy/bảo trì/ngưng hoạt động
    CONSTRAINT CHK_SoCho CHECK (SoCho > 0),
    CONSTRAINT CHK_X_TrangThaiX CHECK (TrangThaiX IN ('Sẵn sàng', 'Đang chạy', 'Bảo trì', 'Ngưng hoạt động'))
);

CREATE TABLE TuyenXe (
    MaTuyen VARCHAR(20) PRIMARY KEY,
    DiemDi VARCHAR(100) NOT NULL,
    DiemDen VARCHAR(100) NOT NULL,
    KhoangCachKm INT NOT NULL,
    ThoiGianDuKien INT NOT NULL, -- phút
    GiaCoBan DECIMAL(10,2) NOT NULL,
    TrangThaiTX BIT NOT NULL, -- hoạt động/ngưng hoạt động
    CONSTRAINT CHK_KhoangCachKm CHECK (KhoangCachKm > 0),
    CONSTRAINT CHK_ThoiGianDuKien CHECK (ThoiGianDuKien > 0),
    CONSTRAINT CHK_GiaCoBan CHECK (GiaCoBan > 0)
);

CREATE TABLE ChuyenXe (
    MaChuyen VARCHAR(20) PRIMARY KEY,
    MaTuyen VARCHAR(20) NOT NULL,
    MaTaiXe VARCHAR(20) NOT NULL,
    MaXe VARCHAR(20) NOT NULL,
    ThoiGianKhoiHanh DATETIME NOT NULL,
    ThoiGianDuKienDen DATETIME NOT NULL, 
    GiaVe DECIMAL(10,2) NOT NULL,
    TrangThaiCX VARCHAR(50) NOT NULL, -- sắp chạy/đang chạy/hoàn thành/huỷ
    CONSTRAINT FK_ChuyenXe_TuyenXe FOREIGN KEY (MaTuyen) REFERENCES TuyenXe(MaTuyen),
    CONSTRAINT FK_ChuyenXe_TaiXe FOREIGN KEY (MaTaiXe) REFERENCES TaiXe(MaTaiXe),
    CONSTRAINT FK_ChuyenXe_Xe FOREIGN KEY (MaXe) REFERENCES Xe(BienSo),
    CONSTRAINT CHK_ThoiGian CHECK (ThoiGianDuKienDen > ThoiGianKhoiHanh),
    CONSTRAINT CHK_GiaVe CHECK (GiaVe > 0),
    CONSTRAINT CHK_CX_TrangThaiCX CHECK (TrangThaiCX IN ('Sắp chạy', 'Đang chạy', 'Hoàn thành', 'Huỷ'))
);

CREATE TABLE Ve (
    MaVe VARCHAR(20) PRIMARY KEY,
    MaChuyen VARCHAR(20) NOT NULL,
    SoGhe VARCHAR(10) NOT NULL,
    TenKhachHang VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(10) NOT NULL,
    GiaVe DECIMAL(10,2) NOT NULL, -- giá vé cuối cùng
    TrangThaiV VARCHAR(50) NOT NULL, -- đã đặt/đã thanh toán/đã huỷ
    CONSTRAINT FK_Ve_ChuyenXe FOREIGN KEY (MaChuyen) REFERENCES ChuyenXe(MaChuyen),
    CONSTRAINT UQ_MaChuyen_SoGhe UNIQUE (MaChuyen, SoGhe), -- không cho trùng ghế
    CONSTRAINT CHK_V_GiaVe CHECK (GiaVe > 0),
    CONSTRAINT CHK_V_TrangThaiV CHECK (TrangThaiV IN ('Đã đặt', 'Đã thanh toán', 'Đã huỷ'))
);