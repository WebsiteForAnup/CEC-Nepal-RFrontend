# CEC Nepal - Backend Data API Documentation

## Overview
This directory contains all JSON data files for the CEC Nepal website. These files can be used to:
- Seed a database for backend development
- Serve as a REST API reference
- Build a complete backend system
- Create mock API responses for testing

## Available Data Files

### 1. **services.json**
All services offered by CEC Nepal
- 6 main service categories
- Icon references using FontAwesome
- Image paths and descriptions

### 2. **projects.json**
Complete project portfolio
- Project name, capacity, developer
- Status tracking (Generation, Under Construction, PPA Stage)
- CEC services provided
- Location and project type information

### 3. **team.json**
Team members organized by category
- Board of Directors
- Key Personnel (CEO)
- Technical Directors
- Engineering & Project Team
- Includes: name, designation, education, experience, biography, image URLs

### 4. **statistics.json**
Company key metrics
- Projects completed
- MW capacity developed
- Team size
- Years of experience

### 5. **faq.json**
Frequently asked questions
- Organized by categories
- Q&A pairs for website FAQ section

### 6. **company.json**
Company information
- Name, tagline, founded year
- Contact details
- Mission, vision, values
- Social media links
- Overall statistics

### 7. **about.json**
About page content
- Company history and mission
- Areas of expertise
- Team information
- Type: news or event
- Categorized content
- Dates, images, excerpts
### 10. **gallery.json**
### 12. **api-schema.json**
- Image title and category
### 11. **downloads.json**
### 13. **database-schema.json**
- Resource title, category, file type
- Download URLs and icons
- Categories: Templates, Guidelines, Checklists, Company, Standards, Publications, Tools, Case Studies, Annual Reports
- File types: PDF, DOCX, XLSX

### 10. **api-schema.json**
API endpoint configuration

### 11. **database-schema.json**
Complete database schema documentation

## Backend Integration Guide

### Option 1: REST API Server

```javascript
// Example Node.js/Express API
const express = require('express');
const app = express();

// Load data
const services = require('./data/services.json');
const projects = require('./data/projects.json');
const team = require('./data/team.json');

// Create endpoints
app.get('/api/services', (req, res) => {
  res.json(services.services);
});

app.get('/api/projects', (req, res) => {
  res.json(projects.projects);
});

app.get('/api/team', (req, res) => {
  res.json(team.team);
});
```

### Option 2: Database Seeding

Use these JSON files to seed your MongoDB, PostgreSQL, or other database:

```javascript
// MongoDB seeding example
const mongoose = require('mongoose');
const servicesData = require('./data/services.json');

await db.collection('services').insertMany(servicesData.services);
```

### Option 3: Static File Serving

Serve JSON files directly from `/api/data/` endpoint:

```javascript
app.use('/api/data', express.static('src/data'));
```

## Data Structure Standards

All JSON files follow this structure:
- Root key representing the collection name
- Array or object containing items
- Consistent field naming (camelCase)
- Standardized data types

## API Endpoints Reference

| Endpoint | Data File | Returns |
|----------|-----------|---------|
| `/api/services` | services.json | All services array |
| `/api/projects` | projects.json | All projects array |
| `/api/projects?status=Generation` | projects.json | Filtered projects |
| `/api/team` | team.json | Team by category |
| `/api/faq` | faq.json | All FAQs array |
| `/api/statistics` | statistics.json | Company stats |
| `/api/company` | company.json | Company info |
| `/api/news-events` | newsAndEvents.json | News & events |
| `/api/about` | about.json | About page data |
| `/api/navigation` | navigation.json | Navigation structure |

## Filter Examples

### Projects
```json
{
  "status": "Generation",
  "type": "Hydropower",
  "location": "Eastern Nepal"
}
```

### Team
```json
{
  "category": "Board of Directors"
}
```

### News/Events
```json
{
  "type": "event",
  "category": "Workshop"
}
```

## Frontend Integration

React components can import data directly:

```javascript
import services from '../data/services.json';
import projects from '../data/projects.json';

const Services = () => {
  return (
    <div>
      {services.services.map(service => (
        <ServiceCard key={service.id} {...service} />
      ))}
    </div>
  );
};
```

## Database Schema

See `database-schema.json` for complete field definitions, data types, and constraints for each collection.

## Adding New Data

When adding new entries:
1. Maintain consistent field structure
2. Increment IDs sequentially
3. Use proper data types
4. Include required fields
5. Update database-schema.json if adding new fields

## Version Control

- Keep JSON files formatted consistently
- Use 2-space indentation
- Validate JSON before committing
- Document schema changes in database-schema.json

## Support

For questions about data structure or backend integration, refer to database-schema.json or contact the development team.
