from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
import re

from models.ve import Ve
from models.chuyenxe import ChuyenXe
from schemas import ve as schema

# Lấy tất cả vé
def get_all_ve(db: Session, sdt: str = None, ma_ve: str = None):
    query = db.query(Ve)
    if sdt and sdt.strip():
        query = query.filter(func.trim(Ve.SoDienThoai) == sdt.strip())
    if ma_ve and ma_ve.strip():
        query = query.filter(func.trim(Ve.MaVe) == ma_ve.strip())
    return query.all()

# Lấy vé theo mã
def get_by_id_ve(db: Session, ma_ve: str):
    ve = db.query(Ve).filter(func.trim(Ve.MaVe) == ma_ve.strip()).first()
    if not ve:
        raise HTTPException(
            status_code=404,
            detail='Vé không tồn tại'
        )
    return ve

# Tra cứu vé theo SDT hoặc Mã vé
def search_ve(db: Session, sdt: str = None, ma_ve: str = None):
    query = db.query(Ve)
    if sdt and sdt.strip():
        query = query.filter(func.trim(Ve.SoDienThoai) == sdt.strip())
    if ma_ve and ma_ve.strip():
        query = query.filter(func.trim(Ve.MaVe) == ma_ve.strip())
    return query.all()

# Check lỗi DB
def handle_db_error(exc):
    errors = []
    msg = str(exc.orig)
    try:
        print(f"[DB Error]: {msg}")
    except Exception:
        pass

    if 'Duplicate' in msg:
        if 'PRIMARY' in msg:
            errors.append({
                'field': 'MaVe',
                'message': 'Mã vé đã tồn tại'
            })
        elif 'UQ_MaChuyen_SoGhe' in msg:
            errors.append({
                'field': 'SoGhe',
                'message': 'Ghế này đã được đặt trong chuyến'
            })

    return HTTPException(status_code=400, detail={'errors': errors})

def generate_mave(ma_chuyen, so_ghe):
    match = re.search(r'\d+', str(so_ghe))
    num = match.group() if match else "01"
    return f'{ma_chuyen}.{int(num):02d}'

# Thêm vé (QUAN TRỌNG)
def create_ve(db: Session, data: schema.VeBase, is_counter=False):
    # Kiểm tra có chuyến
    cx = db.query(ChuyenXe).filter(ChuyenXe.MaChuyen == data.MaChuyen).first()

    if not cx or cx.TrangThaiCX in ['Hoàn thành', 'Huỷ', 'Hoan thanh', 'Huy']:
        raise HTTPException(
            status_code=400,
            detail='Chuyến không hợp lệ hoặc đã kết thúc'
        )
    
    # Kiểm tra ghế trùng
    existing = db.query(Ve).filter(
        Ve.MaChuyen == data.MaChuyen,
        func.trim(Ve.SoGhe) == data.SoGhe.strip(),
        Ve.TrangThaiV.notin_(['Đã huỷ', 'Da huy', 'Đã hủy'])
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail='Ghế đã được đặt trong chuyến này'
        )
    
    trangthai_ve = 'Đã thanh toán' if is_counter else 'Đã đặt'
    ma_ve = data.MaVe if data.MaVe else generate_mave(cx.MaChuyen, data.SoGhe)
    
    ve = Ve(
        MaVe=ma_ve,
        MaChuyen=data.MaChuyen,
        SoGhe=data.SoGhe.strip(),
        TenKhachHang=data.TenKhachHang.strip(),
        SoDienThoai=data.SoDienThoai.strip(),
        GiaVe=cx.GiaVe,
        TrangThaiV=trangthai_ve
    )

    try:
        db.add(ve)
        db.commit()
        db.refresh(ve)
        try:
            print(f"[SUCCESS create_ve]: Da tao ve {ve.MaVe} thanh cong vao Database")
        except Exception:
            pass
        return ve

    except IntegrityError as e:
        db.rollback()
        try:
            print(f"[ERROR create_ve IntegrityError]: {e}")
        except Exception:
            pass
        raise handle_db_error(e)
    except Exception as e:
        db.rollback()
        try:
            print(f"[ERROR create_ve Unexpected]: {e}")
        except Exception:
            pass
        raise HTTPException(status_code=400, detail=f'Lỗi tạo vé: {str(e)}')

def update_ve(db: Session, ma_ve: str, data: schema.VeUpdate):
    ve = db.query(Ve).filter(func.trim(Ve.MaVe) == ma_ve.strip()).first()

    if not ve:
        raise HTTPException(
            status_code=404,
            detail='Vé không tồn tại'
        )
    
    update_data = data.model_dump(exclude_unset=True)
    
    if ve.TrangThaiV in ['Đã thanh toán', 'Da thanh toan']:
        raise HTTPException(
            status_code=400,
            detail='Vé đã thanh toán, không thể sửa'
        )
    
    if ve.TrangThaiV in ['Đã huỷ', 'Da huy', 'Đã hủy']:
        raise HTTPException(
            status_code=400,
            detail='Vé đã huỷ, không thể sửa'
        )
    
    if 'SoGhe' in update_data:
        existing = db.query(Ve).filter(
            Ve.MaChuyen == ve.MaChuyen,
            func.trim(Ve.SoGhe) == update_data['SoGhe'].strip(),
            Ve.TrangThaiV.notin_(['Đã huỷ', 'Da huy', 'Đã hủy'])
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail='Ghế đã được đặt'
            )

    for key, value in update_data.items():
        if value is not None:
            setattr(ve, key, value)

    db.commit()
    db.refresh(ve)
    return ve

def delete_ve(db: Session, ma_ve: str):
    ve = db.query(Ve).filter(func.trim(Ve.MaVe) == ma_ve.strip()).first()

    if not ve:
        raise HTTPException(
            status_code=404,
            detail='Vé không tồn tại'
        )
    
    if ve.TrangThaiV in ['Đã thanh toán', 'Da thanh toan']:
        raise HTTPException(
            status_code=400,
            detail='Vé đã thanh toán, không thể huỷ'
        )
    
    if ve.TrangThaiV in ['Đã huỷ', 'Da huy', 'Đã hủy']:
        raise HTTPException(
            status_code=400,
            detail='Vé đã được huỷ trước đó'
        )
    
    ve.TrangThaiV = 'Đã huỷ'

    db.commit()
    db.refresh(ve)
    return ve

def pay_ve(db: Session, ma_ve: str):
    ve = db.query(Ve).filter(func.trim(Ve.MaVe) == ma_ve.strip()).first()

    if not ve:
        raise HTTPException(
            status_code=404,
            detail='Vé không tồn tại'
        )
    
    if ve.TrangThaiV in ['Đã thanh toán', 'Da thanh toan']:
        raise HTTPException(
            status_code=400,
            detail='Vé đã được thanh toán'
        )
    
    ve.TrangThaiV = 'Đã thanh toán'

    db.commit()
    db.refresh(ve)
    return ve