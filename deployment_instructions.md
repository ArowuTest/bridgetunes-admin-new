# Deployment Instructions for Bridgetunes Admin Portal

This document provides instructions for deploying the Bridgetunes Admin Portal application.

## Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)
- Docker (optional, for containerized deployment)

## Important Notes About This Fixed Version

This version includes several fixes to address TypeScript errors and build issues:

1. **Import Path Fixes**: Removed file extensions (.tsx and .ts) from import paths
2. **Node.js Compatibility**: Added polyfills for Node.js crypto module compatibility
3. **TypeScript Configuration**: Added proper tsconfig.json configuration
4. **React Hook Rules**: Fixed React Hook rules violations
5. **Type Definitions**: Added missing TypeScript interfaces and type definitions
6. **Component Props**: Updated component interfaces and made props optional where needed

## Local Development Deployment

### 1. Extract the Package

```bash
tar -xzvf bridgetunes-fixed-package.tar.gz
cd bridgetunes-admin-portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_AUTH_TOKEN_KEY=bridgetunes_auth_token
REACT_APP_DEMO_MODE_KEY=bridgetunes_demo_mode
```

For production, update the `REACT_APP_API_URL` to point to your production API endpoint.

### 4. Start the Development Server

```bash
npm start
```

The application will be available at http://localhost:3000.

## Production Deployment

### Option 1: Static Build Deployment

1. Build the application:

```bash
npm run build
```

2. The build output will be in the `build` directory. Deploy these files to your web server.

3. Configure your web server to serve the static files and handle client-side routing:

For Nginx, add the following to your server configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 2: Docker Deployment

1. Build the Docker image:

```bash
docker build -t bridgetunes-admin-portal .
```

2. Run the Docker container:

```bash
docker run -p 80:80 bridgetunes-admin-portal
```

The application will be available at http://localhost.

For production deployment with Docker:

```bash
docker run -p 80:80 -e REACT_APP_API_URL=https://api.your-domain.com bridgetunes-admin-portal
```

## Vercel Deployment

To deploy to Vercel:

1. Create a `vercel.json` file in the root directory:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build",
        "buildCommand": "npm run build"
      }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

2. Push your code to GitHub

3. Connect your GitHub repository to Vercel

4. Configure environment variables in the Vercel dashboard

## Email Configuration with Mailgun

To enable email functionality, you need to configure Mailgun:

### 1. Mailgun Setup

1. Create a Mailgun account at https://www.mailgun.com/
2. Verify your domain or use the sandbox domain for testing
3. Get your API key from the Mailgun dashboard

### 2. Configure Environment Variables for Email

Add the following to your `.env` file:

```
REACT_APP_MAILGUN_API_KEY=your-mailgun-api-key
REACT_APP_MAILGUN_DOMAIN=your-mailgun-domain
REACT_APP_SENDER_EMAIL=noreply@your-domain.com
```

## Admin User Setup

The first super admin user must be created manually. After deployment:

1. Access the application and log in with the default credentials:
   - Email: admin@bridgetunes.com
   - Password: admin123

2. Immediately change the default password through the user profile page

3. Use the super admin account to create additional admin users with appropriate permissions

## Switching Between Demo and Production Modes

The application includes a toggle for switching between demo mode and production mode:

- **Demo Mode**: Uses local storage for data and doesn't require backend API connectivity
- **Production Mode**: Connects to the backend API for all data operations

The toggle is available in the application header for admin users.

## Troubleshooting

### Common Issues and Solutions

1. **TypeScript Errors During Build**:
   - If you encounter TypeScript errors, make sure you're using the correct version of TypeScript (4.4.x or later)
   - Run `npm install --save-dev typescript@4.4.4` to install a compatible version

2. **Node.js Crypto Module Errors**:
   - This fixed version includes polyfills for the Node.js crypto module
   - If you still encounter crypto-related errors, make sure you're using Node.js v16 or later

3. **React Hook Errors**:
   - If you encounter React Hook errors, make sure you're not calling hooks inside callbacks or conditions
   - Review the React Hook Rules: https://reactjs.org/docs/hooks-rules.html

4. **Build Fails with ESLint Warnings**:
   - You can add `ESLINT_NO_DEV_ERRORS=true` to your .env file to prevent ESLint warnings from failing the build

If you encounter issues during deployment:

1. Check that all environment variables are correctly set
2. Ensure the backend API is accessible from the deployment environment
3. Verify that the web server is configured to handle client-side routing
4. Check browser console for any JavaScript errors

For Docker deployments, you can check the logs with:

```bash
docker logs <container-id>
```

## Support

For additional support, please contact the development team.
