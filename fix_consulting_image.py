"""
Download fresh consulting image
"""

import urllib.request
import ssl
from pathlib import Path

IMAGES_DIR = Path(__file__).parent / 'public' / 'images' / 'services'
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Professional consulting/business meeting image
url = 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg'
filepath = IMAGES_DIR / 'consulting.jpg'

try:
    print("Downloading consulting image...")
    
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
    print(f"✓ consulting.jpg downloaded ({size:.1f} KB)")
    
except Exception as e:
    print(f"✗ Error: {e}")
