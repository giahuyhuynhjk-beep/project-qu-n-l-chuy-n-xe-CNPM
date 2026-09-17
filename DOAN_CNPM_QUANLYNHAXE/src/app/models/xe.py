from config.db.config import Base
from sqlalchemy import Column, String, Integer

class Xe(Base):
    __tablename__ = 'Xe'
    BienSo = Column(String(20), primary_key=True)
    LoaiXe = Column(String(50), nullable=False)
    SoCho = Column(Integer, nullable=False)
    HangXe = Column(String(50))
    TrangThaiX = Column(String(50), nullable=False, default='Sẵn sàng')