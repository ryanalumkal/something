import os
from twelvelabs import TwelveLabs
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("TWELVELABS_API_KEY")

if not API_KEY:
    print("Error: TWELVELABS_API_KEY not found in .env file.")
    exit(1)

client = TwelveLabs(api_key=API_KEY)

print("Creating Index...")

try:
    # FINAL FIX: Simplified options for Marengo 2.7 and Pegasus 1.2
    # "visual" now includes OCR/Text-in-video
    # "audio" now includes conversation/speech
    new_index = client.index.create(
        name="Hackathon_Comics_Memory",
        models=[
            {
                "name": "marengo2.7",
                "options": ["visual", "audio"]
            },
            {
                "name": "pegasus1.2",
                "options": ["visual", "audio"]
            }
        ]
    )
    
    print("\nSUCCESS! Here is your Index ID:")
    print("-" * 30)
    print(f"TWELVELABS_INDEX_ID={new_index.id}")
    print("-" * 30)
    print("Copy the line above and paste it into your .env file.")

except Exception as e:
    print(f"\nError creating index: {e}")