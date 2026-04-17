import os
import json
import re
import hashlib
from urllib.parse import urlparse, urljoin
from pathlib import Path

# Configuration
# This script should be run from the src/data directory
DATA_DIR = Path(__file__).parent
# Destination is now in public/ images folder relative to the project root
# We assume this script stays in src/data/
IMG_DIR = DATA_DIR.parent.parent / 'public' / 'images' / 'data'
BASE_URL = "https://cecnepal.com.np/"
PLACEHOLDER = "cecnepal.com.np_wp-content_plugins_elementor_assets_images_placeholder.png_4a979903.png"

IMAGE_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg')

def safe_name(url):
    parsed = urlparse(url)
    path = parsed.path or "root"
    if path.endswith("/"):
        path += "index"
    base = f"{parsed.netloc}{path}"
    base = re.sub(r"[^A-Za-z0-9._-]+", "_", base)
    if parsed.query:
        qhash = hashlib.sha256(parsed.query.encode("utf-8")).hexdigest()[:8]
        base = f"{base}_q{qhash}"
    uhash = hashlib.sha256(url.encode("utf-8")).hexdigest()[:8]
    return f"{base}_{uhash}"

def get_image_files():
    """Returns a list of all filenames in public/images/data"""
    if not IMG_DIR.exists():
        print(f"Warning: {IMG_DIR} not found.")
        return []
    return [f.name for f in IMG_DIR.iterdir() if f.is_file()]

def is_image_url(url):
    parsed = urlparse(url)
    if any(parsed.path.lower().endswith(ext) for ext in IMAGE_EXTENSIONS):
        return True
    if 'wp-content/uploads' in url:
        return True
    return False

def find_best_match(url, all_files):
    if not is_image_url(url):
        return None

    # 1. Try exact safe_name
    s_name = safe_name(url)
    for f in all_files:
        if f.startswith(s_name):
            return f
    
    # 2. Try fuzzy match
    parsed = urlparse(url)
    url_filename = os.path.basename(parsed.path)
    if url_filename:
        base_name, ext = os.path.splitext(url_filename)
        clean_base = re.sub(r'-\d+x\d+$', '', base_name)
        clean_base = re.sub(r'-scaled$', '', clean_base)
        
        for f in all_files:
            if clean_base.lower() in f.lower() and 'placeholder' not in f:
                return f
                
    # 3. Fallback to placeholder if broken
    if 'cecnepal.com.np' in url:
        return PLACEHOLDER
        
    return None

def update_json_file(filepath, all_files):
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            print(f"Skipping {filepath.name} - invalid JSON")
            return False

    modified = False

    def process_node(node):
        nonlocal modified
        if isinstance(node, dict):
            for key, value in node.items():
                if isinstance(value, str):
                    # Check if it's already a local path from a previous run or a new URL
                    is_potential_image = (
                        value.startswith('http') or 
                        value.startswith('/wp-content') or 
                        value.startswith('/images') or
                        value.startswith('src/data/img')
                    )
                    
                    if is_potential_image:
                        # Normalize old local path to original-ish URL start if possible, 
                        # but safe_name needs the full URL. 
                        # If it's src/data/img, we already mapped it, but we want to change prefix.
                        if value.startswith('src/data/img/'):
                             filename = os.path.basename(value)
                             new_path = f"/images/data/{filename}"
                             if node[key] != new_path:
                                 node[key] = new_path
                                 modified = True
                        else:
                            match = find_best_match(value, all_files)
                            if match:
                                new_path = f"/images/data/{match}"
                                if node[key] != new_path:
                                    print(f"  Mapping: {value} -> {new_path}")
                                    node[key] = new_path
                                    modified = True
                else:
                    process_node(value)
        elif isinstance(node, list):
            for i, item in enumerate(node):
                if isinstance(item, str):
                    is_potential_image = (
                        item.startswith('http') or 
                        item.startswith('/wp-content') or 
                        item.startswith('/images') or
                        item.startswith('src/data/img')
                    )
                    
                    if is_potential_image:
                        if item.startswith('src/data/img/'):
                             filename = os.path.basename(item)
                             new_path = f"/images/data/{filename}"
                             if node[i] != new_path:
                                 node[i] = new_path
                                 modified = True
                        else:
                            match = find_best_match(item, all_files)
                            if match:
                                new_path = f"/images/data/{match}"
                                if node[i] != new_path:
                                    print(f"  Mapping: {item} -> {new_path}")
                                    node[i] = new_path
                                    modified = True
                else:
                    process_node(item)

    process_node(data)

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    return False

def main():
    print(f"Reading images from {IMG_DIR}...")
    all_files = get_image_files()
    print(f"Found {len(all_files)} images.")

    updated_count = 0
    for file in DATA_DIR.glob('*.json'):
        if file.name == 'package.json': continue
        print(f"Processing {file.name}...")
        if update_json_file(file, all_files):
            updated_count += 1
            print(f"✓ Updated {file.name}")

    print(f"\nDone! {updated_count} JSON files updated.")

if __name__ == "__main__":
    main()
