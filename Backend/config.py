from dotenv import load_dotenv
import os

# Load .env
load_dotenv()

DB_CONFIG = {
    'host': os.getenv("DB_HOST"),
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASSWORD"),
    'database': os.getenv("DB_NAME")
}

SECRET_KEY = os.getenv("SECRET_KEY")
