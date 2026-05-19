#!/usr/bin/env python3
import os
import re
import json
import zipfile
import xml.etree.ElementTree as ET
import pandas as pd

xlsx_path = "/home/anupadkh/code/webapps/CEC-Nepal-RFrontend/public/imports/CEC_project_List.xlsx"
output_img_dir = "/home/anupadkh/code/webapps/CEC-Nepal-RFrontend/public/images/projects"
output_meta_path = "/home/anupadkh/code/webapps/CEC-Nepal-RFrontend/public/imports/meta.json"
output_images_path = "/home/anupadkh/code/webapps/CEC-Nepal-RFrontend/public/imports/images.json"

namespaces = {
    'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'rels': 'http://schemas.openxmlformats.org/package/2006/relationships',
    'drawing': 'http://schemas.openxmlformats.org/drawingml/2006/sheetDrawing'
}

def slugify(s):
    s = s.lower().strip()
    s = re.sub(r'[^\w\s-]', '', s)
    s = re.sub(r'[\s_-]+', '_', s)
    return s

def extract_excel_images(xlsx_path, output_dir):
    """
    Extracts images from the Excel ZIP archive and groups them by sheet name.
    Returns a dict mapping sheet name -> list of extracted file names.
    """
    os.makedirs(output_dir, exist_ok=True)
    sheet_images = {}

    with zipfile.ZipFile(xlsx_path, 'r') as z:
        # 1. Parse workbook.xml to get sheet names and their rId
        wb_tree = ET.parse(z.open('xl/workbook.xml'))
        wb_root = wb_tree.getroot()
        
        sheets = wb_root.find('main:sheets', namespaces)
        sheet_list = []
        if sheets is not None:
            for sheet in sheets.findall('main:sheet', namespaces):
                name = sheet.attrib.get('name')
                rId = sheet.attrib.get(f"{{{namespaces['r']}}}id")
                sheet_list.append((name, rId))
                
        # 2. Parse workbook.xml.rels to map rId to worksheet target filename
        wb_rels_tree = ET.parse(z.open('xl/_rels/workbook.xml.rels'))
        wb_rels_root = wb_rels_tree.getroot()
        
        rid_to_target = {}
        for rel in wb_rels_root.findall('rels:Relationship', namespaces):
            rid = rel.attrib.get('Id')
            target = rel.attrib.get('Target')
            rid_to_target[rid] = target
            
        # 3. For each sheet, follow drawing relationship to media images
        for name, rId in sheet_list:
            sheet_images[name] = []
            target = rid_to_target.get(rId)
            if not target:
                continue
                
            ws_path = f"xl/{target}"
            if ws_path not in z.namelist():
                continue
                
            try:
                ws_tree = ET.parse(z.open(ws_path))
                ws_root = ws_tree.getroot()
                
                drawing_el = ws_root.find('main:drawing', namespaces)
                if drawing_el is not None:
                    drawing_rid = drawing_el.attrib.get(f"{{{namespaces['r']}}}id")
                    
                    ws_dir, ws_file = os.path.split(ws_path)
                    rels_path = f"{ws_dir}/_rels/{ws_file}.rels"
                    
                    if rels_path in z.namelist():
                        rels_tree = ET.parse(z.open(rels_path))
                        rels_root = rels_tree.getroot()
                        
                        drawing_target = None
                        for rel in rels_root.findall('rels:Relationship', namespaces):
                            if rel.attrib.get('Id') == drawing_rid:
                                drawing_target = rel.attrib.get('Target')
                                break
                                
                        if drawing_target:
                            drawing_path = os.path.normpath(os.path.join(ws_dir, drawing_target))
                            
                            draw_dir, draw_file = os.path.split(drawing_path)
                            draw_rels_path = f"{draw_dir}/_rels/{draw_file}.rels"
                            
                            if draw_rels_path in z.namelist():
                                draw_rels_tree = ET.parse(z.open(draw_rels_path))
                                draw_rels_root = draw_rels_tree.getroot()
                                
                                media_files = []
                                for r in draw_rels_root.findall('rels:Relationship', namespaces):
                                    t = r.attrib.get('Target')
                                    media_path = os.path.normpath(os.path.join(draw_dir, t))
                                    media_files.append(media_path)
                                    
                                # Extract images and save them with clean name structure
                                sheet_slug = slugify(name)
                                for idx, mf in enumerate(media_files):
                                    if mf in z.namelist():
                                        ext = os.path.splitext(mf)[1] or ".png"
                                        out_filename = f"{sheet_slug}_image_{idx + 1}{ext}"
                                        out_filepath = os.path.join(output_dir, out_filename)
                                        
                                        # Save actual raw image file
                                        with open(out_filepath, 'wb') as out_f:
                                            out_f.write(z.read(mf))
                                            
                                        # Public URL format for React app
                                        public_url = f"/images/projects/{out_filename}"
                                        sheet_images[name].append(public_url)
            except Exception as e:
                print(f"Error processing drawings for sheet {name}: {e}")
                
    return sheet_images

def extract_meta_information(xlsx_path, sheet_image_counts):
    """
    Extracts sheet columns, row counts, and metadata using Pandas.
    """
    meta_info = {
        "workbook": os.path.basename(xlsx_path),
        "sheets": []
    }
    
    excel_file = pd.ExcelFile(xlsx_path)
    for idx, sheet_name in enumerate(excel_file.sheet_names):
        try:
            # Read header and compute row counts
            df = excel_file.parse(sheet_name)
            row_count = len(df)
            columns = [str(col) for col in df.columns if not str(col).startswith("Unnamed:")]
            
            image_count = len(sheet_image_counts.get(sheet_name, []))
            
            meta_info["sheets"].append({
                "index": idx + 1,
                "name": sheet_name,
                "slug": slugify(sheet_name),
                "row_count": row_count,
                "columns": columns,
                "image_count": image_count
            })
        except Exception as e:
            print(f"Error reading metadata for sheet {sheet_name}: {e}")
            
    return meta_info

def main():
    print(f"Starting extraction from: {xlsx_path}")
    
    # 1. Extract Images
    print("Extracting images...")
    sheet_images = extract_excel_images(xlsx_path, output_img_dir)
    total_images = sum(len(urls) for urls in sheet_images.values())
    print(f"Successfully extracted {total_images} images to {output_img_dir}")
    
    # 2. Extract Metadata
    print("Reading sheet metadata...")
    meta_info = extract_meta_information(xlsx_path, sheet_images)
    
    # 3. Save JSON maps
    print(f"Saving images classification mapping to {output_images_path}...")
    with open(output_images_path, 'w', encoding='utf-8') as f:
        json.dump(sheet_images, f, indent=2, ensure_ascii=False)
        
    print(f"Saving metadata mapping to {output_meta_path}...")
    with open(output_meta_path, 'w', encoding='utf-8') as f:
        json.dump(meta_info, f, indent=2, ensure_ascii=False)
        
    print("Extraction and classification completed successfully!")

if __name__ == "__main__":
    main()
