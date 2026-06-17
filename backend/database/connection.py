from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SERVER = r"DESKTOP-JEFE3E0\SQLEXPRESS"
DATABASE = "Interviews"

CONNECTION_STRING = (
    f"mssql+pyodbc://@{SERVER}/{DATABASE}"
    "?driver=ODBC+Driver+18+for+SQL+Server"
    "&trusted_connection=yes"
    "&TrustServerCertificate=yes"
)

engine = create_engine(
    CONNECTION_STRING,
    echo=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
