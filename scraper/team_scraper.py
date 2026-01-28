"""
CEC Nepal Team Scraper
======================
A beginner-friendly Python script to scrape team member information from cecnepal.com.np

Features:
- Extracts team member name, position, profile image, and bio
- Saves data to both CSV and JSON formats
- Includes polite scraping practices (delays, proper headers)
- Comprehensive error handling
- Beginner-friendly with detailed comments

Author: Your Name
Date: 2026
"""

import requests
from bs4 import BeautifulSoup
import csv
import json
import time
from urllib.parse import urljoin
import logging

# ============================================================================
# LOGGING SETUP - For debugging and tracking execution
# ============================================================================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================================
# CONFIGURATION
# ============================================================================

# Target website
WEBSITE_URL = "https://cecnepal.com.np/"

# HTTP Headers - Makes the request appear like a real browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://cecnepal.com.np/',
    'Connection': 'keep-alive',
}

# Request timeout (seconds)
REQUEST_TIMEOUT = 10

# Delay between requests (seconds) - polite scraping practice
REQUEST_DELAY = 2

# Output files
CSV_OUTPUT = 'cec_team_members.csv'
JSON_OUTPUT = 'cec_team_members.json'

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def clean_text(text):
    """
    Clean extracted text by stripping whitespace and extra spaces.
    
    Args:
        text: Raw text from HTML
        
    Returns:
        Cleaned text string
    """
    if not text:
        return ""
    return ' '.join(text.strip().split())


def fetch_page(url):
    """
    Fetch a webpage with proper headers and error handling.
    
    Args:
        url: URL to fetch
        
    Returns:
        BeautifulSoup object or None if fetch fails
    """
    try:
        logger.info(f"Fetching URL: {url}")
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=REQUEST_TIMEOUT
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        logger.info(f"Successfully fetched: {url} (Status: {response.status_code})")
        return BeautifulSoup(response.content, 'html.parser')
    
    except requests.exceptions.Timeout:
        logger.error(f"Request timeout for {url}")
        return None
    
    except requests.exceptions.ConnectionError:
        logger.error(f"Connection error for {url}")
        return None
    
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP error: {e.response.status_code} for {url}")
        return None
    
    except Exception as e:
        logger.error(f"Unexpected error fetching {url}: {str(e)}")
        return None


def extract_team_members(soup):
    """
    Extract team member information from BeautifulSoup object.
    
    Common HTML structures for team sections:
    - .team-member, .team-item, .team-card classes
    - .member-name, .member-role, .member-bio
    - img tags with src for profile images
    
    Args:
        soup: BeautifulSoup object of the webpage
        
    Returns:
        List of dictionaries containing team member data
    """
    
    team_members = []
    
    # List of possible CSS selectors for team sections
    # Try different selectors in order of likelihood
    team_selectors = [
        '.team-member',
        '.team-item',
        '.team-card',
        '[class*="team"]',
        '.member-card',
        '.staff-member',
    ]
    
    # Try each selector
    for selector in team_selectors:
        try:
            members = soup.select(selector)
            if members:
                logger.info(f"Found {len(members)} team members using selector: {selector}")
                
                for member_element in members:
                    try:
                        member_data = extract_member_data(member_element)
                        if member_data.get('name'):  # Only add if name exists
                            team_members.append(member_data)
                    
                    except Exception as e:
                        logger.warning(f"Error extracting member data: {str(e)}")
                        continue
                
                # If we found members with this selector, return them
                if team_members:
                    return team_members
        
        except Exception as e:
            logger.debug(f"Selector {selector} failed: {str(e)}")
            continue
    
    # If no members found, log warning
    if not team_members:
        logger.warning("No team members found using standard selectors")
        logger.info("Attempting fallback extraction methods...")
        team_members = extract_team_members_fallback(soup)
    
    return team_members


def extract_member_data(element):
    """
    Extract individual team member data from HTML element.
    
    Args:
        element: BeautifulSoup element containing team member info
        
    Returns:
        Dictionary with member data
    """
    
    member_data = {
        'name': '',
        'position': '',
        'image_url': '',
        'bio': ''
    }
    
    try:
        # Extract name - try multiple selectors
        name_selectors = [
            '.member-name', '.name', 'h3', 'h4',
            '[class*="name"]', '[class*="title"]'
        ]
        
        for selector in name_selectors:
            name_elem = element.select_one(selector)
            if name_elem:
                member_data['name'] = clean_text(name_elem.get_text())
                break
        
        # Extract position/role
        position_selectors = [
            '.member-position', '.position', '.role',
            '[class*="position"]', '[class*="role"]'
        ]
        
        for selector in position_selectors:
            pos_elem = element.select_one(selector)
            if pos_elem:
                member_data['position'] = clean_text(pos_elem.get_text())
                break
        
        # Extract profile image
        img_elem = element.select_one('img')
        if img_elem:
            img_src = img_elem.get('src', '')
            if img_src:
                # Convert relative URLs to absolute
                member_data['image_url'] = urljoin(WEBSITE_URL, img_src)
        
        # Extract bio/description
        bio_selectors = [
            '.member-bio', '.bio', '.description',
            '[class*="bio"]', '[class*="description"]', 'p'
        ]
        
        for selector in bio_selectors:
            bio_elem = element.select_one(selector)
            if bio_elem:
                bio_text = clean_text(bio_elem.get_text())
                if bio_text and len(bio_text) > 10:  # Only if substantial text
                    member_data['bio'] = bio_text
                    break
    
    except Exception as e:
        logger.warning(f"Error extracting member data: {str(e)}")
    
    return member_data


def extract_team_members_fallback(soup):
    """
    Fallback method: Look for common patterns when standard selectors fail.
    
    This method searches for:
    - Divs with images and text
    - Image + nearby text patterns
    - Table rows with team data
    
    Args:
        soup: BeautifulSoup object
        
    Returns:
        List of team member dictionaries
    """
    
    team_members = []
    
    try:
        # Look for divs containing images and text
        all_divs = soup.find_all('div', class_=lambda x: x and 'team' in x.lower())
        
        if all_divs:
            for div in all_divs:
                img = div.find('img')
                if img:
                    member_data = {
                        'name': 'Unknown',
                        'position': 'Unknown',
                        'image_url': urljoin(WEBSITE_URL, img.get('src', '')),
                        'bio': ''
                    }
                    
                    # Get alt text as name
                    if img.get('alt'):
                        member_data['name'] = img.get('alt')
                    
                    # Get nearby text as position/bio
                    text_content = div.get_text(strip=True)
                    if text_content:
                        member_data['bio'] = clean_text(text_content)[:200]
                    
                    if member_data['image_url']:
                        team_members.append(member_data)
    
    except Exception as e:
        logger.warning(f"Fallback extraction error: {str(e)}")
    
    return team_members


def save_to_csv(team_members, filename=CSV_OUTPUT):
    """
    Save team member data to CSV file.
    
    Args:
        team_members: List of team member dictionaries
        filename: Output CSV filename
        
    Returns:
        True if successful, False otherwise
    """
    
    if not team_members:
        logger.warning("No team members to save to CSV")
        return False
    
    try:
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['name', 'position', 'image_url', 'bio']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            writer.writerows(team_members)
        
        logger.info(f"Successfully saved {len(team_members)} members to {filename}")
        return True
    
    except Exception as e:
        logger.error(f"Error saving to CSV: {str(e)}")
        return False


def save_to_json(team_members, filename=JSON_OUTPUT):
    """
    Save team member data to JSON file.
    
    Args:
        team_members: List of team member dictionaries
        filename: Output JSON filename
        
    Returns:
        True if successful, False otherwise
    """
    
    if not team_members:
        logger.warning("No team members to save to JSON")
        return False
    
    try:
        data = {
            'total_members': len(team_members),
            'scraped_from': WEBSITE_URL,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'team_members': team_members
        }
        
        with open(filename, 'w', encoding='utf-8') as jsonfile:
            json.dump(data, jsonfile, indent=2, ensure_ascii=False)
        
        logger.info(f"Successfully saved {len(team_members)} members to {filename}")
        return True
    
    except Exception as e:
        logger.error(f"Error saving to JSON: {str(e)}")
        return False


def print_results(team_members):
    """
    Print extracted team members to console in a nice format.
    
    Args:
        team_members: List of team member dictionaries
    """
    
    if not team_members:
        logger.warning("No team members to display")
        return
    
    print("\n" + "="*80)
    print(f"EXTRACTED TEAM MEMBERS ({len(team_members)} total)")
    print("="*80 + "\n")
    
    for i, member in enumerate(team_members, 1):
        print(f"[{i}] Name: {member.get('name', 'N/A')}")
        print(f"    Position: {member.get('position', 'N/A')}")
        print(f"    Image URL: {member.get('image_url', 'N/A')}")
        if member.get('bio'):
            bio_preview = member['bio'][:100] + "..." if len(member['bio']) > 100 else member['bio']
            print(f"    Bio: {bio_preview}")
        print()
    
    print("="*80 + "\n")


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """
    Main function to orchestrate the scraping process.
    """
    
    print("\n" + "="*80)
    print("CEC NEPAL TEAM MEMBER SCRAPER")
    print("="*80 + "\n")
    
    # Step 1: Fetch the webpage
    logger.info("Step 1: Fetching website...")
    soup = fetch_page(WEBSITE_URL)
    
    if not soup:
        logger.error("Failed to fetch website. Exiting.")
        return
    
    # Step 2: Polite delay before scraping
    logger.info(f"Step 2: Waiting {REQUEST_DELAY} seconds (polite scraping practice)...")
    time.sleep(REQUEST_DELAY)
    
    # Step 3: Extract team members
    logger.info("Step 3: Extracting team member information...")
    team_members = extract_team_members(soup)
    
    if not team_members:
        logger.warning("No team members were extracted. This might mean:")
        logger.warning("  - The website structure has changed")
        logger.warning("  - Team section uses dynamic content (JavaScript)")
        logger.warning("  - Try checking the website manually to inspect HTML")
        return
    
    # Step 4: Display results
    logger.info("Step 4: Displaying results...")
    print_results(team_members)
    
    # Step 5: Save to CSV
    logger.info("Step 5: Saving to CSV...")
    csv_success = save_to_csv(team_members)
    
    # Step 6: Save to JSON
    logger.info("Step 6: Saving to JSON...")
    json_success = save_to_json(team_members)
    
    # Summary
    print("\n" + "="*80)
    print("SCRAPING COMPLETE")
    print("="*80)
    print(f"✓ Team members extracted: {len(team_members)}")
    print(f"{'✓' if csv_success else '✗'} CSV file saved: {CSV_OUTPUT}")
    print(f"{'✓' if json_success else '✗'} JSON file saved: {JSON_OUTPUT}")
    print("="*80 + "\n")


# ============================================================================
# DEBUGGING TIPS
# ============================================================================
"""
DEBUGGING TIPS:
===============

1. If no team members are found:
   - Open https://cecnepal.com.np/ in your browser
   - Right-click on a team member and select "Inspect" or "Inspect Element"
   - Look for common patterns in the HTML (class names, ids, structure)
   - Update the selectors in extract_team_members() function
   
2. To see detailed logs:
   - The script already logs all actions
   - Check the console output for warnings/errors
   
3. To test individual selectors:
   - Modify the team_selectors list in extract_team_members()
   - Add your own custom selectors based on the website structure
   
4. Common CSS selectors to try:
   - '.team-member', '.team-item', '.team-card'
   - '[class*="team"]' - any class containing 'team'
   - '.member-item', '.staff-member'
   
5. To inspect what the soup contains:
   - Uncomment the line below and run the script:
     print(soup.prettify()[:5000])  # First 5000 characters
   
6. If the website uses JavaScript to load content:
   - The script won't capture dynamically loaded content
   - You would need Selenium or Playwright instead
   - For beginner: Use Selenium with Chrome webdriver
"""

if __name__ == '__main__':
    main()
