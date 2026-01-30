"""
Create professional service images with realistic designs
"""

from PIL import Image, ImageDraw, ImageFont
import random
import math

IMAGES_DIR = __import__('pathlib').Path(__file__).parent / 'public' / 'images' / 'services'
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_solar_image():
    """Create realistic solar panel image"""
    width, height = 800, 600
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Sky gradient (blue)
    for y in range(height // 2):
        ratio = y / (height // 2)
        r = int(200 + 55 * ratio)
        g = int(220 + 35 * ratio)
        b = int(255)
        draw.rectangle([(0, y), (width, y+1)], fill=(r, g, b))
    
    # Ground (tan)
    for y in range(height // 2, height):
        draw.rectangle([(0, y), (width, y+1)], fill=(220, 200, 140))
    
    # Solar panels
    panel_width, panel_height = 80, 120
    colors = [(50, 80, 130), (60, 90, 140), (40, 70, 120)]
    
    for row in range(3):
        for col in range(5):
            x = 100 + col * 120
            y = 150 + row * 140
            
            if x < width - 100:
                color = random.choice(colors)
                draw.rectangle(
                    [(x, y), (x + panel_width, y + panel_height)],
                    fill=color,
                    outline=(30, 30, 30)
                )
                
                # Panel grid lines
                for i in range(3):
                    draw.line(
                        [(x, y + i * panel_height // 3), (x + panel_width, y + i * panel_height // 3)],
                        fill=(80, 120, 160),
                        width=1
                    )
    
    # Sun
    sun_x, sun_y = 700, 100
    draw.ellipse([(sun_x - 50, sun_y - 50), (sun_x + 50, sun_y + 50)], fill=(255, 200, 0))
    
    # Sun rays
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        x1 = sun_x + 60 * math.cos(rad)
        y1 = sun_y + 60 * math.sin(rad)
        x2 = sun_x + 80 * math.cos(rad)
        y2 = sun_y + 80 * math.sin(rad)
        draw.line([(x1, y1), (x2, y2)], fill=(255, 200, 0), width=3)
    
    # Text overlay
    draw.rectangle([(0, height - 80), (width, height)], fill=(0, 0, 0, 180))
    draw.text((20, height - 50), "Solar Energy Solutions", fill=(255, 255, 255))
    
    img.save(IMAGES_DIR / 'solar-1.jpg', quality=95)
    print("✓ Created solar-1.jpg")

def create_wind_image():
    """Create realistic wind turbine image"""
    width, height = 800, 600
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Sky gradient (blue)
    for y in range(height):
        ratio = y / height
        r = int(100 + 155 * ratio)
        g = int(150 + 105 * ratio)
        b = int(200)
        draw.rectangle([(0, y), (width, y+1)], fill=(r, g, b))
    
    # Ground
    draw.rectangle([(0, height - 150), (width, height)], fill=(100, 150, 80))
    
    # Wind turbines
    turbine_positions = [(200, 300), (500, 250), (700, 350)]
    
    for tx, ty in turbine_positions:
        # Tower
        draw.rectangle([(tx - 20, ty), (tx + 20, ty + 200)], fill=(180, 180, 180))
        
        # Hub
        draw.ellipse([(tx - 30, ty - 30), (tx + 30, ty + 30)], fill=(200, 200, 200))
        
        # Blades
        for blade_angle in [0, 120, 240]:
            angle_rad = math.radians(blade_angle + 45)
            x1 = tx + 100 * math.cos(angle_rad)
            y1 = ty + 100 * math.sin(angle_rad)
            
            # Draw blade
            draw.polygon(
                [(tx, ty), 
                 (x1 + 15 * math.cos(angle_rad + math.pi/2), y1 + 15 * math.sin(angle_rad + math.pi/2)),
                 (x1, y1),
                 (x1 - 15 * math.cos(angle_rad + math.pi/2), y1 - 15 * math.sin(angle_rad + math.pi/2))],
                fill=(230, 230, 230),
                outline=(100, 100, 100)
            )
    
    # Clouds
    for cx, cy in [(100, 80), (650, 120), (300, 150)]:
        draw.ellipse([(cx, cy), (cx + 100, cy + 40)], fill=(200, 200, 200, 200))
        draw.ellipse([(cx + 40, cy - 20), (cx + 120, cy + 40)], fill=(200, 200, 200, 200))
    
    # Text overlay
    draw.rectangle([(0, height - 80), (width, height)], fill=(16, 191, 251, 200))
    draw.text((20, height - 50), "Wind Energy Solutions", fill=(255, 255, 255))
    
    img.save(IMAGES_DIR / 'wind-1.jpg', quality=95)
    print("✓ Created wind-1.jpg")

def create_hydropower_image():
    """Create hydropower/infrastructure image"""
    width, height = 800, 600
    img = Image.new('RGB', (width, height), (135, 206, 250))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Sky
    for y in range(height // 2):
        ratio = y / (height // 2)
        r = int(100 + 135 * ratio)
        g = int(160 + 46 * ratio)
        b = 250
        draw.rectangle([(0, y), (width, y+1)], fill=(r, g, b))
    
    # Water
    for y in range(height // 2, height):
        ratio = (y - height // 2) / (height // 2)
        r = int(65 + 20 * ratio)
        g = int(105 + 50 * ratio)
        b = int(225 - 75 * ratio)
        draw.rectangle([(0, y), (width, y+1)], fill=(r, g, b))
    
    # Dam structure (concrete)
    dam_width = 600
    dam_x = (width - dam_width) // 2
    draw.rectangle([(dam_x, height // 2 - 100), (dam_x + dam_width, height // 2 + 50)], fill=(150, 150, 160))
    
    # Dam segments
    for i in range(6):
        x = dam_x + i * (dam_width // 6)
        draw.rectangle([(x, height // 2 - 100), (x + 5, height // 2 + 50)], fill=(100, 100, 110))
    
    # Water discharge
    for i in range(5):
        draw.rectangle(
            [(dam_x + 50 + i * 100, height // 2 + 30), 
             (dam_x + 80 + i * 100, height // 2 + 200)],
            fill=(100, 180, 220, 200)
        )
    
    # Mountains
    mountain_points = [(0, 250), (150, 150), (300, 200), (400, 120), (550, 180), (700, 150), (800, 250)]
    draw.polygon(mountain_points, fill=(139, 90, 43))
    
    # Text overlay
    draw.rectangle([(0, height - 80), (width, height)], fill=(16, 191, 251, 200))
    draw.text((20, height - 50), "Hydropower Engineering", fill=(255, 255, 255))
    
    img.save(IMAGES_DIR / 'hydropower.jpg', quality=95)
    print("✓ Created hydropower.jpg")

def create_infrastructure_image():
    """Create infrastructure/construction image"""
    width, height = 800, 600
    img = Image.new('RGB', (width, height), (135, 206, 235))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Sky
    for y in range(height):
        ratio = y / height
        r = int(200 - 65 * ratio)
        g = int(220 - 14 * ratio)
        b = int(255 - 20 * ratio)
        draw.rectangle([(0, y), (width, y+1)], fill=(r, g, b))
    
    # Ground
    draw.rectangle([(0, height - 150), (width, height)], fill=(180, 160, 140))
    
    # Building structure
    building_x, building_y = 150, 250
    building_width, building_height = 300, 250
    
    # Main structure
    draw.rectangle(
        [(building_x, building_y), (building_x + building_width, building_y + building_height)],
        fill=(200, 200, 200)
    )
    
    # Windows
    for row in range(4):
        for col in range(4):
            wx = building_x + 30 + col * 65
            wy = building_y + 30 + row * 55
            draw.rectangle([(wx, wy), (wx + 40, wy + 35)], fill=(100, 150, 200))
    
    # Crane
    crane_x, crane_y = 550, 150
    draw.line([(crane_x, crane_y), (crane_x, crane_y + 150)], fill=(200, 100, 0), width=8)
    draw.line([(crane_x - 100, crane_y + 50), (crane_x + 100, crane_y + 50)], fill=(200, 100, 0), width=6)
    draw.line([(crane_x + 100, crane_y + 50), (crane_x + 150, crane_y + 200)], fill=(50, 50, 50), width=4)
    
    # Text overlay
    draw.rectangle([(0, height - 80), (width, height)], fill=(16, 191, 251, 200))
    draw.text((20, height - 50), "Infrastructure Development", fill=(255, 255, 255))
    
    img.save(IMAGES_DIR / 'infrastructure.jpg', quality=95)
    print("✓ Created infrastructure.jpg")

def create_environment_image():
    """Create environmental/forest image"""
    width, height = 800, 600
    img = Image.new('RGB', (width, height), (135, 206, 235))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Sky
    for y in range(height // 2):
        ratio = y / (height // 2)
        r = int(150 + 105 * ratio)
        g = int(200 + 55 * ratio)
        b = int(255)
        draw.rectangle([(0, y), (width, y+1)], fill=(r, g, b))
    
    # Ground
    draw.rectangle([(0, height // 2), (width, height)], fill=(34, 139, 34))
    
    # Trees - distant
    for x in [100, 300, 500, 700]:
        height_tree = 150
        draw.rectangle([(x - 15, height // 2 - height_tree), (x + 15, height // 2)], fill=(101, 67, 33))
        draw.polygon([(x - 60, height // 2), (x, height // 2 - 100), (x + 60, height // 2)], fill=(34, 120, 34))
    
    # Trees - close up (taller)
    for x in [150, 650]:
        height_tree = 250
        draw.rectangle([(x - 25, height // 2 - height_tree), (x + 25, height // 2)], fill=(85, 50, 25))
        draw.polygon([(x - 100, height // 2), (x, height // 2 - 150), (x + 100, height // 2)], fill=(46, 125, 50))
        draw.polygon([(x - 80, height // 2 - 60), (x, height // 2 - 180), (x + 80, height // 2 - 60)], fill=(56, 142, 60))
    
    # Leaves/foliage texture
    for _ in range(50):
        px = __import__('random').randint(0, width)
        py = __import__('random').randint(height // 2 - 250, height // 2)
        draw.ellipse([(px, py), (px + 20, py + 20)], fill=(46, 125, 50, 150))
    
    # Text overlay
    draw.rectangle([(0, height - 80), (width, height)], fill=(16, 185, 129, 200))
    draw.text((20, height - 50), "Environmental Solutions", fill=(255, 255, 255))
    
    img.save(IMAGES_DIR / 'environment.jpg', quality=95)
    print("✓ Created environment.jpg")

def create_consulting_image():
    """Create consulting/team meeting image"""
    width, height = 800, 600
    img = Image.new('RGB', (width, height), (245, 245, 245))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Background
    draw.rectangle([(0, 0), (width, height)], fill=(240, 245, 250))
    
    # Meeting table
    table_width, table_height = 500, 100
    table_x = (width - table_width) // 2
    table_y = 250
    draw.rectangle([(table_x, table_y), (table_x + table_width, table_y + table_height)], fill=(160, 82, 45))
    
    # Chairs/people (simplified)
    people_positions = [(200, 180), (400, 180), (300, 380), (200, 380), (400, 380)]
    
    for px, py in people_positions:
        # Head
        draw.ellipse([(px - 20, py - 40), (px + 20, py)], fill=(200, 150, 100))
        # Body
        draw.rectangle([(px - 30, py), (px + 30, py + 60)], fill=(50, 80, 140))
    
    # Laptops on table
    for lx in [table_x + 80, table_x + 420]:
        draw.rectangle([(lx, table_y - 30), (lx + 60, table_y - 5)], fill=(100, 100, 100))
    
    # Wall elements (framed content)
    draw.rectangle([(50, 50), (300, 150)], fill=(255, 255, 255), outline=(16, 191, 251), width=3)
    draw.rectangle([(500, 50), (750, 150)], fill=(255, 255, 255), outline=(16, 185, 129), width=3)
    
    # Text overlay
    draw.rectangle([(0, height - 80), (width, height)], fill=(16, 191, 251, 200))
    draw.text((20, height - 50), "Project Consulting", fill=(255, 255, 255))
    
    img.save(IMAGES_DIR / 'consulting.jpg', quality=95)
    print("✓ Created consulting.jpg")

def main():
    """Create all service images"""
    print("Creating professional service images...\n")
    
    try:
        create_hydropower_image()
        create_solar_image()
        create_environment_image()
        create_infrastructure_image()
        create_wind_image()
        create_consulting_image()
        
        print(f"\n✓ All images created successfully!")
        print(f"Location: {IMAGES_DIR}\n")
        
        # List created files
        print("Files created:")
        for file in sorted(IMAGES_DIR.glob('*.jpg')):
            size = file.stat().st_size / 1024
            print(f"  - {file.name} ({size:.1f} KB)")
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
