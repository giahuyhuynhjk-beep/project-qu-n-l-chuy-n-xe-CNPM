from pydantic import BaseModel, EmailStr, StrictStr, StrictBool, StrictFloat, field_validator, model_validator
from typing import Optional
import re
from schemas.taixe import TaiXeCreate

chucvu_list = ['Admin', 'Quản lý', 'Nhân viên bán vé', 'Tài xế']
# nhớ fontend khi hiện ra list đúng các tên như này cả hoa lẫn thường
nhanvien_status = ['Đang làm', 'Nghỉ phép', 'Nghỉ việc']

class NhanVienBase(BaseModel):
    # strictstr giúp quản lý kiểu dữ liệu nghiêm ngặt hơn, vì nếu chỉ set str thì khi pydantic validate vd 123 nó sẽ convert thành '123' và thấy đúng str thì nó vẫn chấp nhận
    Ten: StrictStr 
    GioiTinh: StrictBool
    Email: EmailStr
    Luong: Optional[StrictFloat] = None
    HeSoLuong: Optional[StrictFloat] = None

    @field_validator('Ten', mode='before') # mode='before' để ta validate trước, pydantic validate sau
    def validate_ten(cls, value, info):
        if not value:
            raise ValueError('Vui lòng nhập Tên')
        if not isinstance(value, str):
            raise ValueError('Tên không phải là chuỗi')
        value = value.strip()
        if not re.match(r'^[A-Za-zÀ-ỹ]+(?: [A-Za-zÀ-ỹ]+)*$', value):
            raise ValueError('Tên chỉ được chứa chữ cái, không chứa ký tự đặc biệt')
        return value

    @field_validator('GioiTinh', mode='before')
    def validate_bool(cls, value):
        # Danh sách các giá trị mình chấp nhận là "Đúng"
        truthy = [1, True, '1', 'true', 'True']
        # Danh sách các giá trị mình chấp nhận là "Sai"
        falsy = [0, False, '0', 'false', 'False']
        if value in truthy:
            return True
        if value in falsy:
            return False
        raise ValueError('Giới tính không hợp lệ')
        
    @field_validator('Email', mode='before')
    def validate_email(cls, value, info):
        if not value:
            raise ValueError('Vui lòng nhập Email') 
        if not isinstance(value, str):
            raise ValueError('Email không phải là chuỗi')
        if not re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$', value):
            raise ValueError('Email không đúng định dạng')
        return value
    
    @field_validator('Luong', 'HeSoLuong', mode='before')
    def validate_luong_hesoluong(cls, value, info):
        if not isinstance(value, (float, int)):
            raise ValueError('Lương/Hệ số lương không hợp lệ')
        if value < 0:
            raise ValueError('Lương/Hệ số lương không được âm')
        return value

# Validate dữ liệu đầu vào
class NhanVienCreate(NhanVienBase):
    ChucVu: StrictStr

    # Nếu là tài xế thì validate thêm các trường này
    taixe: Optional[TaiXeCreate] = None

    @field_validator('ChucVu', mode='before')
    def validate_chucvu(cls, value, info):
        if not value:
            raise ValueError(f'Vui lòng nhập Chức vụ')
        if not isinstance(value, str):
            raise ValueError('Chức vụ không phải là chuỗi')
        value = value.strip()
        if value not in chucvu_list:
            raise ValueError(f'Chức vụ phải thuộc: {", ".join(chucvu_list)}')
        return value

    @model_validator(mode='before')
    def validate_chuc(cls, data):
        if data.get('ChucVu') != 'Tài xế':
            data.pop('taixe', None) # xoá luôn trước để khỏi validate về mấy trường tài xế khi không phải tài xế
        return data
    
    @model_validator(mode='after') # validate sau khi bên TaiXeBase validate xong
    def validate_taixe(cls, data):
        if data.ChucVu == 'Tài xế' and data.taixe is None:
            raise ValueError('Vui lòng nhập thông tin chi tiết Tài xế')
        return data

class NhanVienUpdate(NhanVienBase):
    Ten: Optional[StrictStr] = None
    GioiTinh: Optional[StrictBool] = None
    Email: Optional[EmailStr] = None 
    Luong: Optional[StrictFloat] = None
    HeSoLuong: Optional[StrictFloat] = None
    TrangThaiNV: Optional[StrictStr] = None

    @field_validator('TrangThaiNV', mode='before')
    def validate_trangthai_cx(cls, value):
        if not value:
            raise ValueError('Vui lòng nhập Trạng thái Nhân Viên')
        if not isinstance(value, str):
            raise ValueError('Trạng thái Nhân viên không phải là chuỗi')
        value = value.strip()
        if value not in nhanvien_status:
            raise ValueError(f'Trạng thái Nhân Viên phải thuộc: {", ".join(nhanvien_status)}')
        return value

# Validate dữ liệu đầu ra
class NhanVienList(BaseModel):
    MaNhanVien: str
    Ten: str
    ChucVu: str
    TrangThaiNV: str

    class Config:
        orm_mode = True

class NhanVienDetail(NhanVienList):
    GioiTinh: Optional[bool] = None
    Email: EmailStr 
    Luong: Optional[float] = None
    HeSoLuong: Optional[float] = None

    class Config:
        orm_mode = True