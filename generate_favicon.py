import os
from PIL import Image

logo_path = "public/images/cec-logo-trans.png"
favicon_ico_path = "public/favicon.ico"
favicon_png_path = "public/favicon.png"

if os.path.exists(logo_path):
    try:
        img = Image.open(logo_path)
        
        # Crop to square if it's not square
        width, height = img.size
        min_dim = min(width, height)
        left = (width - min_dim) / 2
        top = (height - min_dim) / 2
        right = (width + min_dim) / 2
        bottom = (height + min_dim) / 2
        
        square_img = img.crop((left, top, right, bottom))
        
        # Save favicon.png as 192x192 (standard Android/Chrome size)
        square_img.resize((192, 192), Image.Resampling.LANCZOS).save(favicon_png_path, "PNG")
        print(f"Generated {favicon_png_path} successfully!")
        
        # Save favicon.ico with multiple sizes (16x16, 32x32, 48x48)
        sizes = [(16, 16), (32, 32), (48, 48)]
        icon_imgs = [square_img.resize(size, Image.Resampling.LANCZOS) for size in sizes]
        icon_imgs[0].save(favicon_ico_path, format="ICO", sizes=sizes, append_images=icon_imgs[1:])
        print(f"Generated {favicon_ico_path} successfully!")
        
    except Exception as e:
        print(f"Error generating favicon: {e}")
else:
    print(f"Logo not found at {logo_path}")
