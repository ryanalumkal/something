# recorder.py
import cv2
import requests
import time
import os
import threading

# CONFIGURATION
SERVER_URL = "http://localhost:5000/update-pacing"
CHUNK_DURATION = 60  # Record in 60-second intervals
TEMP_FILENAME = "temp_recording.mp4"

def upload_segment(file_path):
    """
    Runs in a background thread to upload the video 
    without stopping the recording loop.
    """
    try:
        print(f"[Recorder] Uploading {file_path} to Pegasus...")
        with open(file_path, 'rb') as f:
            files = {'video': f}
            response = requests.post(SERVER_URL, files=files)
            print(f"[Recorder] Server Response: {response.json()}")
    except Exception as e:
        print(f"[Recorder] Upload Failed: {e}")
    finally:
        # Cleanup file after upload attempt
        if os.path.exists(file_path):
            os.remove(file_path)

def start_recording():
    cap = cv2.VideoCapture(0) # '0' is usually the default webcam
    
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    # Video Codec configuration (MP4)
    fourcc = cv2.VideoWriter_fourcc(*'mp4v') 
    fps = 20.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    print(f"Starting Recording Loop ({CHUNK_DURATION}s intervals)... Press 'q' to quit.")

    while True:
        # Create a new file for this chunk
        current_filename = f"chunk_{int(time.time())}.mp4"
        out = cv2.VideoWriter(current_filename, fourcc, fps, (width, height))
        
        start_time = time.time()
        
        # RECORDING LOOP (Runs for CHUNK_DURATION seconds)
        while int(time.time() - start_time) < CHUNK_DURATION:
            ret, frame = cap.read()
            if not ret:
                print("Error: Failed to grab frame.")
                break
                
            out.write(frame)
            
            # Optional: Show a preview window
            cv2.imshow('Pegasus Eye (Recording)', frame)
            
            # Allow quitting with 'q' key
            if cv2.waitKey(1) & 0xFF == ord('q'):
                out.release()
                cap.release()
                cv2.destroyAllWindows()
                return

        # Time's up! Close the file.
        out.release()
        
        # Send it to the server (in a separate thread so recording doesn't lag)
        upload_thread = threading.Thread(target=upload_segment, args=(current_filename,))
        upload_thread.start()

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    # Ensure you have 'requests' and 'opencv-python' installed
    # pip install requests opencv-python
    start_recording()