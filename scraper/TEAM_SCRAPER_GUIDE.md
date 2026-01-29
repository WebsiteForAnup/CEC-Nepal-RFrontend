# CEC Nepal Team Scraper - Complete Guide

## Overview

This Python script scrapes team member information from the CEC Nepal website (https://cecnepal.com.np/) and exports the data to both **CSV** and **JSON** formats.

### What This Script Does

✅ Extracts team member data from the website  
✅ Handles missing fields gracefully  
✅ Saves data to CSV and JSON formats  
✅ Uses polite scraping practices (proper headers, delays)  
✅ Includes comprehensive error handling  
✅ Provides detailed logging for debugging  

### Extracted Data Fields

- **Name**: Team member's full name
- **Position**: Job title or role
- **Image URL**: Link to profile picture
- **Bio**: Short description or bio (if available)

---

## Installation & Setup

### Step 1: Install Required Python Packages

Open Terminal in VS Code and run:

```bash
# Navigate to scraper directory
cd scraper

# Install required packages
pip install requests beautifulsoup4

# Or install all at once
pip install -r requirements.txt
```

### Step 2: Verify Installation

```bash
python -c "import requests; import bs4; print('✓ All packages installed successfully!')"
```

---

## Running the Script in VS Code

### Method 1: Using VS Code Terminal (Recommended)

1. **Open Terminal in VS Code**
   - Press `Ctrl + ~` (backtick) to open integrated terminal
   - Or go to `View > Terminal`

2. **Navigate to scraper folder**
   ```bash
   cd scraper
   ```

3. **Run the script**
   ```bash
   python team_scraper.py
   ```

4. **Check output files**
   - `cec_team_members.csv` - Spreadsheet format
   - `cec_team_members.json` - JSON format

### Method 2: Using VS Code Run Button

1. Open `team_scraper.py`
2. Click the **Run** button (▶) in the top-right corner
3. View output in the integrated terminal

### Method 3: Using Python Extension

1. Right-click on `team_scraper.py`
2. Select "Run Python File in Terminal"

---

## Output Files

### CSV Format (`cec_team_members.csv`)

```csv
name,position,image_url,bio
John Doe,Senior Engineer,https://example.com/john.jpg,"Expert in hydropower design"
Jane Smith,Project Manager,https://example.com/jane.jpg,"10+ years of experience"
```

### JSON Format (`cec_team_members.json`)

```json
{
  "total_members": 2,
  "scraped_from": "https://cecnepal.com.np/",
  "timestamp": "2026-01-21 14:30:00",
  "team_members": [
    {
      "name": "John Doe",
      "position": "Senior Engineer",
      "image_url": "https://example.com/john.jpg",
      "bio": "Expert in hydropower design"
    },
    {
      "name": "Jane Smith",
      "position": "Project Manager",
      "image_url": "https://example.com/jane.jpg",
      "bio": "10+ years of experience"
    }
  ]
}
```

---

## Script Features & Explanation

### 1. Polite Scraping Practices

The script includes several features that make it respectful to the website:

```python
# Realistic browser headers
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    'Accept': 'text/html,application/xhtml+xml...',
}

# Delay between requests
REQUEST_DELAY = 2  # Wait 2 seconds before scraping

# Timeout to avoid hanging
REQUEST_TIMEOUT = 10  # 10 second timeout
```

### 2. Error Handling

The script handles various error scenarios:

- **Connection errors**: If website is unreachable
- **Timeout errors**: If response takes too long
- **HTTP errors**: 404, 500, etc.
- **Parsing errors**: If HTML structure is unexpected
- **Missing fields**: If some data isn't available

### 3. Flexible HTML Parsing

The script tries multiple CSS selectors to find team members:

```python
team_selectors = [
    '.team-member',      # Primary selector
    '.team-item',        # Alternative 1
    '.team-card',        # Alternative 2
    '[class*="team"]',   # Any class containing 'team'
    '.member-card',      # Alternative 3
    '.staff-member',     # Alternative 4
]
```

This makes it work even if the website structure changes slightly.

### 4. Fallback Methods

If standard selectors fail, the script attempts fallback extraction by looking for patterns like images with nearby text.

---

## Debugging Guide

### Problem: No team members found

**Solution 1: Inspect the website manually**

1. Open https://cecnepal.com.np/ in your browser
2. Scroll to "Our Team" section
3. Right-click on a team member → "Inspect" or "Inspect Element"
4. Look for class names or IDs (e.g., `class="team-member"`)
5. Update the `team_selectors` list in `team_scraper.py`

**Solution 2: Check if content is dynamic**

If team members are loaded with JavaScript:
- The requests library won't capture them
- You'll need Selenium (more advanced)
- For now, check the website manually

### Problem: Some fields are missing

The script already handles this and saves empty strings for missing data.

### Problem: Script runs but connection fails

**Possible causes:**
- No internet connection
- Website is down
- Your network blocks the connection

**Solution:**
- Check your internet connection
- Verify website is accessible: `ping cecnepal.com.np`
- Try running with a VPN (if applicable)

### Enable Debug Logging

The script already includes detailed logging. Output shows:

```
2026-01-21 14:30:00 - INFO - Step 1: Fetching website...
2026-01-21 14:30:02 - INFO - Successfully fetched: https://cecnepal.com.np/ (Status: 200)
2026-01-21 14:30:04 - INFO - Found 5 team members using selector: .team-member
```

---

## Code Customization

### Change Output Filename

Edit these lines in `team_scraper.py`:

```python
# Output files
CSV_OUTPUT = 'my_custom_name.csv'
JSON_OUTPUT = 'my_custom_name.json'
```

### Adjust Delay Between Requests

```python
REQUEST_DELAY = 5  # Increase to 5 seconds (more polite)
```

### Add Custom CSS Selector

If you find a better selector, add it to the list:

```python
team_selectors = [
    '.my-custom-selector',  # Add your selector here
    '.team-member',
    '.team-item',
    # ... rest of selectors
]
```

### Add More Data Fields

Edit the `extract_member_data()` function to extract additional fields like:
- Email
- Phone
- LinkedIn profile
- Department

---

## Advanced Topics

### Using Selenium for JavaScript Content

If the website loads team members with JavaScript:

```bash
pip install selenium
```

Then use Selenium with Chrome/Firefox webdriver to load the page fully before scraping.

### Scheduling Regular Scrapes

**On Windows (Task Scheduler):**

1. Open Task Scheduler
2. Create Basic Task → Run `python team_scraper.py` daily/weekly

**On Linux/Mac (Cron):**

```bash
# Run every day at 9 AM
0 9 * * * /usr/bin/python3 /path/to/team_scraper.py
```

### Database Integration

Save data to a database instead of files:

```python
import sqlite3

# Create database
conn = sqlite3.connect('team_members.db')
cursor = conn.cursor()

# Insert team members
for member in team_members:
    cursor.execute('''
        INSERT INTO members (name, position, image_url, bio)
        VALUES (?, ?, ?, ?)
    ''', (member['name'], member['position'], member['image_url'], member['bio']))

conn.commit()
conn.close()
```

---

## Production Safety

This script is designed to be **beginner-friendly** and **production-safe**:

✅ **Respects robots.txt**: Uses proper User-Agent  
✅ **Polite delays**: Waits between requests  
✅ **Error handling**: Handles network/parsing errors  
✅ **Read-only**: Only reads data, doesn't modify website  
✅ **Logging**: Tracks all actions for debugging  
✅ **Clean code**: Well-commented and organized  

---

## GitHub Student Developer Pack

As a student developer with GitHub Student Pack access, you have:

- **Free tier**: GitHub Copilot (AI code suggestions)
- **Free credits**: Various cloud platforms
- **Free tools**: Jetbrains IDEs, GitHub Pro, etc.

You can use GitHub Copilot in VS Code to help optimize this script further!

---

## FAQ

**Q: Is web scraping legal?**  
A: Generally yes, if you respect the website's terms of service and robots.txt. This script uses polite practices.

**Q: What if the website structure changes?**  
A: Update the CSS selectors in `team_selectors` list to match the new structure.

**Q: Can I scrape other websites?**  
A: Yes! Modify `WEBSITE_URL` and adjust selectors for other sites.

**Q: Why is the script slow?**  
A: The `REQUEST_DELAY = 2` seconds is intentional (polite scraping). Reduce if you want faster execution.

**Q: How often should I run this?**  
A: Recommend weekly or monthly to get fresh data without overloading the server.

---

## Support & Resources

- **BeautifulSoup Docs**: https://www.crummy.com/software/BeautifulSoup/
- **Requests Library**: https://requests.readthedocs.io/
- **CSS Selectors**: https://developer.mozilla.org/en-US/docs/Web/CSS/Selectors
- **Python Official**: https://www.python.org/
- **GitHub Student Pack**: https://education.github.com/pack

---

## Author Notes

This script is optimized for:
- ✅ Beginners learning Python and web scraping
- ✅ Student developers
- ✅ Educational purposes
- ✅ Portfolio projects

Feel free to modify and extend it for your needs!

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Status**: Production-Ready
