from config.db.config import Base
from sqlalchemy import Column, String

class Quyen(Base):
    __tablename__ = 'Quyen'
    MaQuyen = Column(String(20), primary_key=True)
    TenQuyen = Column(String(50), unique=True, nullable=False)