from config.db.config import Base
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.mysql import BIT
from sqlalchemy.orm import relationship

class TaiKhoan(Base):
    __tablename__ = 'TaiKhoan'
    TenTaiKhoan = Column(String(50), primary_key=True)
    MatKhau = Column(String(255), nullable=False)
    MaQuyen = Column(String(20), ForeignKey('Quyen.MaQuyen'), nullable=False)
    MaNhanVien = Column(String(20), ForeignKey('NhanVien.MaNhanVien'), unique=True, nullable=False)
    TrangThaiTK = Column(BIT, default=1)
    quyen = relationship('Quyen')
    nhan_vien = relationship('NhanVien')
    