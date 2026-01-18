# backend/router.py
import asyncio
from backboard import BackboardClient
from backend.config import Config

class RouterService:
    def __init__(self):
        # Initialize the client with your API key [cite: 14]
        self.client = BackboardClient(api_key=Config.BACKBOARD_API_KEY)
        self.assistant_id = Config.BACKBOARD_ASSISTANT_ID

    def get_music_recommendation(self, visual_vibe, user_identity_context):
        """
        Routes the prompt to Claude/Backboard to get a music recommendation.
        Uses asyncio.run() to bridge the sync Flask app with the async SDK.
        """
        prompt = (
            f"Context: The user is reading a comic. \n"
            f"Visual Vibe: {visual_vibe}. \n"
            f"User Identity/History: {user_identity_context}. \n"
            f"Task: Recommend a music genre and tempo. Output ONLY the genre and tempo."
        )

        # Define the async workflow required by the SDK 
        async def run_request():
            try:
                # 1. Create a temporary thread for this interaction 
                # We need a thread to send a message.
                thread = await self.client.create_thread(assistant_id=self.assistant_id)
                
                # 2. Send the message and await the response [cite: 25]
                response = await self.client.add_message(
                    thread_id=thread.thread_id,
                    content=prompt,
                    stream=False # Non-streaming as requested 
                )
                
                # 3. Return the content [cite: 35]
                return response.content
                
            except Exception as e:
                print(f"Backboard API Error: {e}")
                return "Lo-Fi Beats, Medium Tempo" # Fallback

        # Execute the async function synchronously
        return asyncio.run(run_request())

    def update_identity_memory(self, insight):
        """
        Updates the assistant's long-term memory.
        """
        async def run_memory_update():
            try:
                # To save memory, we enable memory="Auto" [cite: 181]
                thread = await self.client.create_thread(assistant_id=self.assistant_id)
                
                await self.client.add_message(
                    thread_id=thread.thread_id,
                    content=f"MEMORY UPDATE: {insight}",
                    memory="Auto", # This tells Backboard to save this fact [cite: 181]
                    stream=False
                )
                return True
            except Exception as e:
                print(f"Memory Update Error: {e}")
                return False

        return asyncio.run(run_memory_update())