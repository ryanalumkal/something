import asyncio
from backboard import BackboardClient
from backend.config import Config

# Initialize Client
client = BackboardClient(api_key=Config.BACKBOARD_API_KEY)

async def create():
    print("Creating Comic Companion Assistant...")
    
    # Create the assistant
    assistant = await client.create_assistant(
        name="Comic Companion",
        description="A smart assistant that recommends music based on comic visual vibes.",
        instructions="You are an expert on comic books, music theory, and narrative pacing. Recommendation music genres based on visual descriptions.",
        model="gpt-4o" 
    )

    print("\nSUCCESS! Here is your Assistant ID:")
    print("-" * 30)
    print(f"BACKBOARD_ASSISTANT_ID={assistant.id}")
    print("-" * 30)
    print("Copy the line above and paste it into your .env file.")

if __name__ == "__main__":
    asyncio.run(create())