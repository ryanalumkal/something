# backend/fast_track.py
import google.generativeai as genai
from backend.config import Config
import base64

class FastTrackService:
    def __init__(self):
        genai.configure(api_key=Config.GOOGLE_API_KEY)
        # Using Flash for speed
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def analyze_vibe(self, image_path_or_data):
        """
        Takes an image and returns a 3-word emotional vibe.
        """
        try:
            # Assuming image_path_or_data is raw bytes or a path. 
            # If it's a file path:
            if isinstance(image_path_or_data, str):
                with open(image_path_or_data, "rb") as f:
                    image_data = f.read()
            else:
                image_data = image_path_or_data

            response = self.model.generate_content([
                "Return exactly 3 adjectives describing the mood of this comic panel (e.g., 'Dark, Heroic, Tense'). Do not write full sentences.",
                {'mime_type': 'image/jpeg', 'data': image_data}
            ])
            
            return response.text.strip()
        except Exception as e:
            print(f"Error in Fast Track (Gemini): {e}")
            return "Neutral, Calm, Quiet" # Fallback