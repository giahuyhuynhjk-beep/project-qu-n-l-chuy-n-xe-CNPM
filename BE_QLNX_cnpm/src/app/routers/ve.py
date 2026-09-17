from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session

from config.db.config import get_db
from schemas import ve as schema
from controllers import ve as controller

# Tạo router
router = APIRouter(prefix='/ve', tags=['Ve'])

# Lấy tất cả vé / Tìm kiếm vé
@router.get('/', response_model=list[schema.VeDetail])
def get_all(
    sdt: Optional[str] = Query(None),
    ma_ve: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return controller.get_all_ve(db, sdt=sdt, ma_ve=ma_ve)

# Tra cứu vé (Explicit search endpoint)
@router.get('/search', response_model=list[schema.VeDetail])
def search(
    sdt: Optional[str] = Query(None),
    ma_ve: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return controller.search_ve(db, sdt=sdt, ma_ve=ma_ve)

# Lấy chi tiết vé theo mã
@router.get('/{ma_ve}', response_model=schema.VeDetail)
def get_one(ma_ve: str, db: Session = Depends(get_db)):
    return controller.get_by_id_ve(db, ma_ve)

# Thêm vé
@router.post('/', response_model=schema.VeDetail)
def create(data: schema.VeBase, db: Session = Depends(get_db)):
    return controller.create_ve(db, data)

# Cập nhật vé
@router.put('/{ma_ve}', response_model=schema.VeUpdate)
def update(ma_ve: str, data: schema.VeUpdate, db: Session = Depends(get_db)):
    return controller.update_ve(db, ma_ve, data)

# Xóa vé
@router.delete('/{ma_ve}')
def delete(ma_ve: str, db: Session = Depends(get_db)):
    return controller.delete_ve(db, ma_ve)

# Thanh toán vé
@router.patch('/{ma_ve}/pay')
def pay(ma_ve: str, db: Session = Depends(get_db)):
    return controller.pay_ve(db, ma_ve)