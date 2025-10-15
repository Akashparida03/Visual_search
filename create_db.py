from backend.database import engine, Base
from backend.models import Product  # Use absolute import from the 'backend' package

def create_database_tables():
    """
    Connects to the database and creates all tables defined in the models.
    This is safe to run multiple times; it will not recreate existing tables.
    """
    print("Attempting to create database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables checked/created successfully.")
    except Exception as e:
        print(f"❌ An error occurred: {e}")

if __name__ == "__main__":
    create_database_tables()

