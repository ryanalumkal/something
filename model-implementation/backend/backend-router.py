# backend/router.py
from backboard import BackboardClient
from anthropic import Anthropic
from backend.config import Config

class RouterService:
    def __init__(self):
        # Backboard for Memory/State
        self.bb_client = BackboardClient(api_key=Config.BACKBOARD_API_KEY)
        # Anthropic for Complex Reasoning
        self.claude = Anthropic(api_key=Config.ANTHROPIC_API_KEY)

    def get_music_recommendation(self, visual_vibe, user_identity_context):
        """
        Uses Claude to pick a song based on the Vibe (Gemini) + Identity (Twelve Labs).
        """
        prompt = (
            f"Context: The user is reading a comic. \n"
            f"Visual Vibe: {visual_vibe}. \n"
            f"User Identity/History: {user_identity_context}. \n"
            f"Task: Recommend a music genre and tempo. Output ONLY the genre and tempo."
        )

        response = self.claude.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=100,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text

    def update_identity_memory(self, insight):
        """
        Stores a new fact about the user in Backboard.
        """
        # Assuming we have a persistent assistant or memory store
        # This implementation depends on Backboard's specific SDK methods for memory
        try:
            # Example: finding an existing assistant or creating one
            assistants = self.bb_client.list_assistants()
            if not assistants:
                 assistant = self.bb_client.create_assistant(name="IdentityBot", memory="Auto")
            else:
                assistant = assistants[0]

            # Add the insight to memory
            self.bb_client.add_message(
                assistant_id=assistant.id,
                content=f"MEMORY UPDATE: {insight}"
            )
            return True
        except Exception as e:
            print(f"Backboard Memory Error: {e}")
            return False