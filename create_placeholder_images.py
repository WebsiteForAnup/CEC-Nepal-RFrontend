"""
Create placeholder images for solar and wind energy
Using PIL to generate professional-looking service images
"""

from PIL import Image, ImageDraw, ImageFilter
import os
from pathlib import Path

# Create images directory
IMAGES_DIR = Path(__file__).parent / 'public' / 'images' / 'services'
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Color schemes
COLORS = {
    'solar': {
        'primary': '#FFD700',      # Gold
        'secondary': '#FFA500',    # Orange
        'accent': '#10bffb',       # Light blue
    },
    'wind': {
        'primary': '#10bffb',      # Light blue
        'secondary': '#00CED1',    # Dark turquoise
        'accent': '#10b981',       # Green
    }
}

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_image(filename, image_type, title):
    """Create a professional placeholder image"""
    width, height = 800, 600
    
    # Get colors
    colors = COLORS['solar'] if 'solar' in filename else COLORS['wind']
    
    # Create gradient background
    img = Image.new('RGB', (width, height), hex_to_rgb(colors['primary']))
    pixels = img.load()
    
    # Create gradient effect
    primary_rgb = hex_to_rgb(colors['primary'])
    secondary_rgb = hex_to_rgb(colors['secondary'])
    
    for y in range(height):
        ratio = y / height
        r = int(primary_rgb[0] * (1 - ratio) + secondary_rgb[0] * ratio)
        g = int(primary_rgb[1] * (1 - ratio) + secondary_rgb[1] * ratio)
        b = int(primary_rgb[2] * (1 - ratio) + secondary_rgb[2] * ratio)
        
        for x in range(width):
            pixels[x, y] = (r, g, b)
    
    # Add overlay
    overlay = Image.new('RGBA', (width, height), (255, 255, 255, 40))
    img = img.convert('RGBA')
    img = Image.alpha_composite(img, overlay)
    
    # Draw title text
    draw = ImageDraw.Draw(img)
    
    # Simple text rendering
    text_color = (255, 255, 255)
    text_bbox = draw.textbbox((0, 0), title, font=None)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Draw text with shadow
    draw.text((x + 2, y + 2), title, fill=(0, 0, 0, 128), font=None)
    draw.text((x, y), title, fill=text_color, font=None)
    
    # Add bottom accent bar
    accent_rgb = hex_to_rgb(colors['accent'])
    for i in range(height - 100, height):
        for j in range(width):
            r, g, b, a = img.getpixel((j, i))
            img.putpixel((j, i), (accent_rgb[0], accent_rgb[1], accent_rgb[2], 255))
    
    img = img.convert('RGB')
    filepath = IMAGES_DIR / filename
    img.save(filepath, quality=95)
    print(f"✓ Created {filename}")

def main():
    """Create all placeholder images"""
    print("Creating placeholder images...\n")
    
    images = [
        ('solar-1.jpg', 'solar', '☀️ Solar Energy'),
        ('solar-2.jpg', 'solar', 'Solar Power Plant'),
        ('solar-3.jpg', 'solar', 'Solar Panels'),
        ('wind-1.jpg', 'wind', '💨 Wind Energy'),
        ('wind-2.jpg', 'wind', 'Wind Turbines'),
        ('wind-3.jpg', 'wind', 'Wind Power Farm'),
    ]
    
    for filename, image_type, title in images:
        try:
            create_image(filename, image_type, title)
        except Exception as e:
            print(f"✗ Failed to create {filename}: {e}")
    
    print(f"\n✓ All images created successfully!")
    print(f"Location: {IMAGES_DIR}\n")
    
    # List created files
    print("Files created:")
    for file in sorted(IMAGES_DIR.glob('*.jpg')):
        size = file.stat().st_size / 1024
        print(f"  - {file.name} ({size:.1f} KB)")

if __name__ == '__main__':
    main()
