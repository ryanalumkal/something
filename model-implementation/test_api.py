import requests
from PIL import Image, ImageDraw

# Create a test image
img = Image.new('RGB', (800, 600), color='darkblue')
draw = ImageDraw.Draw(img)
draw.text((200, 250), "DARK SCENE", fill='white')
img.save('test_panel.jpg')

# Test the API
url = 'http://localhost:5000/page-turn'
files = {'image': open('test_panel.jpg', 'rb')}

print("Sending test image to backend...")
response = requests.post(url, files=files)

print("\nResponse:")
print(response.json())
