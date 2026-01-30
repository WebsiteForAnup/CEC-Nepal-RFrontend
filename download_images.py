"""
Image Downloader for CEC Nepal Website
Downloads solar and wind energy images locally
"""

import os
import requests
import time
from pathlib import Path

# Create images directory if it doesn't exist
IMAGES_DIR = Path(__file__).parent / 'public' / 'images' / 'services'
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Image URLs and filenames
IMAGES = {
    'solar-1.jpg': 'https://images.unsplash.com/photo-1466611653479-c21b008b8766?w=800&h=600&fit=crop',
    'solar-2.jpg': 'https://images.unsplash.com/photo-1599423300746-40b3388b0d6d?w=800&h=600&fit=crop',
    'solar-3.jpg': 'https://images.unsplash.com/photo-1617278066863-419cfad2b84c?w=800&h=600&fit=crop',
    'wind-1.jpg': 'https://images.unsplash.com/photo-1501781900901-c35c06195179?w=800&h=600&fit=crop',
    'wind-2.jpg': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    'wind-3.jpg': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&h=600&fit=crop',
}

# Headers to avoid being blocked
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

def download_images():
    """Download all images"""
    print(f"Downloading images to: {IMAGES_DIR}\n")
    
    for filename, url in IMAGES.items():
        filepath = IMAGES_DIR / filename
        
        # Skip if already downloaded
        if filepath.exists():
            print(f"✓ {filename} already exists, skipping...")
            continue
        
        try:
            print(f"⬇ Downloading {filename}...")
            response = requests.get(url, headers=HEADERS, timeout=30)
            response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"✓ Successfully saved {filename}")
            time.sleep(1)  # Be respectful to the server
            
        except Exception as e:
            print(f"✗ Failed to download {filename}: {str(e)}")
    
    print(f"\n✓ Download complete! Images are ready in: {IMAGES_DIR}")
    print("\nImage files created:")
    for file in sorted(IMAGES_DIR.glob('*.jpg')):
        print(f"  - {file.name}")

if __name__ == '__main__':
    download_images()
