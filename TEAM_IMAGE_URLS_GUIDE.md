# Team Member Image Links - Reference Guide

## 🖼️ How to Add Profile Images

Each team member now has an `image_url` field where you can paste image links. The field is currently empty (`image_url: ''`).

---

## 📍 Location of Image Fields in Team.js

Find each team member's `image_url` field and replace the empty string with your image URL.

### Format:
```javascript
image_url: 'https://example.com/path-to-image.jpg'
```

---

## 👥 All 23 Team Members with Image Fields

### 🏢 Board of Directors (IDs 1-4)

**ID 1 - Mr. Mani Raj Dahal** (Founder & Director)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 2 - Er. Santosh Dhakal** (Board Director & Electrical Expert)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 3 - Mr. Narayan Poudel** (Finance Director)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 4 - Er. Kosa Raj Chapagain** (Project Director & Board Member)
```javascript
image_url: '',  // ← Add image URL here
```

---

### 🎯 Key Personnel (ID 5)

**ID 5 - Dr. Chhatra Basnet** (Chief Executive Officer - CEO)
```javascript
image_url: '',  // ← Add image URL here
```

---

### 🔬 Technical Directors & Senior Experts (IDs 6-7)

**ID 6 - Dr. Bishnu Raj Baral** (Technical Director – Hydraulics & Sediment Transport)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 7 - Mr. Ghan Bahadur Shrestha** (Geologist / RS & GIS / Tunneling & Geophysics Expert)
```javascript
image_url: '',  // ← Add image URL here
```

---

### 👷 Engineering & Project Team (IDs 8-17)

**ID 8 - Er. Dinesh Silwal** (Construction Engineer)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 9 - Er. K.B. Garamja** (Civil Engineer)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 10 - Er. Rabin Aryal** (Structural Engineer)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 11 - Er. Prajwal Khatiwada** (Electrical Engineer)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 12 - Er. Nanda Lal Pal** (Mechanical Engineer)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 13 - Er. Prajwal Poudel** (Hydropower Engineer)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 14 - Mr. Rajan Mahat** (Engineering Geologist)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 15 - Er. Charchit Khan Thakuri** (Civil Engineer)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 16 - Er. Bharat Bista** (Civil Engineer)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 17 - Er. Suraj Shreesh** (Site Engineer)
```javascript
image_url: '',  // ← Add image URL here
```

---

### 💰 Finance & Support Team (IDs 18-22)

**ID 18 - Ms. Minu Chitrakar** (Draft Person)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 19 - Mr. Pramod Gautam** (Engineering Geologist)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 20 - Mr. Purna Raj Tamang** (Site Engineer)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 21 - Mr. Buddha Raj Tamang** (Assistant Accountant)
```javascript
image_url: '',  // ← Add image URL here
```

**ID 22 - Mr. Karma Raj Tamang** (Head Accountant)
```javascript
image_url: '',  // ← Add image URL here
```

---

## 🔗 Image URL Examples

### From Unsplash (Free Images):
```javascript
image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
```

### From Your Server:
```javascript
image_url: '/images/team/mani-raj-dahal.jpg'
```

### From Cloud Storage (e.g., Cloudinary):
```javascript
image_url: 'https://res.cloudinary.com/your-account/image/upload/v1234567890/team/mani-raj-dahal.jpg'
```

### From AWS S3:
```javascript
image_url: 'https://your-bucket.s3.amazonaws.com/team/mani-raj-dahal.jpg'
```

---

## 📸 Image Display Locations

Each image appears in TWO places:

### 1. **Small Circular Avatar** (Header)
- Size: 50px × 50px
- Shape: Circle
- Location: Left side of member card header
- Visible when card is collapsed

### 2. **Large Profile Image** (Expanded)
- Size: 300px × 300px (responsive)
- Shape: Rounded rectangle (12px border-radius)
- Location: Top of expanded member details
- Visible when card is expanded (user clicks)

---

## 💡 Best Practices for Image URLs

### Image Size Recommendations:
- ✅ Minimum: 200px × 200px
- ✅ Recommended: 400px × 400px
- ✅ Large format: 600px × 600px

### File Format:
- ✅ JPG/JPEG (best for photos)
- ✅ PNG (best for graphics with transparency)
- ✅ WebP (modern, smaller file size)

### File Size:
- ✅ Keep under 500KB for fast loading
- ✅ Optimize using: TinyPNG, ImageOptim, or Cloudinary

### Image Content:
- ✅ Professional headshots (portrait orientation preferred)
- ✅ Good lighting and clarity
- ✅ Consistent background (preferably solid color or blurred)
- ✅ Appropriate business attire

---

## 📝 Step-by-Step: How to Add an Image

### Step 1: Get Image URL
- Upload image to cloud storage (Cloudinary, S3, etc.)
- Copy the full URL

### Step 2: Open Team.js
- File location: `src/components/Sections/Team.js`
- Find the team member by their ID number

### Step 3: Replace Empty String
**Before:**
```javascript
image_url: '',
```

**After:**
```javascript
image_url: 'https://your-image-url.jpg',
```

### Step 4: Save & Refresh
- Save file (Ctrl+S)
- Browser will auto-refresh
- Image appears in team member card

---

## 🎨 Responsive Image Styling

The component automatically handles:

### Desktop View (≥768px):
- Small avatar: 50px circle in header
- Large image: 300px square in expanded view

### Tablet View (768px - 481px):
- Small avatar: 50px circle (maintained)
- Large image: Responsive width, 300px height

### Mobile View (<480px):
- Small avatar: 50px circle (maintained)
- Large image: Full width minus padding, 250px height

---

## ⚠️ Troubleshooting Images

### Image Not Showing?
- ✅ Check URL is complete and valid
- ✅ Test URL in browser to verify access
- ✅ Ensure CORS headers allow external images
- ✅ Check file extension (.jpg, .png, etc.)

### Image Distorted?
- ✅ Ensure source image has square aspect ratio (1:1)
- ✅ Use images optimized for web
- ✅ Consider aspect ratio: portrait (3:4) works better

### Image Loading Slowly?
- ✅ Compress image file size (<200KB)
- ✅ Use CDN or cloud storage
- ✅ Consider using WebP format

---

## 🚀 Quick Reference: Adding Images

1. Copy image URL
2. Open: `src/components/Sections/Team.js`
3. Find: `id: [number]` and member name
4. Replace: `image_url: ''` with `image_url: 'your-url-here'`
5. Save file
6. View in browser

---

## 📊 Summary

- **Total Team Members**: 22
- **Image Fields Added**: 22
- **Format**: URL strings in `image_url` field
- **Display**: 2 sizes (50px avatar + 300px profile)
- **Responsive**: Yes (auto-adjusts for mobile)

---

**Last Updated:** January 21, 2026  
**File:** `src/components/Sections/Team.js`  
**Status:** Ready for image URLs
