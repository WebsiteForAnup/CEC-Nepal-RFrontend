# Project Images

Add your project images to this folder with the following naming convention:

## Example Images Already Configured:
- `kabeli-b.jpg` - Kabeli-B HEP project
- `jogmai.jpg` - Jogmai Khola SHP project  
- `upper-puwa.jpg` - Upper Puwa I SHP project

## Image Guidelines:
- **Recommended size:** 800x600 pixels or similar aspect ratio (4:3)
- **Format:** JPG or PNG
- **File size:** Keep under 500KB for optimal loading
- **Naming:** Use lowercase with hyphens (e.g., `project-name.jpg`)

## How to Add More Images:

1. Add your project image files to this folder
2. Update the project data in `src/components/Sections/Projects.js`
3. Add the `image` and `description` fields to any project:

```javascript
{
  id: 1, 
  name: 'Project Name',
  capacity: '25 MW',
  developer: 'Company Name',
  status: 'Generation',
  cecInputs: 'FSR/DPR',
  image: '/images/projects/your-image.jpg',  // Add this
  description: 'Brief description of the project...'  // Add this
}
```

Projects without images will display in the compact format without the image section.
