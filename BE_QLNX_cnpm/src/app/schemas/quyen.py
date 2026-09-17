from pydantic import BaseModel, StrictStr, field_validator
from typing import Optional
import re

class QuyenBase(BaseModel):
    MaQuyen:StrictStr
    TenQuyen: StrictStr

class QuyenCreate(QuyenBase):
    @field_validator('MaQuyen')
    def validate_not_empty(cls, v: str):
        if not v:
            raise ValueError(f'Vui lòng nhập Mã Quyền')
        if not re.match(r'^[A-Za-z0-9À-ỹ]+(?: [A-Za-z0-9À-ỹ]+)*$', v):
            raise ValueError('Mã Quyền chỉ được chứa chữ cái và số, không chứa ký tự đặc biệt')
        return v
    
    @field_validator('TenQuyen')
    def validate_not_empty(cls, v: str):
        if cls.__name__=="QuyenUpdate":
            if v is None: # thêm ở đây là mục đích cho hàm sửa
                return v
        if not v:
            raise ValueError(f'Vui lòng nhập Tên Quyền')
        if not re.match(r'^[A-Za-zÀ-ỹ]+(?: [A-Za-zÀ-ỹ]+)*$', v):
            raise ValueError('Tên Quyền chỉ được chứa chữ cái, không chứa ký tự đặc biệt')
        return v

class QuyenUpdate(BaseModel):
    # Thường thì MaQuyen (Khóa chính) sẽ không cho phép update
    TenQuyen: Optional[StrictStr] = None
    @field_validator('TenQuyen')
    def validate_not_empty(cls, v: str):
        if cls.__name__=="QuyenUpdate":
            if v is None: # thêm ở đây là mục đích cho hàm sửa
                return v
        if not v:
            raise ValueError(f'Vui lòng nhập Tên Quyền')
        if not re.match(r'^[A-Za-zÀ-ỹ]+(?: [A-Za-zÀ-ỹ]+)*$', v):
            raise ValueError('Tên Quyền chỉ được chứa chữ cái, không chứa ký tự đặc biệt')
        return v

class QuyenList(QuyenBase):
    class Config:
        from_attributes = True

class QuyenDetail(QuyenBase):
    class Config:
        from_attributes = True