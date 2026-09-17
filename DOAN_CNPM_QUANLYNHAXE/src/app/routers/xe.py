from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.db.config import get_db
from schemas import xe as schema
from controllers import xe as controller

# Tạo router
router = APIRouter(prefix='/xe', tags=['Xe'])

# Lấy tất cả xe
@router.get('/', response_model=list[schema.XeList])
def get_all(db: Session = Depends(get_db)):
    return controller.get_all_xe(db)

# Lấy xe theo biển số
@router.get('/{bien_so}', response_model=schema.XeDetail)
def get_one(bien_so: str, db: Session = Depends(get_db)):
    return controller.get_by_id_xe(db, bien_so)

# Thêm xe
@router.post('/', response_model=schema.XeDetail)
def create(data: schema.XeCreate, db: Session = Depends(get_db)):
    return controller.create_xe(db, data)

# Cập nhật xe
@router.put('/{bien_so}', response_model=schema.XeDetail)
def update(bien_so: str, data: schema.XeUpdate, db: Session = Depends(get_db)):
    return controller.update_xe(db, bien_so, data)

# Xóa xe
@router.delete('/{bien_so}', response_model=schema.XeDetail)
def delete(bien_so: str, db: Session = Depends(get_db)):
    return controller.delete_xe(db, bien_so)