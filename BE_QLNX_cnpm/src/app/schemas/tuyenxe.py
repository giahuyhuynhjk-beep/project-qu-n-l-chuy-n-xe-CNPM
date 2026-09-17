from pydantic import BaseModel, StrictStr, StrictInt, StrictFloat, StrictBool, field_validator
from typing import Optional
import re

# kiểm tra thêm địa điểm đi và đến chỉ được phép nhập chữ
class TuyenXeBase(BaseModel):
    DiemDi: StrictStr
    DiemDen: StrictStr
    KhoangCachKm: StrictInt
    ThoiGianDuKien: StrictInt
    GiaCoBan: StrictFloat # Dùng float cho Decimal(10,2)

    @field_validator('DiemDi', 'DiemDen', mode='before')
    def validate_not_empty(cls, value, info):
        if not value:
            raise ValueError(f'Vui lòng nhập {info.field_name}')
        if not isinstance(value, str):
            raise ValueError(f'{info.field_name} không phải là chuỗi')
        value = value.strip()
        if not re.match(r'^[A-Za-zÀ-ỹ0-9\s\.]+$', value):
            raise ValueError('Điểm đi/Điểm đến không được chứa ký tự đặc biệt')
        return value

    @field_validator('KhoangCachKm')
    def validate_khoang_cach(cls, value):
        if not value:
            raise ValueError('Vui lòng nhập khoảng cách')
        if not isinstance(value, int):
            raise ValueError('Khoảng cách phải là số, không được nhập chữ')
        if value <= 0:
            raise ValueError('Khoảng cách không được âm')
        return value

    @field_validator('ThoiGianDuKien')
    def validate_thoi_gian(cls, value):
        if not value:
            raise ValueError('Vui lòng nhập Thời gian dự kiến')
        if not isinstance(value, (int)):
            raise ValueError('Thời gian dự kiến phải là số, không được nhập chữ')
        if value <= 0:
            raise ValueError('Thời gian dự kiến không được âm')
        return value

    @field_validator('GiaCoBan')
    def validate_gia_ve(cls, value):
        if not value:
            raise ValueError('Vui lòng nhập Giá cơ bản')
        if not isinstance(value, (int, float)):
            raise ValueError('Giá cơ bản phải là số, không được nhập chữ')
        if value <= 0:
            raise ValueError('Giá cơ bản không được âm')
        return value
    
class TuyenXeUpdate(TuyenXeBase):
    DiemDi: Optional[StrictStr] = None
    DiemDen: Optional[StrictStr] = None
    KhoangCachKm: Optional[StrictInt] = None
    ThoiGianDuKien: Optional[StrictInt] = None
    GiaCoBan: Optional[StrictFloat] = None
    TrangThaiT: Optional[StrictBool] = None

    @field_validator('TrangThaiT')
    def validate_bool(cls, value):
        # Danh sách các giá trị mình chấp nhận là "Đúng"
        truthy = [1, True, '1', 'true', 'True']
        # Danh sách các giá trị mình chấp nhận là "Sai"
        falsy = [0, False, '0', 'false', 'False']
        if not value:
            raise ValueError('Vui lòng nhập Trạng thái Tuyến')
        if value in truthy:
            return True
        if value in falsy:
            return False
        raise ValueError('Trạng thái tuyến không hợp lệ')

class TuyenXeList(BaseModel):
    MaTuyen: str
    DiemDi: str
    DiemDen: str
    TrangThaiT: bool

    class Config:
        from_attributes = True

class TuyenXeDetail(TuyenXeList):
    KhoangCachKm: int
    GiaCoBan: float
    ThoiGianDuKien: int
    class Config:
        from_attributes = True