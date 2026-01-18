# backend/slow_track.py
import os
from twelvelabs import TwelveLabs
from backend.config import Config

class SlowTrackService:
    def __init__(self):
        self.client = TwelveLabs(api_key=Config.TWELVELABS_API_KEY)
        self.index_id = Config.TWELVELABS_INDEX_ID

    def check_scene_continuity(self, image_path):
        """
        RECALL MEMORY: Does this page look like the last few pages?
        """
        print(f"[Slow Track] Checking continuity for {image_path}...")
        try:
            search_results = self.client.search.query(
                index_id=self.index_id,
                query_media_type="image",
                query_media_file=open(image_path, "rb"),
                options=["visual"]
            )
            
            if search_results.data and len(search_results.data) > 0:
                top_match = search_results.data[0]
                score = top_match.score 
                print(f"[Slow Track] Match Score: {score}")
                return (score > 0.70), score
            
            return False, 0.0
        except Exception as e:
            print(f"Error in Search: {e}")
            return False, 0.0

    def add_to_memory(self, image_path):
        """
        SAVE MEMORY: Index this page so we recognize it later.
        """
        try:
            print(f"[Slow Track] Indexing new scene: {image_path}")
            self.client.task.create(
                index_id=self.index_id, 
                file=image_path
            )
            return True
        except Exception as e:
            print(f"Error Indexing: {e}")
            return False

    # --- MISSING FUNCTION RESTORED BELOW ---
    def analyze_narrative_pacing(self, video_path):
        """
        PEGASUS: Analyzes the webcam video chunk for pacing context.
        """
        print(f"[Slow Track] Analyzing video segment: {video_path}")
        try:
            # 1. Upload & Index the video segment
            task = self.client.task.create(index_id=self.index_id, file=video_path)
            task.wait_for_done()
            
            # 2. Generate Analysis (Pegasus 1.2)
            # using 'generate.text' or 'analyze' depending on specific SDK version
            # The prompt asks for pacing specifically
            res = self.client.generate.text(
                video_id=task.video_id,
                prompt="Analyze the reading pacing. Is the user flipping pages quickly (action/excitement) or staring at pages slowly (confusion/awe)?"
            )
            return res.data
        except Exception as e:
            print(f"Error in Pegasus Analysis: {e}")
            return "Normal pacing"