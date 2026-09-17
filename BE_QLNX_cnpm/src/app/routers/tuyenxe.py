from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.db.config import get_db
from schemas import tuyenxe as schema
from controllers import tuyenxe as controller

from dependencies.auth import require_role

# Tạo tuyến
router = APIRouter(prefix='/tuyen-xe', tags=['TuyenXe'])

@router.get('/', response_model=list[schema.TuyenXeList])
def get_all(db: Session=Depends(get_db)):
    return controller.get_all_tuyen(db)

@router.get('/{ma_tuyen}', response_model=schema.TuyenXeDetail)
def get_one(ma_tuyen: str, db: Session=Depends(get_db)):
    return controller.get_by_id_tuyen(db, ma_tuyen)

@router.post('/', response_model=schema.TuyenXeDetail)
def create(data: schema.TuyenXeBase, db: Session=Depends(get_db)):
    return controller.create_tuyen(db, data)

# Sửa nhân viên
@router.put('/{ma_tuyen}', response_model=schema.TuyenXeDetail)
def update(ma_tuyen: str, data: schema.TuyenXeUpdate, db: Session=Depends(get_db)):
    return controller.update_tuyen(db, ma_tuyen, data)

# Xoá nhân viên
@router.delete('/{ma_tuyen}', response_model=schema.TuyenXeDetail)
def delete(ma_tuyen: str, db: Session=Depends(get_db)):
    return controller.delete_tuyen(db, ma_tuyen)
