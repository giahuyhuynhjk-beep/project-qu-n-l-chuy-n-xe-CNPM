from pydantic_settings import BaseSettings,SettingsConfigDict
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Cấu hình để kết nối DB
possible_env_paths = [
    os.path.join(os.getcwd(), ".env"),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../..", ".env")),
    ".env"
]
ENV_PATH = next((p for p in possible_env_paths if os.path.exists(p)), ".env")

class Settings(BaseSettings):
    DATABASE_URL: str

    model_config = SettingsConfigDict(
        env_file=ENV_PATH, # Chỉ định đường dẫn linh hoạt
        env_file_encoding="utf-8"
    )

settings = Settings()

# Tạo kết nối với DB
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args={"connect_timeout": 15}
)

# Kiểm tra kết nối
try:
    with engine.connect() as conn:
        print("[DB] Ket noi DB thanh cong!")
except Exception as e:
    print(f"[DB] Loi ket noi DB: {str(e).encode('ascii', 'ignore').decode('ascii')}")

# Tạo phiên làm việc với DB
SessionLocal = sessionmaker(
    bind=engine, # session này dùng engine nào để connect DB
    autoflush=False, # không được đẩy dữ liệu xuống DB khi query 
    autocommit=False # không tự lưu DB
)

# Tạo base để định nghĩa bảng bằng python giúp sqlalchemy nhìn vào class biết đó là bảng
Base = declarative_base()

# Tạo hàm tự động mở và đóng kết nối DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

