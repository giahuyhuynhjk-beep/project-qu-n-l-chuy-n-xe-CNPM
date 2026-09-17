from sqlalchemy.orm import Session
from models.nhanvien import NhanVien
from models.taixe import TaiXe
from models.chuyenxe import ChuyenXe
from schemas import taixe as schema
from fastapi import HTTPException

def get_all_taixe(db: Session):
    tx_list = db.query(TaiXe).join(NhanVien).filter(NhanVien.TrangThaiNV != 'Nghỉ việc').all()
    result = []
    for tx in tx_list:
        result.append({
            'MaTaiXe': tx.MaTaiXe,
            'Ten': tx.nhan_vien.Ten,
            'TrangThaiTX': tx.TrangThaiTX
        })
    return result

def get_by_id_taixe(db: Session, ma_tx: str):
    tx = db.query(TaiXe).join.filter(
        TaiXe.MaTaiXe == ma_tx,
        NhanVien.TrangThaiNV != 'Nghỉ việc'
    ).first()

    if not tx:
        raise HTTPException(
            status_code=404,
            detail='Tài xế không tồn tại'
        )
    return {
        'MaTaiXe': tx.MaTaiXe,
        'Ten': tx.nhan_vien.Ten,
        'SoBangLai': tx.SoBangLai,
        'HangBang': tx.HangBang,
        'NgayCap': tx.NgayCap,
        'NgayHetHan': tx.NgayHetHan,
        'KinhNghiemNam': tx.KinhNghiemNam,
        'TrangThaiTX': tx.TrangThaiTX
    }

def update_taixe(db: Session, ma_tx: str, data: schema.TaiXeUpdate):
    tx = db.query(TaiXe).join(NhanVien).filter(
        TaiXe.MaTaiXe == ma_tx, 
        NhanVien.TrangThaiNV != 'Nghỉ việc'
    ).first()

    if not tx:
        raise HTTPException(
            status_code=404,
            detail='Tài xế không tồn tại'
        )
    
    update_data = data.model_dump(exclude_unset=True)

    active_trip = db.query(ChuyenXe).filter(
        ChuyenXe.MaTaiXe == tx.MaTaiXe,
        ChuyenXe.TrangThaiCX.in_(['Sắp chạy', 'Đang chạy'])
    ).first()

    if active_trip:
        raise HTTPException(
            status_code=400,
            detail='Tài xế đang có chuyến xe, không thể sửa thông tin'
        )
    
    if 'TrangThaiTX' in update_data:
        if update_data['TrangThaiTX'] == 'Đang lái':
            raise HTTPException(
                status_code=400,
                detail='Không được cập nhật thành trạng thái này'
            )
        
    for key, value in update_data.items():
        if value is not None:
            setattr(tx, key, value)
    
    db.commit()
    db.refresh(tx)
    return {
        'MaTaiXe': tx.MaTaiXe,
        'Ten': tx.nhan_vien.Ten,
        'SoBangLai': tx.SoBangLai,
        'HangBang': tx.HangBang,
        'NgayCap': tx.NgayCap,
        'NgayHetHan': tx.NgayHetHan,
        'KinhNghiemNam': tx.KinhNghiemNam,
        'TrangThaiTX': tx.TrangThaiTX
    }