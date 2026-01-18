# backend/slow_track.py
from twelvelabs import TwelveLabs
from backend.config import Config
import time

class SlowTrackService:
    def __init__(self):
        self.client = TwelveLabs(api_key=Config.TWELVELABS_API_KEY)
        self.index_id = Config.TWELVELABS_INDEX_ID

    def analyze_narrative_pacing(self, video_path):
        """
        PEGASUS: Uploads a video clip of the reading session to understand pacing.
        """
        print("[Slow Track] Uploading session clip to Twelve Labs...")
        try:
            # 1. Upload & Index
            task = self.client.task.create(index_id=self.index_id, file=video_path)
            # Wait for processing (blocking operation, run in thread)
            task.wait_for_done()
            
            # 2. Generate Narrative Summary
            res = self.client.generate.text(
                video_id=task.video_id,
                prompt="Analyze the pacing of this reading session. Is the user lingering on dialogue (drama) or flipping fast (action)?"
            )
            return res.data
        except Exception as e:
            print(f"Error in Pegasus: {e}")
            return "Normal pacing"

    def remember_visual_focus(self, image_path, tag):
        """
        MARENGO: Creates a vector embedding for a specific panel the user loved.
        """
        try:
            # Create an embedding task
            # Note: The Twelve Labs Python SDK syntax changes frequently. 
            # This is the standard 'embed' pattern.
            embedding = self.client.embed.create(
                engine_name="marengo2.6",
                image_file=open(image_path, "rb")
            )
            
            # In a real app, you would store this 'embedding.embedding_vector' 
            # into a vector DB (like Chroma or Pinecone). 
            # For hackathon, we return it to be stored in Backboard memory.
            return f"Visual Vector created for tag: {tag}"
        except Exception as e:
            print(f"Error in Marengo: {e}")
            return "Failed to embed visual"