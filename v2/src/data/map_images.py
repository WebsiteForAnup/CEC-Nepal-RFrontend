import json
import os
import glob

# Load image lookup
with open('image_files.txt', 'r') as f:
    available_images = [line.strip() for line in f if line.strip()]

def find_local_image(url):
    if not isinstance(url, str) or not url.startswith('http'):
        return url
    
    # Extract path part
    path_part = url.replace('https://', '').replace('http://', '')
    
    # Remove extension for flexible matching
    base_path, _ = os.path.splitext(path_part)
    prefix = base_path.replace('/', '_')
    
    # Try to find a file that starts with this prefix
    # e.g. prefix 'cecnepal.com.np_wp-content_uploads_2023_10_CEC-studies-Project'
    # matches 'cecnepal.com.np_wp-content_uploads_2023_10_CEC-studies-Project-1024x726...'
    for img in available_images:
        if img.startswith(prefix):
            return f"/images/data/{img}"
    
    # Fallback to just the filename part if full path prefix fails
    filename = os.path.basename(base_path)
    for img in available_images:
        if filename in img:
            return f"/images/data/{img}"
            
    return url

def update_recursive(obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in ['image_url', 'image', 'photo', 'featureImage', 'url', 'img'] and isinstance(v, str) and v.startswith('http'):
                obj[k] = find_local_image(v)
            else:
                update_recursive(v)
    elif isinstance(obj, list):
        for item in obj:
            update_recursive(item)

# Process all JSON files in src/data
for json_file in glob.glob('src/data/*.json'):
    print(f"Processing {json_file}...")
    with open(json_file, 'r') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            continue

    update_recursive(data)

    with open(json_file, 'w') as f:
        json.dump(data, f, indent=2)

print("Mapping complete across all data files.")
