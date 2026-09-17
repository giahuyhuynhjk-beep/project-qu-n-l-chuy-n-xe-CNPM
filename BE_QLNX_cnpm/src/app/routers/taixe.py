from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from config.db.config import get_db
from controllers import taixe as controller
from schemas import taixe as schema

router = APIRouter(prefix='/tai-xe', tags=['TaiXe'])

# Lấy danh sách tất cả tài xế
@router.get('/', response_model=list[schema.TaiXeList])
def get_all(db: Session=Depends(get_db)):
    return controller.get_all_taixe(db)

# Lấy thông tin chi tiết tài xế theo mã tài xế
@router.get('/{ma_tx}', response_model=schema.TaiXeDetail)
def get_one(ma_tx: str, db: Session=Depends(get_db)):
    return controller.get_by_id_taixe(db, ma_tx)

# Cập nhật thông tin tài xế
@router.put('/{ma_tx}', response_model=schema.TaiXeDetail)
def update(ma_tx: str, data: schema.TaiXeUpdate, db: Session=Depends(get_db)):
    return controller.update_taixe(db, ma_tx, data)