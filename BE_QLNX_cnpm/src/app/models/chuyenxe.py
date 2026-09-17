from config.db.config import Base
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.mysql import DECIMAL
from sqlalchemy.orm import relationship

class ChuyenXe(Base):
    __tablename__ = 'ChuyenXe'
    MaChuyen = Column(String(20), primary_key=True)
    MaTuyen = Column(String(20), ForeignKey('TuyenXe.MaTuyen'), nullable=False)
    MaTaiXe = Column(String(20), ForeignKey('TaiXe.MaTaiXe'), nullable=False)
    MaXe = Column(String(20), ForeignKey('Xe.BienSo'), nullable=False)
    ThoiGianKhoiHanh = Column(DateTime, nullable=False)
    ThoiGianDuKienDen = Column(DateTime, nullable=False)
    GiaVe = Column(DECIMAL(10,2), nullable=False)
    TrangThaiCX = Column(String(50), nullable=False, default='Sắp chạy')
    tuyen_xe = relationship('TuyenXe')
    tai_xe = relationship('TaiXe')
    xe = relationship('Xe')
