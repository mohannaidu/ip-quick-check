# IP Quick Check

A simple web application that displays your IPv4 address with a copy-to-clipboard functionality. Built with Material Design 3 and optimized for Firebase hosting.

## Features

- Modern Material Design 3 interface with enhanced aesthetics
- Dynamic color theming based on Material You principles
- Web component architecture for better performance and maintainability
- Displays your current IPv4 address with elegant typography
- One-click copy to clipboard functionality
- Multiple IP service providers with automatic fallback for reliability
- Manual retry option if IP detection fails
- Responsive design for all device sizes
- Optimized for fast loading and performance

## Live Demo

Visit [https://ip-quick-check.web.app](https://ip-quick-check.web.app) to see the application in action.

## Local Development

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Deployment to Firebase

### Prerequisites

- Firebase account
- Firebase CLI installed (`npm install -g firebase-tools`)

### Steps

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. Login to Firebase CLI:
   ```
   firebase login
   ```

3. Update the `.firebaserc` file with your Firebase project ID:
   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```

4. Build the project:
   ```
   npm run build
   ```
   or
   ```
   yarn build
   ```

5. Deploy to Firebase:
   ```
   npm run deploy
   ```
   or
   ```
   yarn deploy
   ```

## Cost Considerations

This application is designed to be extremely cost-effective to host on Firebase:

- Static hosting only (no database or server requirements)
- Optimized caching headers to reduce bandwidth usage
- Minimal dependencies and small bundle size
- Uses multiple free public IP APIs with fallback mechanism for reliability
  - Primary: ipify.org
  - Fallbacks: ip.sb, myip.com, ipinfo.io, and api64.ipify.org (IPv6)

With Firebase's free tier (Spark plan), you get:
- 10GB of storage
- 360MB/day of outbound transfers
- 1GB/month of inbound transfers

This should be more than enough for personal or small business use.

## License

MIT
