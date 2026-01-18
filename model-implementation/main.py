# main.py
import os
import threading
import base64
from flask import Flask, request, jsonify, send_from_directory
from backend.fast_track import FastTrackService
from backend.slow_track import SlowTrackService
from backend.router import RouterService

app = Flask(__name__, static_folder='frontend')

# Initialize Services
fast_service = FastTrackService()
slow_service = SlowTrackService()
router_service = RouterService()

# Global variable to store the latest "Identity" context
user_context = "User likes balanced pacing and standard heroes."

@app.route('/')
def index():
    return send_from_directory('frontend', 'index.html')

# --- API ENDPOINTS ---

@app.route('/api/analyze_page', methods=['POST'])
def analyze_page():
    """
    Called when the user turns a page.
    1. Fast Vibe Check (Gemini)
    2. Smart Music Pick (Claude + Context)
    """
    data = request.json
    image_data_b64 = data['image_b64'].split(",")[1] # Remove header
    image_bytes = base64.b64decode(image_data_b64)

    # 1. FAST TRACK: Get the Vibe
    vibe = fast_service.analyze_vibe(image_bytes)
    print(f"Gemini Vibe: {vibe}")

    # 2. ROUTER: Get Music (using the global user_context)
    music_recommendation = router_service.get_music_recommendation(vibe, user_context)
    
    return jsonify({
        "vibe": vibe,
        "music": music_recommendation
    })

@app.route('/api/track_gaze', methods=['POST'])
def track_gaze():
    """
    Receives eye-tracking coordinates. 
    Aggregates them to find 'Areas of Interest'.
    """
    data = request.json
    # In a real implementation, you would accumulate these points.
    # If a user stares at one point (x,y) for > 5 seconds, trigger the Slow Track.
    
    # Mock Logic for Hackathon Demo:
    if data.get('duration_on_target', 0) > 5000: # 5 seconds
        # Spin up a thread to run Twelve Labs so we don't block the UI
        threading.Thread(target=run_deep_analysis, args=("mock_panel_path.jpg",)).start()
        
    return jsonify({"status": "tracking"})

def run_deep_analysis(image_path):
    """
    Background worker that updates the global identity context.
    """
    global user_context
    print("Running Deep Analysis (Twelve Labs)...")
    
    # 1. Marengo: Remember this visual
    slow_service.remember_visual_focus(image_path, "High Interest")
    
    # 2. Update Global Context
    new_insight = "User is currently fascinated by the Villain character."
    user_context = new_insight
    
    # 3. Persist to Backboard
    router_service.update_identity_memory(new_insight)
    print(f"Context Updated: {user_context}")

if __name__ == '__main__':
    # Run on 0.0.0.0 to be accessible by the Pi if running on laptop
    app.run(host='0.0.0.0', port=5000, debug=True)