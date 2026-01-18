# setup_assistant.py
print("!!! SCRIPT STARTED !!!")

import os
import asyncio
from dotenv import load_dotenv
from backboard import BackboardClient

# 1. Load Environment Variables
load_dotenv()
print("Loading .env file...")

api_key = os.getenv("BACKBOARD_API_KEY")

if not api_key:
    print("❌ ERROR: BACKBOARD_API_KEY is missing from .env file.")
    print("Please check that your .env file is in the 'model-implementation' folder.")
    exit(1)
else:
    print(f"✅ API Key found (starts with: {api_key[:4]}...)")

# 2. Initialize Client
print("Initializing Backboard Client...")
client = BackboardClient(api_key=api_key)

# 3. Create Assistant (Async Wrapper)
async def create_the_assistant():
    print("Sending request to Backboard...")
    try:
        assistant = await client.create_assistant(
            name="Comic Companion",
            description="An AI that recommends music based on comic book visuals and pacing."
        )
        print("\n" + "="*40)
        print("SUCCESS! COPY THIS ID:")
        print(f"BACKBOARD_ASSISTANT_ID={assistant.assistant_id}")
        print("="*40 + "\n")
    except Exception as e:
        print(f"❌ API Error: {e}")

# 4. Run it
print("Starting Async Loop...")
asyncio.run(create_the_assistant())
print("!!! SCRIPT FINISHED !!!")