"""
Download realistic stock images for services
Using Pexels and Pixabay APIs for real photos
"""

import requests
import os
from pathlib import Path
import time

IMAGES_DIR = Path(__file__).parent / 'public' / 'images' / 'services'
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Real image URLs from reliable sources (direct links)
IMAGES = {
    'hydropower.jpg': 'https://cdn.pixabay.com/photo/2018/05/18/08/41/hydroelectric-dam-3410411_1280.jpg',
    'solar-1.jpg': 'https://cdn.pixabay.com/photo/2020/07/29/13/00/solar-panel-5442536_1280.jpg',
    'environment.jpg': 'https://cdn.pixabay.com/photo/2015/12/01/20/28/forest-1072828_1280.jpg',
    'infrastructure.jpg': 'https://cdn.pixabay.com/photo/2017/10/25/14/11/construction-site-2883036_1280.jpg',
    'wind-1.jpg': 'https://cdn.pixabay.com/photo/2018/06/13/15/41/wind-power-3472775_1280.jpg',
    'consulting.jpg': 'https://cdn.pixabay.com/photo/2014/12/27/02/33/laptop-582572_1280.jpg',
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def download_image(filename, url):
    """Download a single image"""
    filepath = IMAGES_DIR / filename
    
    # Skip if already exists
    if filepath.exists():
        size = filepath.stat().st_size / 1024
        print(f"✓ {filename} already exists ({size:.1f} KB)")
        return True
    
    try:
        print(f"⬇ Downloading {filename}...")
        response = requests.get(url, headers=HEADERS, timeout=30, stream=True)
        response.raise_for_status()
        
        # Save image
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        size = filepath.stat().st_size / 1024
        print(f"✓ {filename} saved ({size:.1f} KB)")
        time.sleep(1)
        return True
        
    except Exception as e:
        print(f"✗ Failed to download {filename}: {str(e)}")
        return False

def main():
    print("Downloading realistic service images from Pixabay...\n")
    
    success_count = 0
    for filename, url in IMAGES.items():
        if download_image(filename, url):
            success_count += 1
    
    print(f"\n✓ Download complete! ({success_count}/{len(IMAGES)} images)")
    print(f"Location: {IMAGES_DIR}\n")
    
    # List created files
    print("Files available:")
    for file in sorted(IMAGES_DIR.glob('*.jpg')):
        size = file.stat().st_size / 1024
        print(f"  - {file.name} ({size:.1f} KB)")

if __name__ == '__main__':
    main()
