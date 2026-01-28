"""
CEC Nepal Web Scraper
=====================
A comprehensive web scraper for https://cecnepal.com.np/
Extracts company info, services, projects, and contact details.

Author: Student Developer
Date: January 2026
"""

import requests
from bs4 import BeautifulSoup
import json
import csv
import time
import logging
from datetime import datetime
from urllib.parse import urljoin
import os

# ============================================
# CONFIGURATION
# ============================================

BASE_URL = "https://cecnepal.com.np/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
}

# Delay between requests (in seconds) - BE RESPECTFUL!
REQUEST_DELAY = 2

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============================================
# STEP 1: CHECK ROBOTS.TXT (ETHICAL SCRAPING)
# ============================================

def check_robots_txt(base_url):
    """
    Check robots.txt to see what's allowed to scrape.
    Always respect the website's scraping rules!
    """
    robots_url = urljoin(base_url, "/robots.txt")
    try:
        response = requests.get(robots_url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            logger.info("robots.txt found:")
            print("-" * 50)
            print(response.text)
            print("-" * 50)
            return response.text
        else:
            logger.info("No robots.txt found - proceed with caution")
            return None
    except Exception as e:
        logger.warning(f"Could not fetch robots.txt: {e}")
        return None


# ============================================
# STEP 2: FETCH PAGE CONTENT
# ============================================

def fetch_page(url):
    """
    Fetch a webpage with proper error handling and delays.
    """
    try:
        logger.info(f"Fetching: {url}")
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()  # Raise exception for bad status codes
        
        # Respectful delay between requests
        time.sleep(REQUEST_DELAY)
        
        return BeautifulSoup(response.text, 'html.parser')
    
    except requests.exceptions.Timeout:
        logger.error(f"Timeout while fetching {url}")
        return None
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP Error {e.response.status_code} for {url}")
        return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching {url}: {e}")
        return None


# ============================================
# STEP 3: SCRAPING FUNCTIONS
# ============================================

def scrape_homepage(soup):
    """
    Scrape the homepage for company overview information.
    """
    data = {
        "page": "homepage",
        "scraped_at": datetime.now().isoformat(),
        "company_name": "",
        "tagline": "",
        "about_summary": "",
        "stats": [],
        "objectives": [],
        "vision": "",
        "mission": ""
    }
    
    # Company name
    h2_tags = soup.find_all('h2')
    for h2 in h2_tags:
        text = h2.get_text(strip=True)
        if "Clean Energy Consultants" in text:
            data["company_name"] = text
            break
    
    # Tagline
    for h2 in h2_tags:
        text = h2.get_text(strip=True)
        if "Clean Energy For Generations" in text:
            data["tagline"] = text
            break
    
    # About summary - look for "Who are We?" section
    who_section = soup.find(string=lambda t: t and "Who are We?" in t)
    if who_section:
        parent = who_section.find_parent()
        if parent:
            next_p = parent.find_next('p')
            if next_p:
                data["about_summary"] = next_p.get_text(strip=True)
    
    # Stats (Projects, Staff, Experience)
    stat_items = soup.find_all(string=lambda t: t and ("Project" in str(t) or "Staff" in str(t) or "Experience" in str(t)))
    for item in stat_items:
        text = item.strip() if hasattr(item, 'strip') else str(item)
        if text and len(text) < 50:  # Filter out long text
            data["stats"].append(text)
    
    # Vision
    vision_section = soup.find(string=lambda t: t and "Vision:" in str(t))
    if vision_section:
        parent = vision_section.find_parent()
        if parent:
            next_elem = parent.find_next_sibling()
            if next_elem:
                data["vision"] = next_elem.get_text(strip=True)
    
    # Mission
    mission_section = soup.find(string=lambda t: t and "Mission:" in str(t))
    if mission_section:
        parent = mission_section.find_parent()
        if parent:
            next_elem = parent.find_next_sibling()
            if next_elem:
                data["mission"] = next_elem.get_text(strip=True)
    
    return data


def scrape_services(soup):
    """
    Scrape services offered by the company.
    """
    services = []
    
    # Find service cards/sections
    service_headings = [
        "Feasibility study",
        "Project Development",
        "Detailed Design",
        "Geo Technical",
        "Environmental",
        "Solar",
        "Infrastructure"
    ]
    
    h3_tags = soup.find_all('h3')
    for h3 in h3_tags:
        title = h3.get_text(strip=True)
        description = ""
        
        # Get the description (usually next paragraph)
        next_p = h3.find_next('p')
        if next_p:
            description = next_p.get_text(strip=True)
        
        # Filter to relevant services
        if any(keyword.lower() in title.lower() for keyword in service_headings) or len(title) > 5:
            if title and "MW" not in title:  # Exclude project MW entries
                services.append({
                    "title": title,
                    "description": description[:500] if description else ""
                })
    
    return services


def scrape_projects(soup):
    """
    Scrape project information.
    """
    projects = []
    
    # Find all project entries (usually in h3 tags with MW)
    h3_tags = soup.find_all('h3')
    
    for h3 in h3_tags:
        text = h3.get_text(strip=True)
        
        # Projects usually have HEP, HPP, or MW in their names
        if any(keyword in text for keyword in ['HEP', 'HPP', 'Hydropower', 'Solar', 'MW']):
            project = {
                "name": text,
                "capacity": ""
            }
            
            # Find capacity (usually next element with MW)
            next_elem = h3.find_next_sibling()
            if next_elem:
                capacity_text = next_elem.get_text(strip=True)
                if 'MW' in capacity_text:
                    project["capacity"] = capacity_text
            
            projects.append(project)
    
    return projects


def scrape_partners(soup):
    """
    Scrape partner/client names from images.
    """
    partners = []
    
    # Partners are usually shown as images with alt text
    partner_section = soup.find(string=lambda t: t and "Partner" in str(t))
    if partner_section:
        parent = partner_section.find_parent()
        if parent:
            images = parent.find_all_next('img', limit=30)
            for img in images:
                alt = img.get('alt', '')
                if alt and alt not in ['', 'Image']:
                    partners.append(alt)
    
    return partners


def scrape_contact_info(soup):
    """
    Scrape contact information.
    """
    contact = {
        "emails": [],
        "phones": [],
        "address": "",
        "social_links": []
    }
    
    # Find email addresses
    import re
    text = soup.get_text()
    emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    contact["emails"] = list(set(emails))
    
    # Find phone numbers (Nepal format)
    phones = re.findall(r'[\+]?[9][7][7][-\s]?\d{9,10}|\d{10}', text)
    contact["phones"] = list(set(phones))
    
    # Social links
    social_links = soup.find_all('a', href=True)
    for link in social_links:
        href = link.get('href', '')
        if any(social in href for social in ['facebook', 'linkedin', 'twitter', 'instagram']):
            contact["social_links"].append(href)
    
    return contact


# ============================================
# STEP 4: SCRAPE ADDITIONAL PAGES
# ============================================

def scrape_all_pages():
    """
    Scrape multiple pages of the website.
    """
    all_data = {
        "website": BASE_URL,
        "scraped_at": datetime.now().isoformat(),
        "homepage": {},
        "services": [],
        "projects": [],
        "partners": [],
        "contact": {}
    }
    
    # Check robots.txt first
    print("\n" + "="*50)
    print("CHECKING ROBOTS.TXT")
    print("="*50)
    check_robots_txt(BASE_URL)
    
    # Scrape homepage
    print("\n" + "="*50)
    print("SCRAPING HOMEPAGE")
    print("="*50)
    soup = fetch_page(BASE_URL)
    if soup:
        all_data["homepage"] = scrape_homepage(soup)
        all_data["services"] = scrape_services(soup)
        all_data["projects"] = scrape_projects(soup)
        all_data["partners"] = scrape_partners(soup)
        all_data["contact"] = scrape_contact_info(soup)
    
    # Scrape projects page
    print("\n" + "="*50)
    print("SCRAPING PROJECTS PAGE")
    print("="*50)
    projects_url = urljoin(BASE_URL, "/projects/")
    soup = fetch_page(projects_url)
    if soup:
        additional_projects = scrape_projects(soup)
        all_data["projects"].extend(additional_projects)
    
    # Scrape about page
    print("\n" + "="*50)
    print("SCRAPING ABOUT PAGE")
    print("="*50)
    about_url = urljoin(BASE_URL, "/about-us/")
    soup = fetch_page(about_url)
    if soup:
        about_data = scrape_homepage(soup)
        if about_data.get("about_summary"):
            all_data["homepage"]["about_detail"] = about_data["about_summary"]
    
    # Remove duplicates from projects
    seen = set()
    unique_projects = []
    for p in all_data["projects"]:
        if p["name"] not in seen:
            seen.add(p["name"])
            unique_projects.append(p)
    all_data["projects"] = unique_projects
    
    return all_data


# ============================================
# STEP 5: SAVE DATA TO JSON
# ============================================

def save_to_json(data, filename="cec_nepal_data.json"):
    """
    Save scraped data to JSON file.
    """
    filepath = os.path.join(os.path.dirname(__file__), filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    logger.info(f"Data saved to {filepath}")
    print(f"\n✅ JSON saved: {filepath}")


# ============================================
# STEP 6: SAVE DATA TO CSV
# ============================================

def save_to_csv(data, base_filename="cec_nepal"):
    """
    Save scraped data to multiple CSV files.
    """
    output_dir = os.path.dirname(__file__)
    
    # Save services to CSV
    services_file = os.path.join(output_dir, f"{base_filename}_services.csv")
    with open(services_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['title', 'description'])
        writer.writeheader()
        for service in data.get("services", []):
            writer.writerow(service)
    print(f"✅ Services CSV saved: {services_file}")
    
    # Save projects to CSV
    projects_file = os.path.join(output_dir, f"{base_filename}_projects.csv")
    with open(projects_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['name', 'capacity'])
        writer.writeheader()
        for project in data.get("projects", []):
            writer.writerow(project)
    print(f"✅ Projects CSV saved: {projects_file}")
    
    # Save partners to CSV
    partners_file = os.path.join(output_dir, f"{base_filename}_partners.csv")
    with open(partners_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['partner_name'])
        for partner in data.get("partners", []):
            writer.writerow([partner])
    print(f"✅ Partners CSV saved: {partners_file}")


# ============================================
# STEP 7: MAIN EXECUTION
# ============================================

def main():
    """
    Main function to run the scraper.
    """
    print("\n" + "="*60)
    print("  CEC NEPAL WEB SCRAPER")
    print("  Website: https://cecnepal.com.np/")
    print("="*60)
    
    try:
        # Scrape all data
        data = scrape_all_pages()
        
        # Save to JSON
        save_to_json(data)
        
        # Save to CSV
        save_to_csv(data)
        
        # Print summary
        print("\n" + "="*60)
        print("  SCRAPING COMPLETE - SUMMARY")
        print("="*60)
        print(f"  • Services found: {len(data.get('services', []))}")
        print(f"  • Projects found: {len(data.get('projects', []))}")
        print(f"  • Partners found: {len(data.get('partners', []))}")
        print(f"  • Contact emails: {len(data.get('contact', {}).get('emails', []))}")
        print("="*60 + "\n")
        
        return data
        
    except KeyboardInterrupt:
        logger.info("Scraping interrupted by user")
    except Exception as e:
        logger.error(f"Scraping failed: {e}")
        raise


if __name__ == "__main__":
    main()
