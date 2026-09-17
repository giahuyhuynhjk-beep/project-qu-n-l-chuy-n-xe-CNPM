from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from core.security import decode_access_token
from config.db.config import get_db
from models.taikhoan import TaiKhoan

security = HTTPBearer()

def get_current_user(token=Depends(security), db: Session=Depends(get_db)):
    try:
        payload = decode_access_token(token.credentials)
        username = payload['sub']

        # Xác nhận user vẫn tồn tại và token còn hợp lệ
        user = db.query(TaiKhoan).filter(TaiKhoan.TenTaiKhoan == username).first()
        
        if not user:
            raise HTTPException(
                status_code=401,
                detail='Tài khoản không tồn tại'
            )
        return user
    
    except:
        raise HTTPException(
            status_code=401,
            detail='Token không hợp lệ'
        )

def require_role(*roles):
    def checker(user=Depends(get_current_user)):
        if user.MaQuyen not in roles:
            raise HTTPException(
                status_code=401,
                detail='Không có quyền truy cập'
            )
        return user
    
    return checker