from config.db.config import Base
from sqlalchemy import Column, String, Date, Integer, ForeignKey
from sqlalchemy.orm import relationship

class TaiXe(Base):
    __tablename__ = 'TaiXe'
    MaTaiXe = Column(String(20), ForeignKey('NhanVien.MaNhanVien'), primary_key=True)
    SoBangLai = Column(String(50), nullable=False)
    HangBang = Column(String(10), nullable=False)
    NgayCap = Column(Date, nullable=False)
    NgayHetHan = Column(Date, nullable=False)
    KinhNghiemNam = Column(Integer)
    TrangThaiTX = Column(String(50), nullable=False, default='Sẵn sàng')
    nhan_vien = relationship('NhanVien')