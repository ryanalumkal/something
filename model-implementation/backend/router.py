# backend/router.py
from backboard import BackboardClient
from backend.config import Config

class RouterService:
    def __init__(self):
        self.bb_client = BackboardClient(api_key=Config.BACKBOARD_API_KEY)
        self.assistant_id = Config.BACKBOARD_ASSISTANT_ID

    def get_music_recommendation(self, visual_vibe, user_identity_context):
        """
        Uses Backboard to route the prompt to Claude (or whatever model you chose in the dashboard).
        This uses your $10 credits, not a credit card.
        """
        prompt = (
            f"Context: The user is reading a comic. \n"
            f"Visual Vibe: {visual_vibe}. \n"
            f"User Identity/History: {user_identity_context}. \n"
            f"Task: Recommend a music genre and tempo. Output ONLY the genre and tempo."
        )

        try:
            # Send message to the specific Assistant (Claude 3.5 Sonnet)
            response = self.bb_client.add_message(
                assistant_id=self.assistant_id,
                content=prompt
            )
            # Return the text response
            return response.content
        except Exception as e:
            print(f"Backboard Router Error: {e}")
            return "Synthwave, Medium Tempo" # Fallback if API fails
            
    def update_identity_memory(self, insight):
        """
        Stores a new fact about the user in Backboard's long-term memory.
        """
        try:
            self.bb_client.add_message(
                assistant_id=self.assistant_id,
                content=f"MEMORY UPDATE: {insight}"
            )
            return True
        except Exception as e:
            print(f"Memory Update Error: {e}")
            return False