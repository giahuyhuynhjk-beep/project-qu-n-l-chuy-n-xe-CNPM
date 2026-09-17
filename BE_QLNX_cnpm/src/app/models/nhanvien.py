from config.db.config import Base
from sqlalchemy import Column, String
from sqlalchemy.dialects.mysql import DECIMAL, BIT

# Định nghĩa model trong sqlalchemy để lưu trữ dữ liệu
class NhanVien(Base):
    __tablename__ = 'NhanVien'
    MaNhanVien = Column(String(50), primary_key=True)
    Ten = Column(String(100), nullable=False)
    GioiTinh = Column(BIT, nullable=False)
    Email = Column(String(100), unique=True)
    ChucVu = Column(String(50), nullable=False)
    Luong = Column(DECIMAL(10,2))
    HeSoLuong = Column(DECIMAL(10,2))
    TrangThaiNV = Column(String(50), default='Đang làm', nullable=False)