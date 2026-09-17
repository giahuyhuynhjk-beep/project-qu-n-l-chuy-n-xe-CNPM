from config.db.config import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from models.taikhoan import TaiKhoan
from schemas import taikhoan as schema
from controllers import taikhoan as controller

router = APIRouter(prefix='/tai-khoan', tags=['TaiKhoan'])

@router.get('/', response_model=list[schema.TaiKhoanList])
def get_all(db: Session=Depends(get_db)):
    return controller.get_all_taikhoan(db)

@router.get('/{ma_nv}', response_model=schema.TaiKhoanDetail)
def get_one(ma_nv: str, db: Session=Depends(get_db)):
    return controller.get_by_id_taikhoan(db, ma_nv)

# Cập nhật thông tin tài khoản bởi admin
@router.put('/admin/{ma_nv}', response_model=schema.TaiKhoanDetail)
def update_by_admin(ma_nv: str, data: schema.TaiKhoanUpdateAdmin, db: Session=Depends(get_db)):
    return controller.update_taikhoan(db, ma_nv, data)

# Cập nhật thông tin tài khoản bởi nhân viên
@router.put('/nhanvien/{ma_nv}', response_model=schema.TaiKhoanDetail)
def update_by_nhanvien(ma_nv: str, data: schema.TaiKhoanUpdateNhanVien, db: Session=Depends(get_db)):
    return controller.update_taikhoan(db, ma_nv, data)