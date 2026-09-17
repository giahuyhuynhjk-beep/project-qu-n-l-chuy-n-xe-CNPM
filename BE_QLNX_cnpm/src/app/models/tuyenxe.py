from config.db.config import Base
from sqlalchemy import Column, String, Integer
from sqlalchemy.dialects.mysql import DECIMAL, BIT

class TuyenXe(Base):
    __tablename__ = 'TuyenXe'
    MaTuyen = Column(String(20), primary_key=True)
    DiemDi = Column(String(100), nullable=False)
    DiemDen = Column(String(100), nullable=False)
    KhoangCachKm = Column(Integer, nullable=False)
    ThoiGianDuKien = Column(Integer, nullable=False)
    GiaCoBan = Column(DECIMAL(10,2), nullable=False)
    TrangThaiT = Column(BIT, default=1, nullable=False)