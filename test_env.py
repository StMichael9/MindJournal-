from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env")
print("DATABASE_URL =", os.getenv("DATABASE_URL"))
