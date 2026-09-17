from jose import jwt # thư viện tạo & giải mã JSON Web Token
from datetime import datetime, timedelta

# Cấu hình
SECRET_KEY = "mysecretkey" # key bí mật để ký token (giống như dấu mộc server)
ALGORITHM = "HS256" # thuật toán mã hoá
ACCESS_TOKEN_EXPIRE_MINUTES = 15 #thời gian sống của token

# hàm tạo token
def create_access_token(data: dict):
    # copy data (tránh sửa dữ liệu gốc, dữ liệu ở đây là username)
    to_encode = data.copy()

    # tạo thời gian hết hạn
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # thêm thông tin hết hạn vào payload
    to_encode.update({"exp": expire})

    # tạo JWT (ký bằng secret key)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# hàm giải mã token
def decode_access_token(token: str):
    # giải mã token: tự kiểm tra chữ ký đúng không, kiểm tra hết hạn, trả về dữ liệu 
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

# Quy trình như sau:
# 1. User login
# 2. Server kiểm tra tài khoản
# 3. Tạo access token (JWT)
# 4. Trả token cho client
# 5. Client gọi API (kèm token)
# 6. Server decode token
# 7. Hợp lệ -> xử lý request
# 8. Hết hạn/sai -> chặn