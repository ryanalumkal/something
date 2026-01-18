# main.py
import os
import shutil
import threading
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS

# Import your services (from the files you uploaded)
from backend.fast_track import FastTrackService
from backend.slow_track import SlowTrackService
from backend.router import RouterService

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize
fast_track = FastTrackService()
slow_track = SlowTrackService()
router = RouterService()

# Global Context State
current_context = {
    "narrative_pacing": "Normal",
    "last_scene_context": "Start of story"
}

# --- ROUTE 1: PAGE TURN (Called by Frontend/Comic Reader) ---
@app.route('/page-turn', methods=['POST'])
def on_page_turn():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    unique_id = str(uuid.uuid4())
    temp_path = f"temp_{unique_id}.jpg"
    file.save(temp_path)
    
    try:
        # 1. Fast Track (Vibe)
        visual_vibe = fast_track.analyze_vibe(temp_path)
        
        # 2. Slow Track (Visual Memory Check)
        is_same_scene, score = slow_track.check_scene_continuity(temp_path)
        
        if is_same_scene:
            scene_context = "Continuing previous scene."
        else:
            scene_context = "SCENE SWITCH DETECTED. New location/mood."
            # Index this new scene for future memory
            bg_path = f"bg_{unique_id}.jpg"
            shutil.copy(temp_path, bg_path)
            threading.Thread(target=slow_track.add_to_memory, args=(bg_path,)).start()

        # Combine inputs for Router
        full_context = f"{scene_context} Narrative Pacing: {current_context['narrative_pacing']}."
        
        # 3. Router (Music Recommendation)
        music_rec = router.get_music_recommendation(visual_vibe, full_context)
        
        return jsonify({
            "vibe": visual_vibe,
            "context": full_context,
            "music": music_rec
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# --- ROUTE 2: PACING UPDATE (Called by recorder.py) ---
@app.route('/update-pacing', methods=['POST'])
def update_pacing():
    """
    Receives video chunks from recorder.py
    """
    if 'video' not in request.files:
        return jsonify({"error": "No video uploaded"}), 400
        
    video = request.files['video']
    temp_video_path = f"temp_video_{str(uuid.uuid4())}.mp4"
    video.save(temp_video_path)
    
    def process_video_background(path):
        # Call Pegasus (Slow Track) to analyze the video
        result = slow_track.analyze_narrative_pacing(path)
        # Update the global state
        current_context["narrative_pacing"] = result
        print(f"*** MEMORY UPDATED: {result} ***")
        
        # Cleanup
        if os.path.exists(path):
            os.remove(path)

    # Run analysis in background so recorder.py doesn't wait
    threading.Thread(target=process_video_background, args=(temp_video_path,)).start()
    
    return jsonify({"status": "Video received, analyzing in background..."})

if __name__ == '__main__':
    app.run(port=5000, debug=True)