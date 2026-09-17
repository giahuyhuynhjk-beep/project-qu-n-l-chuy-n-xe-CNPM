from pydantic import BaseModel, StrictStr, StrictInt, field_validator
from typing import Optional
from datetime import date

# Danh sách enum đã định nghĩa ở trên
taixe_status = ['Sẵn sàng', 'Đang lái', 'Ngưng hoạt động']
valid_licenses = ['D', 'D2', 'D1', 'C', 'B']

class TaiXeBase(BaseModel):
    HangBang: StrictStr
    NgayCap: date
    NgayHetHan: date
    KinhNghiemNam: Optional[StrictInt] = 0
    
    @field_validator('HangBang', mode='before')
    def validate_hangbang(cls, value, info):
        if not isinstance(value, str):
            raise ValueError('Hạng bằng không phải là chuỗi')
        value = value.strip()
        if not value:
            raise ValueError(f'Vui lòng nhập Hạng bằng')
        if value not in valid_licenses:
            raise ValueError(f'Hạng bằng lái phải thuộc: {", ".join(valid_licenses)}')
        return value
    
    @field_validator('NgayCap')
    def validate_ngaycap(cls, value, info):
        if value is None:
            raise ValueError('Vui lòng nhập Ngày cấp bằng')
        if value > date.today():
            raise ValueError('Ngày cấp bằng không hợp lệ')
        return value
    
    @field_validator('NgayHetHan')
    def validate_ngayhethan(cls, value, info):
        if value is None:
            raise ValueError('Vui lòng nhập Ngày hết hạn bằng')
        ngay_cap = info.data.get('NgayCap')
        if ngay_cap and value <= ngay_cap:
            raise ValueError('Ngày hết hạn bằng phải lớn hơn Ngày cấp bằng')
        return value
    
    @field_validator('KinhNghiemNam')
    def validate_kinhnghiemnam(cls, value, info):
        if value is None:
            return value
        if not isinstance(value, int) or value < 0:
            raise ValueError('Kinh nghiệm năm không hợp lệ')
        return value

class TaiXeCreate(TaiXeBase):
    SoBangLai: StrictStr
    
    @field_validator('SoBangLai', mode='before')
    def validate_sobanglai(cls, value, info):
        if not isinstance(value, str):
            raise ValueError('Số bằng lái không phải là chuỗi')
        value = value.strip()
        if not value:
            raise ValueError(f'Vui lòng nhập Số bằng lái')
        if not value.isdigit():
            raise ValueError('Số bằng lái chỉ được chứa số, không chứa dấu cách hay ký tự đặc biệt')
        return value

class TaiXeUpdate(TaiXeBase):
    HangBang: Optional[StrictStr] = None
    NgayCap: Optional[date] = None
    NgayHetHan: Optional[date] = None
    KinhNghiemNam: Optional[int] = None
    TrangThaiTX: Optional[StrictStr] = None

    @field_validator('TrangThaiTX', mode='before')
    def validate_trangthaitx(cls, value, info):
        if not isinstance(value, str):
            raise ValueError('Trạng thái tài xế không phải là chuỗi')
        value = value.strip()
        if not value:
            raise ValueError(f'Vui lòng nhập Trạng thái tài xế')
        if value not in taixe_status:
            raise ValueError(f'Trạng thái Tài xế phải thuộc: {", ".join(taixe_status)}')
        return value

class TaiXeList(BaseModel):
    MaTaiXe: str
    Ten: str
    TrangThaiTX: str

    class Config:
        from_attributes = True

class TaiXeDetail(TaiXeList):
    SoBangLai: str
    HangBang: str
    NgayCap: date
    NgayHetHan: date
    KinhNghiemNam: Optional[int] = 0

    class Config:
        from_attributes = True  # Pydantic V2 (thay cho orm_mode = True)