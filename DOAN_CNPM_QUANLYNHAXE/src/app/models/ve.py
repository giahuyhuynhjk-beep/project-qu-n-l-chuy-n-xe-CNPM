from sqlalchemy import Column, String, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from config.db.config import Base 

class Ve(Base):
    __tablename__ = "Ve"
    MaVe = Column(String(20), primary_key=True)
    MaChuyen = Column(String(20), ForeignKey('ChuyenXe.MaChuyen'), nullable=False)
    SoGhe = Column(String(10), nullable=False)
    TenKhachHang = Column(String(100), nullable=False)
    SoDienThoai = Column(String(10), nullable=False)
    GiaVe = Column(DECIMAL(10,2), nullable=False)
    TrangThaiV = Column(String(50), nullable=False)