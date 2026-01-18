#api loader
# backend/config.py
import os
from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()

class Config:
    # Replace these with your actual keys or set them in your environment/OS
    BACKBOARD_API_KEY = os.getenv("BACKBOARD_API_KEY", "sk-backboard-placeholder")
    TWELVELABS_API_KEY = os.getenv("TWELVELABS_API_KEY", "tl-placeholder")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "sk-ant-placeholder")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIza-placeholder")
    
    # Twelve Labs Index ID (You get this from their dashboard)
    TWELVELABS_INDEX_ID = os.getenv("TWELVELABS_INDEX_ID", "index-placeholder")