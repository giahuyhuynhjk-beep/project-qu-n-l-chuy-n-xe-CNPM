import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.db.config import engine, Base
from routers import nhanvien, taixe, taikhoan, xe, tuyenxe, chuyenxe, ve, auth
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


app = FastAPI()

# Enable CORS for Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import tất cả các model để SQLAlchemy tự động đăng ký tạo bảng
import models.quyen
import models.nhanvien
import models.taikhoan
import models.taixe
import models.xe
import models.tuyenxe
import models.chuyenxe
import models.ve

# Tạo các bảng cần thiết dựa trên model đã định nghĩa
try:
    Base.metadata.create_all(bind=engine)
    print("[DB] Tao va dong bo tat ca cac bang MySQL Local thanh cong!")
except Exception as e:
    print(f"[Warning] Khong the khoi tao bang DB luc khoi dong: {str(e).encode('ascii', 'ignore').decode('ascii')}")

app.include_router(nhanvien.router)
app.include_router(taixe.router)
app.include_router(taikhoan.router)
app.include_router(xe.router)
app.include_router(tuyenxe.router)
app.include_router(chuyenxe.router)
app.include_router(ve.router)
app.include_router(auth.router)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(req, exc):
    errors = []
    for err in exc.errors():
        field = err['loc'][-1]
        msg = err['msg']

        if msg.startswith('Value error'):
            msg = msg.replace('Value error, ', '')

        errors.append({
            'field': field,
            'message': msg
        })
    return JSONResponse(status_code=422, content={'errors': errors})




# Chạy được thì phải cd vào src vào app rồi chạy câu lệnh ở terminal uvicorn app:app
