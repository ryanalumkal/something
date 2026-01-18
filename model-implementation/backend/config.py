# backend/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # If .env is missing, this will return None (causing a clear error later)
    # instead of using a fake "placeholder" string that might confuse you.
    BACKBOARD_API_KEY = os.getenv("BACKBOARD_API_KEY")
    TWELVELABS_API_KEY = os.getenv("TWELVELABS_API_KEY")
    TWELVELABS_INDEX_ID = os.getenv("TWELVELABS_INDEX_ID")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")