from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from models.tuyenxe import TuyenXe
from models.chuyenxe import ChuyenXe
from schemas import tuyenxe as schema

def get_all_tuyen(db: Session):
    return db.query(TuyenXe).all()

def get_by_id_tuyen(db: Session, ma_tuyen: str):
    tuyen = db.query(TuyenXe).filter(TuyenXe.MaTuyen == ma_tuyen).first()

    if not tuyen:
        raise HTTPException(
            status_code=404,
            detail='Mã tuyến này không tồn tại'
        )

    return tuyen

# Xử lý lỗi DB
def handle_db_error(exc):
    errors = []
    msg = str(exc.orig)
    print(msg)

    if 'Duplicate' in msg:
        if 'PRIMARY' in msg:
            errors.append({
                'field': 'MaTuyen',
                'message': 'Mã tuyến đã tồn tại'
            })
        if 'entry' in msg:
            errors.append({
                'field': 'DiemDi, DiemDen',
                'message': 'Điểm đi và Điểm đến đã tồn tại'
            })

    return HTTPException(status_code=400, detail={'errors': errors})

def generate_matuyen(db):
    last = db.query(TuyenXe).order_by(TuyenXe.MaTuyen.desc()).first()
    if not last:
        return 'T001'
    
    num = int(last.MaTuyen[2:])
    return f'T{num+1:03d}'

def create_tuyen(db: Session, data: schema.TuyenXeBase):
    ma_tuyen = generate_matuyen(db)
    tuyen = TuyenXe(
        MaTuyen=ma_tuyen, DiemDi=data.DiemDi, DiemDen=data.DiemDen, KhoangCachKm=data.KhoangCachKm, 
        ThoiGianDuKien=data.ThoiGianDuKien, GiaCoBan=data.GiaCoBan       
    )
    try:
        db.add(tuyen)
        db.commit()
        db.refresh(tuyen)
        return tuyen
    
    except IntegrityError as e:
        db.rollback()
        raise handle_db_error(e)
    
def update_tuyen(db: Session, ma_tuyen: str, data: schema.TuyenXeUpdate):
    tuyen = db.query(TuyenXe).filter(TuyenXe.MaTuyen == ma_tuyen).first()

    if not tuyen:
        raise HTTPException(
            status_code=404,
            detail='Mã tuyến này không tồn tại'
        )
    
    update_data = data.model_dump(exclude_unset=True)

    active_trip = db.query(ChuyenXe).filter(
        ChuyenXe.MaTuyen == tuyen.MaTuyen,
        ChuyenXe.TrangThaiCX.in_(['Sắp chạy', 'Đang chạy'])
    ).first()

    if active_trip:
        raise HTTPException(
            status_code=400,
            detail='Tuyến đang có chuyến xe, không thể sửa thông tin'
        )
    try:
        for key, value in update_data.items():
            if value is not None:
                setattr(tuyen, key, value)
        db.commit()
        db.refresh(tuyen)
        return tuyen
    
    except IntegrityError as e:
        db.rollback()
        raise handle_db_error(e)

def delete_tuyen(db: Session, ma_tuyen: str):
    tuyen = db.query(TuyenXe).filter(TuyenXe.MaTuyen == ma_tuyen).first()

    if not tuyen:
        raise HTTPException(
            status_code=404,
            detail='Mã tuyến này không tồn tại'
        )
    
    if tuyen.TrangThaiT == 0:
        raise HTTPException(
            status_code=400,
            detail='Tuyến đã ngưng hoạt động'
        )
    
    active_trip = db.query(ChuyenXe).filter(
        ChuyenXe.MaTuyen == tuyen.MaTuyen,
        ChuyenXe.TrangThaiCX.in_(['Sắp chạy', 'Đang chạy'])
    ).first()

    if active_trip:
        raise HTTPException(
            status_code=400,
            detail='Tuyến đang có chuyến xe, không thể ngưng hoạt động'
        )
    
    tuyen.TrangThaiT = 0

    db.commit()
    db.refresh(tuyen)
    return tuyen
