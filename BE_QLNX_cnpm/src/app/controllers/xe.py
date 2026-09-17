from sqlalchemy.orm import Session
from models.xe import Xe
from models.chuyenxe import ChuyenXe
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from schemas import xe as schema

# Lấy tất cả xe
def get_all_xe(db: Session):
    return db.query(Xe).all()

# Lấy xe theo biển số
def get_by_id_xe(db: Session, bien_so: str):
    xe = db.query(Xe).filter(Xe.BienSo == bien_so).first()
    if not xe:
        raise HTTPException(
            status_code=404,
            detail='Biển số không tồn tại'
        )
    return xe

# Xử lý lỗi DB
def handle_db_error(exc):
    errors = []
    msg = str(exc.orig)
    print(msg)

    if 'Duplicate' in msg:
        if 'PRIMARY' in msg:
            errors.append({
                'field': 'BienSo',
                'message': 'Biển số xe đã tồn tại'
            })

    return HTTPException(status_code=400, detail={'errors': errors})

# Thêm xe
def create_xe(db: Session, data:schema.XeCreate):
    xe = Xe(BienSo=data.BienSo, LoaiXe=data.LoaiXe, SoCho=data.SoCho, HangXe=data.HangXe)

    try:
        db.add(xe)
        db.commit()
        db.refresh(xe)
        return xe

    except IntegrityError as e:
        db.rollback()
        raise handle_db_error(e)

# Update xe
def update_xe(db: Session, bien_so: str, data: schema.XeUpdate):
    xe = db.query(Xe).filter(Xe.BienSo == bien_so).first()

    if not xe:
        raise HTTPException(
            status_code=404,
            detail='Biển số xe không tồn tại'
        )
    
    update_data = data.model_dump(exclude_unset=True)
    
    active_trip = db.query(ChuyenXe).filter(
        ChuyenXe.MaXe == xe.BienSo,
        ChuyenXe.TrangThaiCX.in_(['Sắp chạy', 'Đang chạy'])
    ).first()

    if active_trip:
        raise HTTPException(
            status_code=400,
            detail='Xe đang có chuyến xe, không thể sửa thông tin'
        )
    
    if 'TrangThaiX' in update_data:
        if update_data['TrangThaiX'] == 'Đang chạy':
            raise HTTPException(
                status_code=400,
                detail='Không được cập nhật trạng thái này'
            )

    for key, value in update_data.items():
        if value is not None:
            setattr(xe, key, value)

    db.commit()
    db.refresh(xe)
    return xe

# Xóa xe
def delete_xe(db: Session, bien_so: str):
    xe = db.query(Xe).filter(Xe.BienSo == bien_so).first()

    if not xe:
        raise HTTPException(
            status_code=404,
            detail='Biển số xe không tồn tại'
        )
    
    if xe.TrangThaiX == 'Ngưng hoạt động':
        raise HTTPException(
            status_code=400,
            detail='Xe đã ngưng hoạt động'
        )
    
    active_trip = db.query(ChuyenXe).filter(
        ChuyenXe.MaXe == xe.BienSo,
        ChuyenXe.TrangThaiCX.in_(['Sắp chạy', 'Đang chạy'])
    ).first()

    if active_trip:
        raise HTTPException(
            status_code=400,
            detail='Xe đang có chuyến xe, không thể xoá'
        )

    xe.TrangThaiX = 'Ngưng hoạt động'

    db.commit()
    db.refresh(xe)
    return xe