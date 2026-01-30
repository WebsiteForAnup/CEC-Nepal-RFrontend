"""
Get realistic service images using working URLs
"""

import urllib.request
import ssl
from pathlib import Path

IMAGES_DIR = Path(__file__).parent / 'public' / 'images' / 'services'
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Working direct image URLs (tested)
IMAGE_URLS = {
    'hydropower.jpg': 'https://cdn.download.ams.birds.cornell.edu/api/v1/asset/318620161/1280',
    'solar-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Solar_Panels.jpg/1280px-Solar_Panels.jpg',
    'environment.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/1280px-24701-nature-natural-beauty.jpg',
    'infrastructure.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Tower_Crane_Raising_Load.JPG/1280px-Tower_Crane_Raising_Load.JPG',
    'wind-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Horns_Rev_2_wind_farm.jpg/1280px-Horns_Rev_2_wind_farm.jpg',
    'consulting.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Businesspeople_in_a_meeting.jpg/1280px-Businesspeople_in_a_meeting.jpg',
}

def download_url(url, filename):
    filepath = IMAGES_DIR / filename
    
    if filepath.exists() and filepath.stat().st_size > 0:
        print(f"✓ {filename} already exists")
        return True
    
    try:
        print(f"⬇ Downloading {filename}...")
        
        # Disable SSL verification for this operation
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        request = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0'}
        )
        
        with urllib.request.urlopen(request, context=ctx) as response:
            with open(filepath, 'wb') as f:
                f.write(response.read())
        
        size = filepath.stat().st_size / 1024
        if size > 0:
            print(f"✓ {filename} ({size:.1f} KB)")
            return True
        else:
            print(f"✗ {filename} - empty file")
            filepath.unlink()
            return False
            
    except Exception as e:
        print(f"✗ {filename}: {str(e)}")
        return False

print("Downloading realistic service images...\n")

success = 0
for filename, url in IMAGE_URLS.items():
    if download_url(url, filename):
        success += 1

print(f"\n✓ Complete! ({success}/{len(IMAGE_URLS)} downloaded)\n")
print("Images ready in:", IMAGES_DIR)
