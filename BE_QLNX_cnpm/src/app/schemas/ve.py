from pydantic import BaseModel, StrictStr, field_validator
from typing import Optional
import re
# thay đổi mã ghế có list ghễ sẵn và xử lý nếu đặt thì xóa khỏi list
# Danh mục trạng thái vé
ve_status = ['Đã đặt', 'Đã thanh toán', 'Đã huỷ']

class VeBase(BaseModel):
    MaChuyen: StrictStr
    SoGhe: StrictStr
    TenKhachHang: StrictStr
    SoDienThoai: StrictStr
    MaVe: Optional[str] = None
    
    @field_validator("MaChuyen",mode='before')
    def validate_not_empty(cls, value, info):
        if not value:
            raise ValueError(f'Vui lòng nhập Mã chuyến')
        if not isinstance(value, str):
            raise ValueError(f'Mã Chuyến không phải là chuỗi')
        value = value.strip()
        if not re.match(r'^[A-Za-z0-9À-ỹ]+(?: [A-Za-z0-9À-ỹ]+)*$', value):
            raise ValueError('Mã chuyến không hợp lệ')
        return value
    
    @field_validator('TenKhachHang', mode='before')
    def validate_ten_khach(cls, value):
        if not value:
            raise ValueError('Vui lòng nhập Tên khách hàng')
        if not isinstance(value, str):
            raise ValueError('Tên khách hàng không phải là chuỗi')
        value = value.strip()
        if not re.match(r'^[A-Za-zÀ-ỹ]+(?: [A-Za-zÀ-ỹ]+)*$', value):
            raise ValueError('Tên khách hàng không hợp lệ')
        return value

    @field_validator('SoDienThoai', mode='before')
    def validate_sdt(cls, value):
        if not value:
            raise ValueError('Vui lòng nhập số điện thoại')
        if not isinstance(value, str):
            raise ValueError('Số điện thoại phải là dãy 10 số')
        value = value.strip()
        if not re.match(r'^0\d{9}$', value):
            raise ValueError('Số điện thoại không hợp lệ')
        return value

    @field_validator('SoGhe', mode='before')
    def validate_soghe(cls, value):
        if not value:
            raise ValueError('Vui lòng nhập Số ghế')
        if not isinstance(value, str):
            raise ValueError('Số ghế không phải là chuỗi')
        value = value.strip().upper()
        return value

class VeUpdate(VeBase):
    SoGhe: Optional[StrictStr] = None
    TenKhachHang: Optional[StrictStr] = None
    SoDienThoai: Optional[StrictStr] = None
    GiaVe: Optional[float] = None
    TrangThaiV: Optional[StrictStr] = None

    @field_validator('GiaVe')
    def validate_gia_ve(cls, value):
        if cls.__name__=="VeUpdate":
            if value is None: # thêm ở đây là mục đích cho hàm sửa
                return value
        if not isinstance(value, (int,float)):
            raise ValueError('Số ghế không phải là số')
        if value <= 0:
            raise ValueError('Giá vé phải lớn hơn 0')
        return value

    @field_validator('TrangThaiV', mode='before')
    def validate_trangthai_ve(cls, value):
        if cls.__name__=="VeUpdate":
            if value is None: # thêm ở đây là mục đích cho hàm sửa
                return value
        if not value:
            raise ValueError("vui lòng chọn trạng thái vé")
        if value not in ve_status:
            raise ValueError(f'Trạng thái vé phải thuộc: {", ".join(ve_status)}')
        return value

class VeList(BaseModel):
    MaVe: str
    TenKhachHang: str
    SoGhe: str
    TrangThaiV: str

    class Config:
        from_attributes = True

class VeDetail(VeList):
    MaChuyen: str
    SoDienThoai: str
    GiaVe: float

    class Config:
        from_attributes = True