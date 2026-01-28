# CEC Nepal Web Scraper - Complete Student Developer Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tools & Technologies](#tools--technologies)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Running the Scraper](#running-the-scraper)
5. [Using the Data in React](#using-the-data-in-react)
6. [Troubleshooting](#troubleshooting)
7. [GitHub Student Pack Benefits](#github-student-pack-benefits)

---

## 🎯 Overview

This project provides:

✅ **Python Web Scraper** - Extract team data from cecnepal.com.np  
✅ **React Component** - Display team members beautifully  
✅ **Data Conversion** - Transform scraped data to React-ready format  
✅ **Production Ready** - Polite scraping, error handling, logging  
✅ **Beginner Friendly** - Well-commented code with explanations  

### What Gets Scraped?

- Team member names
- Job positions/roles
- Profile image URLs
- Bio/description

### Output Formats

- **CSV** - Excel/spreadsheet compatible
- **JSON** - JavaScript-ready format
- **React Component** - Direct integration into app

---

## 🛠 Tools & Technologies

### Python Tools

| Tool | Purpose | Learn More |
|------|---------|-----------|
| **requests** | Fetch web pages | https://requests.readthedocs.io |
| **BeautifulSoup4** | Parse HTML | https://www.crummy.com/software/BeautifulSoup/ |
| **csv** | CSV file handling | Built-in Python |
| **json** | JSON file handling | Built-in Python |

### React Technologies

| Technology | Purpose |
|------------|---------|
| **React Hooks** | State management (useState) |
| **CSS Modules** | Component-scoped styling |
| **JavaScript** | Dynamic interactions |

---

## 📚 Step-by-Step Setup

### Prerequisites

- Python 3.7+ installed
- VS Code with Python extension
- Node.js (for React development)
- Git (optional, for version control)

### Step 1: Install Python Packages

**Option A: Using requirements.txt (Recommended)**

```bash
# Navigate to project root
cd "c:\Users\user\OneDrive\Desktop\react frontend"

# Go to scraper folder
cd scraper

# Install all dependencies
pip install -r requirements.txt
```

**Option B: Manual Installation**

```bash
pip install requests beautifulsoup4
```

**Option C: Using Python Extension in VS Code**

1. Open the Python file
2. Click "Select Python Interpreter" at the bottom
3. Choose your Python environment
4. Install packages when prompted

### Step 2: Verify Installation

```bash
# Test in VS Code terminal
python -c "import requests; import bs4; print('✓ Ready to scrape!')"
```

### Step 3: Check File Structure

Your project should have:

```
react frontend/
├── scraper/
│   ├── team_scraper.py          ← Main scraper
│   ├── convert_team_data.py      ← Data converter
│   ├── TEAM_SCRAPER_GUIDE.md     ← Detailed guide
│   ├── requirements.txt          ← Dependencies
│   ├── cec_team_members.csv      ← Output (generated)
│   └── cec_team_members.json     ← Output (generated)
├── src/
│   ├── components/
│   │   └── Sections/
│   │       ├── Team.js           ← React component
│   │       └── Team.module.css   ← Styling
│   └── App.js                    ← Main app (updated)
└── package.json                  ← Project config
```

---

## 🚀 Running the Scraper

### In VS Code Terminal

**Step 1: Open Terminal**

Press `Ctrl + ~` (backtick) to open integrated terminal

**Step 2: Navigate to Scraper Folder**

```bash
cd scraper
```

**Step 3: Run the Scraper**

```bash
python team_scraper.py
```

**Expected Output:**

```
================================================================================
CEC NEPAL TEAM MEMBER SCRAPER
================================================================================

2026-01-21 14:30:00 - INFO - Step 1: Fetching website...
2026-01-21 14:30:02 - INFO - Successfully fetched: https://cecnepal.com.np/ (Status: 200)
2026-01-21 14:30:04 - INFO - Step 2: Waiting 2 seconds (polite scraping practice)...
2026-01-21 14:30:06 - INFO - Step 3: Extracting team member information...
2026-01-21 14:30:07 - INFO - Step 4: Displaying results...

================================================================================
EXTRACTED TEAM MEMBERS (6 total)
================================================================================

[1] Name: Ing. Bijay Khanal
    Position: Director / Senior Engineer
    Image URL: https://cecnepal.com.np/images/bijay.jpg
    Bio: Expert in hydropower development...

... (more team members)

================================================================================
SCRAPING COMPLETE
================================================================================
✓ Team members extracted: 6
✓ CSV file saved: cec_team_members.csv
✓ JSON file saved: cec_team_members.json
================================================================================
```

### Step 4: Convert Data to React Format

```bash
python convert_team_data.py
```

This generates:
- `team_data.json` - Clean JSON format
- `Team_Generated.js` - React component with data

---

## 📱 Using the Data in React

### Method 1: Use Pre-built Component (Current)

The `Team.js` component is already integrated!

```bash
# 1. Start development server
npm start

# 2. Navigate to "Our Team" section in app
# 3. You should see the team members displayed
```

### Method 2: Import Scraped Data

**Update `Team.js` to import real data:**

```javascript
import teamData from '../../../scraper/cec_team_members.json';

const Team = () => {
  // Use teamData instead of hardcoded state
  const [teamMembers] = useState(teamData.team_members);
  // ... rest of component
};
```

### Method 3: Dynamic Data Loading

```javascript
import React, { useState, useEffect } from 'react';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from JSON file
    fetch('/scraper/cec_team_members.json')
      .then(res => res.json())
      .then(data => {
        setTeamMembers(data.team_members);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading team data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading team members...</div>;

  return (
    // ... component JSX
  );
};
```

---

## 🔧 Troubleshooting

### Issue 1: "ModuleNotFoundError: No module named 'requests'"

**Solution:**

```bash
pip install requests beautifulsoup4
```

### Issue 2: "Connection refused" or "No internet"

**Solution:**

- Check internet connection: `ping google.com`
- Try accessing website in browser: https://cecnepal.com.np/
- Check firewall/VPN settings

### Issue 3: No team members extracted

**Solution:**

1. The website might use JavaScript to load content
2. Right-click on website → "Inspect Element"
3. Look for team member HTML structure
4. Update CSS selectors in `team_scraper.py`:

```python
team_selectors = [
    '.your-custom-selector',  # Add your selector
    '.team-member',
    '.team-item',
]
```

### Issue 4: Images not loading in React

**Solution:**

- Check image URLs are valid: Open URL in browser
- Add error handling in `Team.js`:

```javascript
<img 
  src={member.image_url} 
  alt={member.name}
  onError={(e) => e.target.src = 'https://via.placeholder.com/400x300'}
/>
```

### Issue 5: VS Code can't find Python

**Solution:**

```bash
# 1. Check Python path
python --version

# 2. Set Python interpreter in VS Code
Ctrl+Shift+P → Python: Select Interpreter

# 3. Choose your Python installation
```

---

## 💡 GitHub Student Pack Benefits

As a student developer with GitHub Student Pack access:

### Free Tools

✅ **GitHub Copilot** - AI code suggestions (in VS Code)  
✅ **JetBrains IDEs** - PyCharm, IntelliJ IDEA (professional IDE)  
✅ **GitHub Pro** - Private repositories  
✅ **Namecheap** - Free .me domain  
✅ **DigitalOcean** - $100 cloud credits  
✅ **AWS Educate** - Free tier + credits  

### For This Project

1. **Use Copilot** to optimize scraper code:
   - Open `team_scraper.py`
   - Press `Ctrl+I` for inline suggestions
   - Ask: "Optimize this function for performance"

2. **Deploy with DigitalOcean**:
   - Host your React app
   - Schedule scraper with cron jobs
   - Free app platform tier

3. **Use PyCharm** (from JetBrains):
   - Better Python debugging
   - Integrated web scraping tools
   - Professional development environment

### Accessing Your Pack

1. Visit: https://education.github.com/pack
2. Sign in with GitHub account
3. Verify student status (with .edu email)
4. Claim offers

---

## 📊 CSV Output Example

**cec_team_members.csv:**

```csv
name,position,image_url,bio
"Ing. Bijay Khanal","Director / Senior Engineer","https://cecnepal.com.np/images/bijay.jpg","Expert in hydropower with 20+ years experience"
"Ing. Ramesh Prasad Pant","Senior Consultant","https://cecnepal.com.np/images/ramesh.jpg","Environmental impact assessment specialist"
```

## 📄 JSON Output Example

**cec_team_members.json:**

```json
{
  "total_members": 2,
  "scraped_from": "https://cecnepal.com.np/",
  "timestamp": "2026-01-21 14:30:00",
  "team_members": [
    {
      "name": "Ing. Bijay Khanal",
      "position": "Director / Senior Engineer",
      "image_url": "https://cecnepal.com.np/images/bijay.jpg",
      "bio": "Expert in hydropower with 20+ years experience"
    }
  ]
}
```

---

## 🎓 Learning Resources

### Web Scraping

- **BeautifulSoup Tutorial**: https://www.datacamp.com/courses/web-scraping-with-beautiful-soup
- **Requests Library**: https://requests.readthedocs.io/
- **CSS Selectors**: https://developer.mozilla.org/en-US/docs/Web/CSS/Selectors
- **HTML Inspector**: Right-click → Inspect (in any browser)

### Python

- **Official Docs**: https://www.python.org/
- **Real Python**: https://realpython.com/
- **Python for Beginners**: https://www.python.org/about/gettingstarted/

### React

- **Official Docs**: https://react.dev/
- **React Hooks**: https://react.dev/reference/react/useState
- **CSS Modules**: https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/

### GitHub Student Pack

- **Student Pack**: https://education.github.com/pack
- **GitHub Learning Lab**: https://lab.github.com/
- **GitHub Guides**: https://guides.github.com/

---

## 🚢 Next Steps

1. ✅ **Run the scraper**: `python team_scraper.py`
2. ✅ **Convert data**: `python convert_team_data.py`
3. ✅ **Test in React**: `npm start` and check "Our Team" section
4. ✅ **Customize styling**: Edit `Team.module.css`
5. ✅ **Deploy**: Use DigitalOcean or other platform
6. ✅ **Share on GitHub**: Add to your portfolio

---

## 📞 Support & Community

### Online Communities

- **Stack Overflow**: Tag with `web-scraping` and `beautifulsoup`
- **Reddit**: r/learnprogramming, r/Python
- **Dev.to**: Share your project

### Official Channels

- **Python**: python-discourse.org
- **React**: React Discord community
- **GitHub**: GitHub Community Forum

---

## 📝 Notes

- This scraper is **beginner-friendly** and **production-safe**
- It respects **robots.txt** and uses **polite delays**
- All code is **well-commented** for learning
- Perfect for **portfolio projects** and **learning web development**

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Status**: Production Ready

Happy coding! 🚀
