from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
import unicodedata
import re

from models.nhanvien import NhanVien
from models.taixe import TaiXe
from models.taikhoan import TaiKhoan
from models.quyen import Quyen
from models.chuyenxe import ChuyenXe
from schemas import nhanvien as schema


# Function handler 

# Lấy ra tất cả nhân viên
def get_all_nhanvien(db: Session):
    return db.query(NhanVien).all()

# Lấy ra nhân viên dựa theo mã nhân viên
def get_by_id_nhanvien(db: Session, ma_nv: str):
    nv = db.query(NhanVien).filter(NhanVien.MaNhanVien == ma_nv).first()

    if not nv:
        raise HTTPException(
            status_code=404,
            detail='Nhân viên không tồn tại'
        )
    
    return nv

# Xử lý khi có lỗi ở DB
def handle_db_error(exc):
    errors = []
    msg = str(exc.orig)
    print(msg)
    if 'Duplicate' in msg:
        if 'PRIMARY' in msg:
            errors.append({
                'field': 'MaNhanVien',
                'message': 'Mã nhân viên đã tồn tại'
            })
        elif 'Email' in msg:
            errors.append({
                'field': 'Email',
                'message': 'Email đã tồn tại'
            })
    return HTTPException(status_code=400, detail={'errors': errors})

# Tự tạo ra mã nhân viên
def generate_id_nhanvien(db, role):
    role_map = {
        'Quản lý': 'QL',
        'Nhân viên bán vé': 'NV',
        'Tài xế': 'TX'
    }
    prefix_id = role_map.get(role, 'NV')

    last = db.query(NhanVien).\
        filter(NhanVien.MaNhanVien.like(f'{prefix_id}%')).\
        order_by(NhanVien.MaNhanVien.desc()).first()
    if not last:
        return f'{prefix_id}001'
    
    num = int(last.MaNhanVien[len(prefix_id):])

    postfix_id = f'{num+1:03d}' # số nguyên, đủ 3 số, thiếu thì thêm số 0 ở trước

    return f'{prefix_id}{postfix_id}'

# Tự tạo ra tên tài khoản nhân viên
def generate_username_nhanvien(db, nv):
    name = nv.Ten
    name = unicodedata.normalize('NFD', name)
    name = name.encode('ascii', 'ignore').decode('utf-8')
    name = re.sub(r'[^a-zA-Z0-9]','', name)
    name = name.lower()
    
    id = nv.MaNhanVien
    id = id.lower()

    return f'{name}.{id}'

# Thêm nhân viên
def create_nhanvien(db: Session, data:schema.NhanVienCreate):
    ma_nv = generate_id_nhanvien(db, data.ChucVu)
    nv = NhanVien(
        MaNhanVien=ma_nv, Ten=data.Ten, GioiTinh=data.GioiTinh, Email=data.Email, 
        ChucVu=data.ChucVu, Luong=data.Luong, HeSoLuong=data.HeSoLuong
    )
    try:
        db.add(nv)
        # Thêm tài khoản
        ten_tk = generate_username_nhanvien(db, nv)
        quyen = db.query(Quyen).filter(Quyen.TenQuyen == nv.ChucVu).first()

        tk = TaiKhoan(TenTaiKhoan=ten_tk, MatKhau=ten_tk, 
                      MaQuyen=quyen.MaQuyen, MaNhanVien=ma_nv
        )
        db.add(tk)

        # Thêm tài xế
        if nv.ChucVu == 'Tài xế':
            tx = TaiXe(
                MaTaiXe=ma_nv, SoBangLai=data.taixe.SoBangLai, HangBang=data.taixe.HangBang,
                NgayCap=data.taixe.NgayCap, NgayHetHan=data.taixe.NgayHetHan
            )
            db.add(tx)
            try: 
                db.flush()
            except IntegrityError as e:
                db.rollback()
                raise HTTPException(
                    status_code=400,
                    detail='Số bằng lái đã tồn tại'
                )
            
        db.commit()
        db.refresh(nv)
        return nv
    
    except IntegrityError as e:
        db.rollback()
        raise handle_db_error(e)
    
# Sửa nhân viên
def update_nhanvien(db: Session, ma_nv: str, data: schema.NhanVienUpdate):
    nv = db.query(NhanVien).filter(NhanVien.MaNhanVien == ma_nv).first()
    if not nv:
        raise HTTPException(
            status_code=404,
            detail='Nhân viên không tồn tại'
        )
    
    tk = db.query(TaiKhoan).filter(TaiKhoan.MaNhanVien == nv.MaNhanVien).first()

    update_data = data.model_dump(exclude_unset=True) # chuyển object sang dict, và chỉ lấy field user gửi lên
    
    # Nhân viên đã nghỉ việc thì chỉ cho mở lại, không cho sửa gì khác
    if nv.TrangThaiNV == 'Nghỉ việc':
        if update_data['TrangThaiNV'] == 'Đang làm':
            nv.TrangThaiNV = 'Đang làm'
            tk.TrangThaiTK = 1
            if nv.ChucVu == 'Tài xế':
                tx = db.query(TaiXe).filter(TaiXe.MaTaiXe == nv.MaNhanVien).first()
                if tx:
                    tx.TrangThaiTX = 'Sẵn sàng'

            db.commit()
            db.refresh(nv)
            return nv
        
        raise HTTPException(
            status_code=400,
            detail='Nhân viên đã nghỉ việc, chỉ được mở lại'
        )
    
    # Nhân viên đang làm, nghỉ phép thì cho sửa
    if update_data['TrangThaiNV'] == 'Nghỉ việc':
        if nv.ChucVu == 'Tài xế':
            active_trip = db.query(ChuyenXe).filter(
                ChuyenXe.MaTaiXe == nv.MaNhanVien,
                ChuyenXe.TrangThaiCX.in_(['Sắp chạy', 'Đang chạy'])
            ).first()

            if active_trip:
                raise HTTPException(
                    status_code=400,
                    detail='Tài xế đang có chuyến xe, không thể nghỉ việc'
                )
            
            tx = db.query(TaiXe).filter(TaiXe.MaTaiXe == nv.MaNhanVien).first()
            if tx:
                tx.TrangThaiTX = 'Ngưng hoạt động'

        nv.TrangThaiNV = 'Nghỉ việc'
        tk.TrangThaiTK = 0
        
        db.commit()
        db.refresh(nv)
        return nv
            
    # Update field cơ bản
    for key, value in update_data.items():
        if key != 'TrangThaiNV' and value is not None:
            setattr(nv, key, value)

    db.commit()
    db.refresh(nv)
    return nv

# Xoá nhân viên
def delete_nhanvien(db: Session, ma_nv: str):
    nv = db.query(NhanVien).filter(NhanVien.MaNhanVien == ma_nv).first()

    if not nv:
        raise HTTPException(
            status_code=404,
            detail='Nhân viên không tồn tại'
        )

    tk = db.query(TaiKhoan).filter(TaiKhoan.MaNhanVien == nv.MaNhanVien).first()
    
    if nv.TrangThaiNV == 'Nghỉ việc':
        raise HTTPException(
            status_code=400,
            detail='Nhân viên đã nghỉ việc'
        )
    
    # Kiểm tra tài xế có chuyến
    if nv.ChucVu == 'Tài xế':
        active_trip = db.query(ChuyenXe).filter(
            ChuyenXe.MaTaiXe == nv.MaNhanVien,
            ChuyenXe.TrangThaiCX.in_(['Sắp chạy', 'Đang chạy'])
        ).first()

        if active_trip:
            raise HTTPException(
                status_code=400,
                detail='Tài xế đang có chuyến xe, không thể nghỉ việc'
            )
        
        tx = db.query(TaiXe).filter(TaiXe.MaTaiXe == nv.MaNhanVien).first()
        if tx:
            tx.TrangThaiTX = 'Ngưng hoạt động'
    
    nv.TrangThaiNV = 'Nghỉ việc'
    tk.TrangThaiTK = 0
        
    db.commit()
    db.refresh(nv)
    return nv