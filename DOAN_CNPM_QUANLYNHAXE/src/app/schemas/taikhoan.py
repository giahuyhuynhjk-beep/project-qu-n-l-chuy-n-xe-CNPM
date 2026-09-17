from pydantic import BaseModel, StrictStr, StrictBool, field_validator
from typing import Optional

ma_quyen = ['Q001', 'Q002', 'Q003', 'Q004']
    
class TaiKhoanUpdateNhanVien(BaseModel):
    MatKhau: Optional[StrictStr] = None

    @field_validator('MatKhau')
    def validate_matkhau(cls, value):
        if len(value) < 6:
            raise ValueError('Mật khẩu phải có ít nhất 6 ký tự')
        return value

class TaiKhoanUpdateAdmin(TaiKhoanUpdateNhanVien):
    # Thường không update TenTaiKhoan và MaNhanVien vì là định danh/duy nhất
    MaQuyen: Optional[StrictStr] = None
    TrangThaiTK: Optional[StrictBool] = None
    
    @field_validator('MaQuyen', mode='before')
    def validate_not_empty(cls, value, info):
        if not isinstance(value, str):
            raise ValueError('Mã quyền không phải là chuỗi')
        value = value.strip()
        if not value or value is None:
            raise ValueError('Vui lòng nhập Mã quyền')
        if value not in ma_quyen:
            raise ValueError(f'Mã quyền phải thuộc {", ".join(ma_quyen)}')
        return value
    
    @field_validator('TrangThaiTK', mode='before')
    def validate_bool(cls, value):
        # Danh sách các giá trị mình chấp nhận là "Đúng"
        truthy = [1, True, '1', 'true', 'True']
        # Danh sách các giá trị mình chấp nhận là "Sai"
        falsy = [0, False, '0', 'false', 'False']
        if value in truthy:
            return True
        if value in falsy:
            return False
        raise ValueError('Trạng thái tài khoản không hợp lệ')

class TaiKhoanList(BaseModel):
    TenTaiKhoan: str
    MaNhanVien: str
    TrangThaiTK: bool

    class Config:
        from_attributes = True

class TaiKhoanDetail(TaiKhoanList):
    # Không bao giờ trả về mật khẩu ở model Detail
    # xử lý ở trong để ko lấy ra mật khẩu
    MatKhau: str # thêm vào để test
    TenQuyen: str

    class Config:
        from_attributes = True