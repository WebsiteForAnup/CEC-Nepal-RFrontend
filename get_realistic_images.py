"""
Download high-quality realistic images from alternative sources
"""

import requests
import io
from pathlib import Path

IMAGES_DIR = Path(__file__).parent / 'public' / 'images' / 'services'
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# High-quality stock photo URLs
IMAGES = {
    'hydropower.jpg': 'https://images.pexels.com/photos/279797/pexels-photo-279797.jpeg',
    'solar-1.jpg': 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg',
    'environment.jpg': 'https://images.pexels.com/photos/1105904/pexels-photo-1105904.jpeg',
    'infrastructure.jpg': 'https://images.pexels.com/photos/159618/pexels-photo-159618.jpeg',
    'wind-1.jpg': 'https://images.pexels.com/photos/60582/pexels-photo-60582.jpeg',
    'consulting.jpg': 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
}

def download_image(filename, url):
    filepath = IMAGES_DIR / filename
    
    if filepath.exists():
        print(f"✓ {filename} exists")
        return True
    
    try:
        print(f"⬇ Downloading {filename}...")
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        size = filepath.stat().st_size / 1024 / 1024
        print(f"✓ {filename} ({size:.2f} MB)")
        return True
    except Exception as e:
        print(f"✗ {filename}: {str(e)}")
        return False

print("Downloading realistic images...\n")

for filename, url in IMAGES.items():
    download_image(filename, url)

print(f"\n✓ Done! Images saved to {IMAGES_DIR}")

for file in sorted(IMAGES_DIR.glob('*.jpg')):
    if file.stat().st_size > 0:
        size = file.stat().st_size / 1024
        print(f"  ✓ {file.name} ({size:.1f} KB)")
