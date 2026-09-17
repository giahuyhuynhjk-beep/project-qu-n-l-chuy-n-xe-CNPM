from pydantic import BaseModel, StrictStr, StrictInt, field_validator
from typing import Optional

# Danh mục trạng thái xe
xe_status = ['Sẵn sàng', 'Đang chạy', 'Bảo trì', 'Ngưng hoạt động']

class XeBase(BaseModel):
    LoaiXe: Optional[StrictStr] = None
    SoCho: StrictInt
    HangXe: Optional[StrictStr] = None

    @field_validator('SoCho')
    def validate_socho(cls, value):
        if not value:
            raise ValueError('Vui lòng nhập Số chỗ')
        if not isinstance(value, int):
            raise ValueError('Số chỗ phải là một con số, không được nhập chữ')                    
        if value <= 0:
            raise ValueError('Số chỗ phải lớn hơn 0')
        return value
    
    @field_validator('LoaiXe', 'HangXe', mode='before')
    def validate_loaixe_hangxe(cls, value, info):
        if value is None:
            return value
        if not isinstance(value, str):
            raise ValueError('Loại xe/ Hãng xe không hợp lệ')
        return value
    
class XeCreate(XeBase):
    BienSo: StrictStr

    @field_validator('BienSo', mode='before')
    def validate_bienso(cls, value):
        if value is None or not value:
            raise ValueError('Vui lòng nhập Biển số')
        if not isinstance(value, str):
            raise ValueError('Biển số phải là chuỗi')
        value = value.strip().upper() # Tự động viết hoa biển số
        return value

class XeUpdate(XeBase):
    LoaiXe: Optional[StrictStr] = None
    SoCho: Optional[StrictInt] = None
    HangXe: Optional[StrictStr] = None
    TrangThaiX: Optional[StrictStr] = None

    @field_validator('TrangThaiX', mode='before')
    def validate_trangthaix(cls, value):
        if value is None:
            return value
        if not isinstance(value, str):
            raise ValueError('Trạng thái Xe không phải là chuỗi')
        value = value.strip()
        if value not in xe_status:
            raise ValueError(f'Trạng thái Xe phải thuộc: {", ".join(xe_status)}')
        return value

class XeList(BaseModel):
    BienSo: str
    SoCho: int
    TrangThaiX: str

    class Config:
        from_attributes = True

class XeDetail(XeList):
    LoaiXe: Optional[str] = None
    HangXe: Optional[str] = None

    class Config:
        from_attributes = True