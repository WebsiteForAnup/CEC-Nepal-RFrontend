import json
import os
import re
import pandas as pd

projects_path = "/home/anupadkh/code/webapps/CEC-Nepal-RFrontend/src/data/collections/projects.json"
xlsx_path = "/home/anupadkh/code/webapps/CEC-Nepal-RFrontend/public/imports/CEC_project_List.xlsx"
images_path = "/home/anupadkh/code/webapps/CEC-Nepal-RFrontend/public/imports/images.json"
meta_path = "/home/anupadkh/code/webapps/CEC-Nepal-RFrontend/public/imports/meta.json"

STOP_WORDS = {
    "upper", "lower", "khola", "shp", "hpp", "hep", "project", "hydropower", 
    "hydroelectric", "mw", "kw", "a", "b", "i", "ii", "iii", "pv", "company", 
    "limited", "pvt", "ltd", "and", "the", "of", "in"
}

def slugify(s):
    s = s.lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_-]+', '-', s)
    return s

def get_unique_words(name):
    # Split name into lowercase alphanumeric words
    words = re.findall(r'[a-z0-9]+', name.lower())
    return {w for w in words if w not in STOP_WORDS}

def parse_sheet_features(xlsx_path, sheet_name):
    """
    Parses a worksheet and returns a key-value dictionary of features.
    """
    features = {}
    try:
        df = pd.read_excel(xlsx_path, sheet_name=sheet_name)
        if "Features" in df.columns:
            for _, row in df.iterrows():
                feat = row["Features"]
                if pd.notna(feat):
                    feat_str = str(feat).strip()
                    val = ""
                    for col in df.columns[1:]:
                        if pd.notna(row[col]) and str(row[col]).strip() not in [":", ""]:
                            val = str(row[col]).strip()
                            break
                    features[feat_str] = val
    except Exception as e:
        print(f"Error parsing sheet {sheet_name}: {e}")
    return features

def main():
    print("Loading data files...")
    with open(projects_path, 'r', encoding='utf-8') as f:
        projects_data = json.load(f)
        
    with open(images_path, 'r', encoding='utf-8') as f:
        images_data = json.load(f)
        
    with open(meta_path, 'r', encoding='utf-8') as f:
        meta_data = json.load(f)

    excel_file = pd.ExcelFile(xlsx_path)
    sheet_names = excel_file.sheet_names

    existing_projects = projects_data.get("projects", [])
    
    # Track which sheets have been processed/mapped
    mapped_sheets = set()

    # 1. Update existing projects
    print("\nUpdating existing matching projects...")
    for p in existing_projects:
        slug = p.get("slug", "")
        name = p.get("name", "")
        p_words = get_unique_words(name)
        
        # Look for sheet match
        matched_sheet = None
        for sheet_name in sheet_names:
            if sheet_name == "Extra Activities":
                continue
            
            # 1. Check exact slug match
            sheet_slug = slugify(sheet_name)
            if sheet_slug == slug:
                matched_sheet = sheet_name
                break
                
            # 2. Check unique words intersection
            sheet_words = get_unique_words(sheet_name)
            intersection = p_words.intersection(sheet_words)
            if intersection:
                # If there's a strong unique name match (e.g. both contain "seti" or "hewa")
                matched_sheet = sheet_name
                break
                
        if matched_sheet:
            print(f" - Found match: Project '{name}' matches Sheet '{matched_sheet}'")
            mapped_sheets.add(matched_sheet)
            
            # Retrieve extracted images
            sheet_images = images_data.get(matched_sheet, [])
            if sheet_images:
                p["images"] = sheet_images
                p["image_url"] = sheet_images[0]
                print(f"   -> Updated images ({len(sheet_images)}) and image_url.")
                
            # Enrich technical details from Excel
            features = parse_sheet_features(xlsx_path, matched_sheet)
            if features:
                tech = p.get("technicalDetails", {})
                if "Gross Head" in features and features["Gross Head"]:
                    tech["headHeight"] = features["Gross Head"]
                if "Design Discharge" in features and features["Design Discharge"]:
                    tech["discharge"] = features["Design Discharge"]
                if "Turbine" in features and features["Turbine"]:
                    tech["turbineType"] = features["Turbine"]
                p["technicalDetails"] = tech
        else:
            print(f" - No sheet match for existing project: '{name}'")

    # 2. Add remaining sheets as new projects
    print("\nImporting remaining sheets as new projects...")
    for sheet_name in sheet_names:
        if sheet_name == "Extra Activities" or sheet_name in mapped_sheets:
            continue
            
        print(f" - Importing sheet: '{sheet_name}'")
        features = parse_sheet_features(xlsx_path, sheet_name)
        if not features:
            continue
            
        proj_name = features.get("Project Name", sheet_name)
        proj_slug = slugify(sheet_name)
        
        # Capacity
        capacity = features.get("Installed Capacity", "")
        if not capacity and "MW" in sheet_name:
            capacity = sheet_name.split()[-2] + " " + sheet_name.split()[-1]
            
        # Commissioned year
        commissioned = ""
        cod = features.get("COD", "")
        if cod:
            match = re.search(r'\b(20\d{2}|19\d{2})\b', str(cod))
            if match:
                commissioned = match.group(1)
                
        # Status & Type
        status = features.get("Project Status", "Ongoing")
        proj_type = features.get("Project Type", "Hydroelectric")
        
        # Images
        sheet_images = images_data.get(sheet_name, [])
        image_url = sheet_images[0] if sheet_images else "/images/data/cecnepal.com.np_wp-content_uploads_2024_12_Detailed-Engineering.png_d970e6ca.png"
        
        # Create categories based on scope
        scope = features.get("CEC Scope", "")
        categories = ["Feasibility Study"]
        if "supervision" in scope.lower() or "monitoring" in scope.lower():
            categories.append("Construction Supervision")
        if "design" in scope.lower() or "engineering" in scope.lower():
            categories.append("Detailed Engineering Design")
            
        # Description
        description = f"The {proj_name} is a {proj_type} project developed by {features.get('Developer', 'Clean Energy Consultants Pvt. Ltd.')}. Located in {features.get('Project Location', features.get('Location', 'Nepal'))}, it represents an important contribution to sustainable clean energy."
        
        # Technical details
        tech = {
            "headHeight": features.get("Gross Head", ""),
            "discharge": features.get("Design Discharge", ""),
            "type": "Run-of-River" if "ror" in proj_type.lower() else "PRoR",
            "turbineType": features.get("Turbine", "")
        }
        
        # Timeline
        timeline = []
        contract_date = features.get("Contract with CEC", "")
        if contract_date:
            match = re.search(r'\b(20\d{2}|19\d{2})\b', str(contract_date))
            if match:
                timeline.append({
                    "dateRange": {
                        "start": f"{match.group(1)}-01-01",
                        "end": f"{match.group(1)}-12-31"
                    },
                    "details": "Contract with CEC Signed"
                })
        if commissioned:
            timeline.append({
                "dateRange": {
                    "start": f"{commissioned}-01-01",
                    "end": f"{commissioned}-12-31"
                },
                "details": "Project Commissioning & Power Generation"
            })
            
        new_proj = {
            "slug": proj_slug,
            "name": proj_name,
            "capacity": capacity,
            "developer": features.get("Developer", "Clean Energy Consultants Pvt. Ltd."),
            "status": status,
            "cecInputs": scope or "Feasibility Study & Technical Audit",
            "type": proj_type,
            "location": features.get("Project Location", features.get("Location", "Nepal")),
            "commissioned": commissioned,
            "image_url": image_url,
            "images": sheet_images,
            "categories": categories,
            "description": description,
            "technicalDetails": tech,
            "timeline": timeline
        }
        
        existing_projects.append(new_proj)
        mapped_sheets.add(sheet_name)

    # Save projects.json
    projects_data["projects"] = existing_projects
    print(f"\nSaving updated projects database to {projects_path}...")
    with open(projects_path, 'w', encoding='utf-8') as f:
        json.dump(projects_data, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully updated! Total projects in database: {len(existing_projects)}")

if __name__ == "__main__":
    main()
