DELIMITER //

CREATE PROCEDURE ThemTaiXeMoi(
	IN p_MaNV VARCHAR(20),
    IN p_SoBangLai VARCHAR(50), 
    IN p_HangBang VARCHAR(10), 
    IN p_NgayCap DATE, 
    IN p_NgayHetHan DATE,
    IN p_KinhNghiem INT
)
BEGIN
    INSERT INTO TaiXe (
        MaTaiXe, 
        SoBangLai, 
        HangBang, 
        NgayCap, 
        NgayHetHan, 
        KinhNghiemNam, 
        TrangThai
    ) 
    VALUES (
        p_MaNV, 
        p_SoBangLai, 
        p_HangBang, 
        p_NgayCap, 
        p_NgayHetHan,
        p_KinhNghiem, 
        'Sẵn sàng'
    );
END //
CREATE PROCEDURE ThemNhanVien(
IN p_Ten VARCHAR(100),
IN p_GioiTinh BIT,
IN p_Email VARCHAR(100),
IN p_ChucVu VARCHAR(50),
IN p_Luong DECIMAL(10,2), -- vì lịch nhà xe phân nên nghĩ là lương cứng luôn

IN p_HeSoLuong decimal(10,2),
IN p_SoBangLai VARCHAR(50), 
IN p_HangBang VARCHAR(10), 
IN p_NgayCap DATE, 
IN p_NgayHetHan DATE,
IN p_KinhNghiem INT,
OUT p_KetQua INT,
out v_Msg TEXT
)
BEGIN
    -- 1. Khai báo tất cả biến ở đây (ngay sau BEGIN)
    DECLARE v_Prefix VARCHAR(5);
    DECLARE v_Thutu INT DEFAULT 0;
    DECLARE v_MaNV_Final VARCHAR(25);
    DECLARE v_quyen VARCHAR(25);
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
			GET DIAGNOSTICS CONDITION 1
				v_Msg = MESSAGE_TEXT;
				
			ROLLBACK;
			
			SET p_KetQua = 0;
		END;
    start transaction;
    IF LOWER(p_ChucVu) = 'tài xế' THEN
        SET v_Prefix = 'TX';
        set v_quyen="Q003";
        
    ELSEIF LOWER(p_ChucVu) = 'quản lý' THEN
        SET v_Prefix = 'QL';
        set v_quyen="Q001";
    ELSE
        SET v_Prefix = 'NV'; -- Mặc định cho các chức vụ khác
        set v_quyen="Q002";
    END IF;
	select v_Prefix;
    -- 2. Đếm xem đã có bao nhiêu mã bắt đầu bằng tiền tố này
    SELECT COUNT(*) INTO v_Thutu 
    FROM NhanVien 
    WHERE MaNhanVien LIKE CONCAT(v_Prefix, '%');

    -- 3. Tạo mã nhân viên cuối cùng bằng cách lấy số lượng + 1
    SET v_MaNV_Final = CONCAT(v_Prefix, LPAD(v_Thutu + 1, 3, '0'));
    -- thêm vào bảng nhân viên
	INSERT INTO NhanVien (MaNhanVien,Ten,GioiTinh,Email,ChucVu,Luong,HeSoLuong,TrangThai) 
    VALUES (v_MaNV_Final, p_Ten, p_GioiTinh, p_Email, p_ChucVu,p_Luong,p_HeSoLuong,"đang làm");
    -- thêm vào tài xế
    IF LOWER(p_ChucVu) = 'tài xế' and p_SoBangLai  IS not NULL and p_HangBang is not NULL and p_NgayCap is not NULL and p_NgayHetHan is not NULL and p_KinhNghiem is not NULL  THEN 
		call ThemTaiXeMoi(v_MaNV_Final,p_SoBangLai,p_HangBang,p_NgayCap,p_NgayHetHan,p_KinhNghiem);
    end if;
    -- Sau đó bạn có thể dùng v_MaNV_Final để INSERT vào bảng
    -- thêm quyền cho nhân viên
	INSERT INTO TaiKhoan (TenTaiKhoan,MatKhau,MaQuyen,MaNhanVien,TrangThai) 
    VALUES (v_MaNV_Final,"12345678",v_quyen,v_MaNV_Final,1);
    COMMIT; -- CHỐT DỮ LIỆU
    SET p_KetQua = 1;  -- Thành công ChuyenXe
    set v_Msg="Thêm dữ liệu thành công";
    
END //
DELIMITER ;






Call ThemNhanVien("Nguyễn Quang Việt",1,"soanM10@gmail.com","tài xế",5000.00,20.00,"GPLX009","B","2019-01-12","2029-01-12",9,@kq,@mes);
select @mesTaiXe

