from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from models.chuyenxe import ChuyenXe
from models.tuyenxe import TuyenXe
from models.taixe import TaiXe
from models.xe import Xe
from schemas import chuyenxe as schema

# Lấy tất cả chuyến (Admin)
def get_all_chuyen(db: Session):
    return db.query(ChuyenXe).all()

# Lấy chuyến xe sắp chạy cho Khách hàng (lọc theo trạng thái Active và thời gian >= NOW)
def get_upcoming_chuyen(db: Session, diem_di: str = None, diem_den: str = None, ngay: str = None):
    now = datetime.now()
    # Các trạng thái hợp lệ (chưa hoàn thành / huỷ)
    active_statuses = ['Sắp chạy', 'Sap chay', 'San sang']
    query = db.query(ChuyenXe).filter(
        ChuyenXe.TrangThaiCX.in_(active_statuses),
        ChuyenXe.ThoiGianKhoiHanh >= now
    )
    # Lọc theo điểm đi / điểm đến nếu có
    if diem_di or diem_den:
        query = query.join(TuyenXe, ChuyenXe.MaTuyen == TuyenXe.MaTuyen, isouter=True)
        if diem_di:
            query = query.filter(TuyenXe.DiemDi.ilike(f'%{diem_di}%'))
        if diem_den:
            query = query.filter(TuyenXe.DiemDen.ilike(f'%{diem_den}%'))
    if ngay:
        try:
            ngay_dt = datetime.strptime(ngay, '%Y-%m-%d')
            query = query.filter(
                ChuyenXe.ThoiGianKhoiHanh >= ngay_dt,
                ChuyenXe.ThoiGianKhoiHanh < ngay_dt.replace(hour=23, minute=59, second=59)
            )
        except ValueError:
            pass
    return query.order_by(ChuyenXe.ThoiGianKhoiHanh.asc()).all()

def get_by_id_chuyen(db: Session, ma_chuyen: str):
    cx = db.query(ChuyenXe).filter(ChuyenXe.MaChuyen == ma_chuyen).first()

    if not cx:
        raise HTTPException(
            status_code=404,
            detail='Chuyến không tồn tại'
        )
    
    return cx

# Xử lý lỗi DB
def handle_db_error(exc):
    errors = []
    msg = str(exc.orig)
    print(msg)

    if 'Duplicate' in msg:
        if 'PRIMARY' in msg:
            errors.append({
                'field': 'MaChuyen',
                'message': 'Mã chuyến đã tồn tại'
            })

    return HTTPException(status_code=400, detail={'errors': errors})

def generate_machuyen(db):
    last = db.query(ChuyenXe).order_by(ChuyenXe.MaChuyen.desc()).first()
    if not last:
        return 'CX001'
    
    num = int(last.MaChuyen[2:])
    return f'CX{num+1:03d}'

def create_chuyen(db: Session, data: schema.ChuyenXeBase):
    # Kiểm tra tuyến
    tuyen = db.query(TuyenXe).filter(TuyenXe.MaTuyen == data.MaTuyen).first()
    if not tuyen:
        raise HTTPException(
            status_code=404,
            detail='Tuyến không tồn tại'
        )
    if tuyen.TrangThaiT == 0:
        raise HTTPException(
            status_code=400,
            detail='Tuyến không hoạt động'
        )
    
    # Kiểm tra xe
    xe = db.query(Xe).filter(Xe.BienSo == data.MaXe).first()
    if not xe:
        raise HTTPException(
            status_code=404,
            detail='Xe không tồn tại'
        )
    if xe.TrangThaiX == 'ngưng hoạt động':
        raise HTTPException(
            status_code=400,
            detail='Xe không hoạt động'
        )
    
    # Kiểm tra tài xế
    tx = db.query(TaiXe).filter(TaiXe.MaTaiXe == data.MaTaiXe).first()
    if not tx:
        raise HTTPException(
            status_code=404,
            detail='Tài xế không tồn tại'
        )
    if tx.TrangThaiTX == 0:
        raise HTTPException(
            status_code=400,
            detail='Tài xế không hoạt động'
        )
    
    # Kiểm tra xung đột xe: để không xung đột thì phải xảy ra 1 trong 2
    # Chuyến mới bắt đầu sau khi chuyến cũ kết thúc (start_new >= end_old)
    # Chuyến mới kết thúc trước khi chuyến cũ bắt đầu (end_new <= start_old)
    conflict_xe = db.query(ChuyenXe).filter(
        ChuyenXe.MaXe == data.MaXe,
        ChuyenXe.TrangThaiCX.in_(['Sắp chạy', 'Đang chạy']),
        ChuyenXe.ThoiGianDuKienDen > data.ThoiGianKhoiHanh,
        ChuyenXe.ThoiGianKhoiHanh < data.ThoiGianDuKienDen
    ).first()

    if conflict_xe:
        raise HTTPException(
            status_code=400,
            detail='Xe bị trùng lịch'
        )
    
    conflict_taixe = db.query(ChuyenXe).filter(
        ChuyenXe.MaTaiXe == data.MaTaiXe,
        ChuyenXe.TrangThaiCX.in_(['Sắp chạy', 'Đang chạy']),
        ChuyenXe.ThoiGianDuKienDen > data.ThoiGianKhoiHanh,
        ChuyenXe.ThoiGianKhoiHanh < data.ThoiGianDuKienDen
    ).first()

    if conflict_taixe:
        raise HTTPException(
            status_code=400,
            detail='Tài xế bị trùng lịch'
        )
    
    ma_chuyen = generate_machuyen(db)
    
    cx = ChuyenXe(
        MaChuyen=ma_chuyen, MaTuyen=data.MaTuyen, MaXe=data.MaXe,
        MaTaiXe=data.MaTaiXe, ThoiGianKhoiHanh=data.ThoiGianKhoiHanh,
        ThoiGianDuKienDen=data.ThoiGianDuKienDen, GiaVe=tuyen.GiaCoBan,
    )    

    db.add(cx)
    db.commit()
    db.refresh(cx)
    return cx

def update_chuyen(db: Session, ma_chuyen: str, data: schema.ChuyenXeUpdate):
    cx = db.query(ChuyenXe).filter(ChuyenXe.MaChuyen == ma_chuyen).first()

    if not cx:
        raise HTTPException(
            status_code=404,
            detail='Chuyến xe không tồn tại'
        )
    
    update_data = data.model_dump(exclude_unset=True)

    # Trạng thái CX: Hoàn thành/ Huỷ
    if cx.TrangThaiCX in ['Hoàn thành', 'Huỷ']:
        raise HTTPException(
            status_code=400,
            detail='Chuyến đã hoàn thành/huỷ, không thể sửa thông tin'
        )
    
    # Trạng thái CX: Đang chạy
    if cx.TrangThaiCX == 'Đang chạy':
        if update_data['TrangThaiCX'] == 'Hoàn thành':
            xe = db.query(Xe).filter(Xe.BienSo == cx.MaXe).first()
            tx = db.query(TaiXe).filter(TaiXe.MaTaiXe == cx.MaTaiXe).first()
            if xe:
                xe.TrangThaiX = 'Sẵn sàng'
            if tx:
                tx.TrangThaiTX = 'Sẵn sàng'

            cx.TrangThaiCX = 'Hoàn thành'

            db.commit()
            db.refresh(cx)
            return cx
        
        raise HTTPException(
            status_code=400,
            detail='Chỉ được chuyển sang trạng thái hoàn thành'
        )
    
    # Trạng thái CX: Sắp chạy
    if cx.TrangThaiCX == 'Sắp chạy':
        if update_data['TrangThaiCX'] == 'Đang chạy':
            xe = db.query(Xe).filter(Xe.BienSo == cx.MaXe).first()
            tx = db.query(TaiXe).filter(TaiXe.MaTaiXe == cx.MaTaiXe).first()
            if xe:
                xe.TrangThaiX = 'Đang chạy'
            if tx:
                tx.TrangThaiTX = 'Đang lái'

            cx.TrangThaiCX = 'Đang chạy'

            db.commit()
            db.refresh(cx)
            return cx
        
        if update_data['TrangThaiCX'] == 'Huỷ':
            cx.TrangThaiCX = 'Huỷ'

            db.commit()
            db.refresh(cx)
            return cx

        for key, value in update_data.items():
            if value is not None:
                setattr(cx, key, value)

    db.commit()
    db.refresh(cx)
    return cx

def delete_chuyen(db: Session, ma_chuyen: str):
    cx = db.query(ChuyenXe).filter(ChuyenXe.MaChuyen == ma_chuyen).first()

    if not cx:
        raise HTTPException(
            status_code=404,
            detail='Chuyến xe không tồn tại'
        )
    
    if cx.TrangThaiCX == 'Đang chạy':
        raise HTTPException(
            status_code=400,
            detail='Chuyến đang chạy, không thể xoá'
        )
    
    if cx.TrangThaiCX in ['Hoàn thành', 'Huỷ']:
        raise HTTPException(
            status_code=400,
            detail='Chuyến đã kết thúc'
        )
    
    cx.TrangThaiCX = 'Huỷ'

    db.commit()
    db.refresh(cx)
    return cx


