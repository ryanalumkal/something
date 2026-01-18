# backend/config.py
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # 1. Backboard (Manages your $10 credits & memory)
    BACKBOARD_API_KEY = os.getenv("BACKBOARD_API_KEY")
    
    # 2. Twelve Labs (Pegasus & Marengo)
    TWELVELABS_API_KEY = os.getenv("TWELVELABS_API_KEY")
    TWELVELABS_INDEX_ID = os.getenv("TWELVELABS_INDEX_ID")
    
    # 3. Google (Free Vision Model)
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    
    # 4. Assistant ID (You get this from Backboard Dashboard)
    BACKBOARD_ASSISTANT_ID = os.getenv("BACKBOARD_ASSISTANT_ID")