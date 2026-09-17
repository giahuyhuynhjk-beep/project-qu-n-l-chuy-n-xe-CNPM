from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session

from config.db.config import get_db
from schemas import chuyenxe as schema
from controllers import chuyenxe as controller

# Tạo tuyến
router = APIRouter(prefix='/chuyen-xe', tags=['ChuyenXe'])

# Danh sách tất cả chuyến (Admin)
@router.get('/', response_model=list[schema.ChuyenXeList])
def get_all(db: Session = Depends(get_db)):
    return controller.get_all_chuyen(db)

# Danh sách chuyến sắp chạy cho Khách hàng (lọc active + ThoiGianKhoiHanh >= NOW)
@router.get('/upcoming', response_model=list[schema.ChuyenXeList])
def get_upcoming(
    diem_di: Optional[str] = Query(None),
    diem_den: Optional[str] = Query(None),
    ngay: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return controller.get_upcoming_chuyen(db, diem_di=diem_di, diem_den=diem_den, ngay=ngay)

@router.get('/{ma_chuyen}', response_model=schema.ChuyenXeDetail)
def get_one(ma_chuyen: str, db: Session=Depends(get_db)):
    return controller.get_by_id_chuyen(db, ma_chuyen)

@router.post('/', response_model=schema.ChuyenXeDetail)
def create(data: schema.ChuyenXeBase, db: Session=Depends(get_db)):
    return controller.create_chuyen(db, data)

# Sửa nhân viên
@router.put('/{ma_chuyen}', response_model=schema.ChuyenXeDetail)
def update(ma_chuyen: str, data: schema.ChuyenXeUpdate, db: Session=Depends(get_db)):
    return controller.update_chuyen(db, ma_chuyen, data)

# Xoá nhân viên
@router.delete('/{ma_chuyen}', response_model=schema.ChuyenXeDetail)
def delete(ma_chuyen: str, db: Session=Depends(get_db)):
    return controller.delete_chuyen(db, ma_chuyen)
