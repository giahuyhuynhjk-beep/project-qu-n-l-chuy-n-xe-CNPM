from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.nhanvien import NhanVien
from models.quyen import Quyen
from models.taikhoan import TaiKhoan
from schemas import taikhoan as schema

# Lấy ra danh sách tất cả tài khoản
def get_all_taikhoan(db: Session):
    return db.query(TaiKhoan).join(NhanVien).filter(NhanVien.TrangThaiNV != 'Nghỉ việc').all()

# Lấy ra thông tin chi tiết tài khoản theo tên tài khoản
def get_by_id_taikhoan(db: Session, ma_nv: str):
    tk = db.query(TaiKhoan).join(NhanVien).filter(
        TaiKhoan.MaNhanVien == ma_nv,
        NhanVien.TrangThaiNV != 'Nghỉ việc'
    ).first()

    if not tk:
        raise HTTPException(
            status_code=404,
            detail='Tài khoản không tồn tại'
        )
    return {
        'TenTaiKhoan': tk.TenTaiKhoan,
        'MatKhau': tk.MatKhau, # lấy ra để test
        'TenQuyen': tk.quyen.TenQuyen,
        'MaNhanVien': tk.MaNhanVien,
        'Ten': tk.nhan_vien.Ten,
        'TrangThaiTK': tk.TrangThaiTK
    }

# Cập nhật thông tin tài khoản
# - Admin được cập nhật: mật khẩu, mã quyền, trạng thái tài khoản
# - Nhân viên được cập nhật: mật khẩu
def update_taikhoan(db: Session, ma_nv: str, data):
    tk = db.query(TaiKhoan).join(NhanVien).filter(
        TaiKhoan.MaNhanVien == ma_nv,
        NhanVien.TrangThaiNV != 'Nghỉ việc'
    ).first()
    
    if not tk:
        raise HTTPException(
            status_code=404,
            detail='Tài khoản không tồn tại'
        )
    
    update_data = data.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        if value is not None:
            setattr(tk, key, value)

    db.commit()
    db.refresh(tk)
    return {
        'TenTaiKhoan': tk.TenTaiKhoan,
        'TenQuyen': tk.quyen.TenQuyen,
        'MaNhanVien': tk.MaNhanVien,
        'Ten': tk.nhan_vien.Ten,
        'TrangThaiTK': tk.TrangThaiTK,
        'MatKhau': tk.MatKhau # lấy ra để test
    }