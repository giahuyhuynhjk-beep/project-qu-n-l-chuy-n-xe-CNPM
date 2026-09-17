from pydantic import BaseModel, StrictStr, StrictFloat, field_validator
from typing import Optional
from datetime import datetime, timezone
import re
# Danh mục trạng thái chuyến xe
chuyenxe_status = ['Sắp chạy', 'Đang chạy', 'Hoàn thành', 'Huỷ']

class ChuyenXeBase(BaseModel):
    MaTuyen: StrictStr
    MaTaiXe: StrictStr
    MaXe: StrictStr
    ThoiGianKhoiHanh: datetime
    ThoiGianDuKienDen: datetime
    
    @field_validator('MaTuyen', 'MaTaiXe', mode='before')
    def validate_not_empty(cls, value, info):
        if not value:
            raise ValueError(f'Vui lòng nhập {info.field_name}')
        if not isinstance(value, str):
            raise ValueError(f'{info.field_name} không phải là chuỗi')
        value = value.strip()
        if not re.match(r'^[A-Za-z0-9À-ỹ]+(?: [A-Za-z0-9À-ỹ]+)*$', value):
            raise ValueError('Mã chỉ được chứa chữ cái và số, không chứa ký tự đặc biệt')
        return value
    
    @field_validator('MaXe', mode='before')
    def validate_bienso(cls, value):
        if value is None or not value:
            raise ValueError('Vui lòng nhập Mã xe')
        if not isinstance(value, str):
            raise ValueError('Mã xe phải là chuỗi')
        value = value.strip().upper() # Tự động viết hoa biển số
        return value

    @field_validator('ThoiGianKhoiHanh')
    def validate_ngaycap(cls, value, info):
        if value is None:
            raise ValueError('Vui lòng nhập Thời gian khởi hành')
        if value < datetime.now(timezone.utc):
            raise ValueError('Ngày khởi hành không hợp lệ')
        return value
    
    @field_validator('ThoiGianDuKienDen')
    def validate_thoi_gian(cls, value, info):
        if not value:
            raise ValueError('Vui lòng nhập Thời gian dự kiến đến')
        khoi_hanh = info.data.get('ThoiGianKhoiHanh')
        if khoi_hanh and value <= khoi_hanh:
            raise ValueError('Thời gian dự kiến đến phải sau Thời gian khởi hành')
        return value

class ChuyenXeUpdate(ChuyenXeBase):
    MaTaiXe: Optional[StrictStr] = None
    MaXe: Optional[StrictStr] = None
    ThoiGianKhoiHanh: Optional[datetime] = None
    ThoiGianDuKienDen: Optional[datetime] = None
    GiaVe: Optional[float] = None
    TrangThaiCX: Optional[StrictStr] = None

    @field_validator('TrangThaiCX', mode='before')
    def validate_trangthai_cx(cls, value):
        if cls.__name__=="ChuyenXeUpdate":
            if value is None: # thêm ở đây là mục đích cho hàm sửa
                return value
        if not value:
            raise ValueError('Vui lòng chọn trạng thái xe')
        if not isinstance(value, str):
            raise ValueError('Trạng thái chuyến xe không phải là chuỗi')
        value = value.strip()
        if value not in chuyenxe_status:
            raise ValueError(f'Trạng thái chuyến xe phải thuộc: {", ".join(chuyenxe_status)}')
        return value

class ChuyenXeList(BaseModel):
    MaChuyen: str
    MaTuyen: str
    ThoiGianKhoiHanh: datetime
    GiaVe: float
    TrangThaiCX: str

    class Config:
        from_attributes = True

class ChuyenXeDetail(ChuyenXeList):
    MaTaiXe: str
    MaXe: str
    ThoiGianDuKienDen: datetime

    class Config:
        from_attributes = True