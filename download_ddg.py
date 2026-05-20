import os
import requests
from duckduckgo_search import DDGS
from itertools import islice

queries = {
    "feasibility.jpg": "engineering feasibility study business plan",
    "detail-engineering.jpg": "detail engineering design architecture plan CAD",
    "due-diligence.jpg": "due diligence audit paper analysis consulting",
    "construction-supervision.jpg": "construction supervision engineer on site helmet",
    "bill-verification.jpg": "bill verification finance checking invoice",
    "survey.jpg": "land survey engineering total station",
    "physical-modelling.jpg": "physical scale model engineering hydraulic model"
}

output_dir = "/home/anupadkh/code/webapps/CEC-Nepal-RFrontend/public/images/services"
os.makedirs(output_dir, exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

ddgs = DDGS()

for filename, query in queries.items():
    filepath = os.path.join(output_dir, filename)
    print(f"Searching for {query}...")
    try:
        results = list(islice(ddgs.images(query, max_results=5), 5))
        for res in results:
            img_url = res.get("image")
            print(f"Trying URL: {img_url}")
            try:
                img_data = requests.get(img_url, headers=headers, timeout=5).content
                with open(filepath, 'wb') as f:
                    f.write(img_data)
                print(f"Successfully downloaded {filename}")
                break
            except Exception as e:
                print(f"Failed to download {img_url}: {e}")
    except Exception as e:
        print(f"Search failed for {query}: {e}")
