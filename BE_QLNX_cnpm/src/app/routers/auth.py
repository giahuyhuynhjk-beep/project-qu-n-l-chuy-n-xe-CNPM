from fastapi import APIRouter, Depends, HTTPException, Form, Request
from sqlalchemy.orm import Session

from config.db.config import get_db
from models.taikhoan import TaiKhoan
from core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post('/login')
async def login(
    request: Request,
    username: str = Form(None),
    password: str = Form(None),
    db: Session = Depends(get_db)
):
    # Support form-data, query params, or json body
    if not username or not password:
        params = request.query_params
        if params.get("username") and params.get("password"):
            username = params.get("username")
            password = params.get("password")
        else:
            try:
                data = await request.json()
                username = data.get("username")
                password = data.get("password")
            except Exception:
                pass

    if not username or not password:
        raise HTTPException(
            status_code=400,
            detail="Vui lòng cung cấp username và password"
        )

    user = db.query(TaiKhoan).filter(TaiKhoan.TenTaiKhoan == username).first()

    if not user or user.MatKhau != password:
        raise HTTPException(
            status_code=401,
            detail='Tên đăng nhập hoặc Mật khẩu không chính xác'
        )
    
    token = create_access_token({
        'sub': user.TenTaiKhoan,
        'role': user.MaQuyen
    })

    return {
        'access_token': token,
        'token_type': 'bearer',
        'role': user.MaQuyen,
        'username': user.TenTaiKhoan
    }
