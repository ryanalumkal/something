# backend/router.py
from backboard import BackboardClient
from backend.config import Config

class RouterService:
    def __init__(self):
        self.bb_client = BackboardClient(api_key=Config.BACKBOARD_API_KEY)
        
        # We assume you created an assistant in the Backboard Dashboard
        # named "Hackathon_DJ" that uses Claude 3.5 Sonnet.
        # This is easier than creating it in code every time.
        self.assistant_id = "asst_..." # Replace with ID from Dashboard

    def get_music_recommendation(self, visual_vibe, user_identity_context):
        """
        Uses Backboard (and your $10 credits) to ask Claude for advice.
        """
        prompt = (
            f"Context: User is reading a comic. \n"
            f"Visuals: {visual_vibe}. \n"
            f"User History: {user_identity_context}. \n"
            f"Task: Pick a specific song genre and tempo."
        )

        # This call costs ~$0.01 of your $10 credits
        response = self.bb_client.add_message(
            assistant_id=self.assistant_id,
            content=prompt
        )
        
        return response.content