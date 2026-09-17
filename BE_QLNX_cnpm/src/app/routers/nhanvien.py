from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.db.config import get_db
from schemas import nhanvien as schema
from controllers import nhanvien as controller

from dependencies.auth import require_role

# Tạo tuyến
router = APIRouter(prefix='/nhan-vien', tags=['NhanVien'])

# Lấy danh sách tất cả nhân viên (trả về dạng list)
@router.get('/', response_model=list[schema.NhanVienList])
def get_all(db: Session=Depends(get_db)):
    return controller.get_all_nhanvien(db)

# Lấy thông tin chi tiết nhân viên theo mã nhân viên
@router.get('/{ma_nv}', response_model=schema.NhanVienDetail)
def get_one(ma_nv: str, db: Session=Depends(get_db)):
    return controller.get_by_id_nhanvien(db, ma_nv)

# Thêm nhân viên
@router.post('/', response_model=schema.NhanVienDetail)
def create(data: schema.NhanVienCreate, db: Session=Depends(get_db)):
    return controller.create_nhanvien(db, data)

# Sửa nhân viên
@router.put('/{ma_nv}', response_model=schema.NhanVienDetail)
def update(ma_nv: str, data: schema.NhanVienUpdate, db: Session=Depends(get_db)):
    return controller.update_nhanvien(db, ma_nv, data)

# Xoá nhân viên
@router.delete('/{ma_nv}', response_model=schema.NhanVienDetail)
def delete(ma_nv: str, db: Session=Depends(get_db)):
    return controller.delete_nhanvien(db, ma_nv)