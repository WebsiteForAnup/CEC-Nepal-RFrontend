# CEC Nepal - Frontend

Frontend application for the Consulting Engineers' Consortium (CEC) Nepal website. Built with React.

## Deployment Information

- **Website**: cecnepal.anup.pro.np
- **Remote Location**: `/home/anupadkh/deploy/cec`
- **Server Files**: `./server`
- **Remote Server**: Nginx

## Tech Stack

- React 18
- React Router 6
- CSS Modules
- EmailJS

## Features

- Home Page
- News & Events Detail
- Service Detail
- Project Detail
- Gallery
- Downloads
- Scroll to top functionality

## Installation & Usage

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```
   Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```
   Builds the app for production to the `docs` folder.

## Deployment Requirements

- Nginx configuration
- Certbot for SSL renewal and activation
- Deployment script (YAML)