import requests
import json
import os
import urllib.parse

pages = {
    "feasibility.jpg": "Feasibility_study",
    "detail-engineering.jpg": "Computer-aided_design",
    "due-diligence.jpg": "Financial_audit",
    "construction-supervision.jpg": "Construction",
    "bill-verification.jpg": "Invoice",
    "survey.jpg": "Surveying",
    "physical-modelling.jpg": "Scale_model"
}

output_dir = "/home/anupadkh/code/webapps/CEC-Nepal-RFrontend/public/images/services"
os.makedirs(output_dir, exist_ok=True)
headers = {'User-Agent': 'AntigravityBot/1.0 (anup@cecnepal.com) Python/3.10'}

for filename, page_title in pages.items():
    url = f"https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles={urllib.parse.quote(page_title)}&pithumbsize=800"
    try:
        response = requests.get(url, headers=headers, timeout=10)
        data = response.json()
        pages_data = data.get("query", {}).get("pages", {})
        
        image_url = None
        for page_id, page_info in pages_data.items():
            if "thumbnail" in page_info:
                image_url = page_info["thumbnail"]["source"]
                break
        
        if image_url:
            print(f"Downloading {image_url} for {filename}")
            filepath = os.path.join(output_dir, filename)
            img_data = requests.get(image_url, headers=headers, timeout=10).content
            with open(filepath, 'wb') as f:
                f.write(img_data)
        else:
            print(f"No image found for {page_title}")
    except Exception as e:
        print(f"Error for {page_title}: {e}")
