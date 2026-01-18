import os
from twelvelabs import TwelveLabs
from dotenv import load_dotenv

# Load your API Key from the .env file
load_dotenv()
API_KEY = os.getenv("TWELVELABS_API_KEY")

if not API_KEY:
    print("Error: TWELVELABS_API_KEY not found in .env file.")
    exit(1)

# Initialize Client
client = TwelveLabs(api_key=API_KEY)

print("Creating Index... (This may take a few seconds)")

try:
    # We enable BOTH models so this single index can do everything:
    # 1. Marengo (Visual/Audio Search) -> For finding specific panels
    # 2. Pegasus (Generative Text) -> For summarizing the story arc
    new_index = client.index.create(
        index_name="Hackathon_Comics_Memory",
        models=[
            {
                "model_name": "marengo2.6", 
                "model_options": ["visual", "conversation", "text_in_video"]
            },
            {
                "model_name": "pegasus1.1", 
                "model_options": ["visual", "conversation"]
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