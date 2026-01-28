# CEC Nepal Web Scraper

A Python web scraper for extracting data from https://cecnepal.com.np/

## 📋 What This Scraper Extracts

| Data Type | Description |
|-----------|-------------|
| **Company Info** | Name, tagline, about summary, vision, mission |
| **Statistics** | Number of projects, staff, years of experience |
| **Services** | All services with titles and descriptions |
| **Projects** | Project names and capacities (MW) |
| **Partners** | List of partner/client companies |
| **Contact** | Emails, phone numbers, social links |

## 🔍 How to Inspect Elements (for customization)

1. **Open the website** in Chrome/Firefox
2. **Right-click** on any element you want to scrape
3. **Select "Inspect"** to open Developer Tools
4. **Look at the HTML structure:**
   - Find the tag name (`div`, `h2`, `p`, `span`, etc.)
   - Note the `class` or `id` attributes
   - Look at parent/child relationships

### Example:
```html
<h3 class="service-title">Hydropower</h3>
<p class="service-desc">Feasibility studies...</p>
```

In BeautifulSoup:
```python
soup.find('h3', class_='service-title').text
```

## 🚀 Setup & Installation

### Prerequisites
- Python 3.8 or higher
- VS Code with Python extension

### Step 1: Install Python Dependencies
```bash
cd scraper
pip install -r requirements.txt
```

### Step 2: Run the Scraper
```bash
python cec_scraper.py
```

## 📁 Output Files

After running, you'll get:

| File | Format | Contents |
|------|--------|----------|
| `cec_nepal_data.json` | JSON | All scraped data in one file |
| `cec_nepal_services.csv` | CSV | Services list |
| `cec_nepal_projects.csv` | CSV | Projects with capacity |
| `cec_nepal_partners.csv` | CSV | Partner companies |

## ⚖️ Ethical Scraping Guidelines

This scraper follows ethical web scraping practices:

### ✅ What We Do:
- **Check robots.txt** - Respects website's scraping rules
- **Use delays** - 2-second delay between requests
- **Set User-Agent** - Identifies as a browser
- **Handle errors gracefully** - Doesn't crash on failures
- **Limit requests** - Only scrapes necessary pages

### ❌ What NOT to Do:
- Don't scrape too frequently (respect rate limits)
- Don't scrape personal/private data
- Don't redistribute scraped content commercially
- Don't overload the server with requests

## 🔧 Customization

### Change Request Delay
```python
REQUEST_DELAY = 3  # seconds between requests
```

### Add New Pages to Scrape
```python
# In scrape_all_pages() function:
new_page_url = urljoin(BASE_URL, "/new-page/")
soup = fetch_page(new_page_url)
```

### Extract Different Elements
```python
# Find by class
soup.find_all('div', class_='your-class')

# Find by ID
soup.find(id='your-id')

# Find by tag
soup.find_all('h2')

# Find by text content
soup.find(string=lambda t: "keyword" in str(t))
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Connection Error** | Check internet connection, verify URL is accessible |
| **Timeout** | Increase timeout in `fetch_page()` function |
| **Empty Results** | Website structure may have changed; re-inspect HTML |
| **Blocked** | Add more realistic headers, increase delays |
| **Encoding Issues** | Ensure UTF-8 encoding in file operations |

## 📅 Scheduling the Scraper

### Option 1: Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (daily, weekly, etc.)
4. Action: Start a program
5. Program: `python`
6. Arguments: `path\to\cec_scraper.py`

### Option 2: GitHub Actions (see workflow file)
Create `.github/workflows/scrape.yml` in your repo.

## 📜 License

This scraper is for educational purposes only. 
Always respect website terms of service.
