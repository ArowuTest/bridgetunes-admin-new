# Bridgetunes MTN Admin Portal

This repository contains the frontend implementation of the Bridgetunes MTN Admin Portal for the "MyNumba Don Win" promotion campaign. The admin portal is built with React, TypeScript, and styled-components, providing a comprehensive interface for managing the promotion.

## Features

- **Authentication System**: Secure login with JWT and role-based access control
- **Dashboard**: Analytics visualization with charts and statistics
- **Draw Management**: Interactive draw interface with animations
- **User Management**: Comprehensive user administration
- **Notification System**: Template-based notifications for different user segments
- **CSV Upload**: Data import functionality with validation and visualization
- **Responsive Design**: Mobile-friendly interface with MTN brand colors

## Project Structure

```
bridgetunes-admin-portal/
├── public/                  # Static files
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── csv/             # CSV upload components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── draw/            # Draw management components
│   │   ├── notification/    # Notification components
│   │   └── user/            # User management components
│   ├── context/             # React context providers
│   ├── data/                # Static data and templates
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── services/            # API service functions
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main application component
│   └── index.tsx            # Application entry point
├── API_DOCUMENTATION.md     # API documentation for backend integration
├── DEPLOYMENT.md            # Deployment instructions
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/bridgetunes-admin-portal.git
   cd bridgetunes-admin-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

## Development

Start the development server:

```bash
npm start
```

The application will be available at http://localhost:3000.

## Building for Production

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Backend Integration

This frontend application requires a backend API to function properly. The backend should implement the endpoints described in the [API Documentation](./API_DOCUMENTATION.md).

## Deployment

See [Deployment Instructions](./DEPLOYMENT.md) for detailed deployment options.

## Features Overview

### Authentication System

- JWT-based authentication
- Role-based access control (Admin, Manager, Viewer)
- Email verification
- Password reset functionality

### Dashboard

- Key performance indicators
- Subscriber growth charts
- Top-up distribution visualization
- Recent draws table
- Revenue trend analysis

### Draw Management

- Create and schedule draws
- Interactive spinning wheel animation
- Filter participants by ending digits, top-up amount, and date
- View and manage draw results
- Export winner lists

### User Management

- Create and manage admin users
- Role assignment and permissions
- User activity tracking
- Status management (active, inactive, pending)

### Notification System

- Pre-created templates for different user segments
- Multi-channel notifications (SMS, email, in-app)
- Template management
- Notification history and statistics

### CSV Upload

- Drag-and-drop file upload
- Data validation and visualization
- Upload history tracking
- Template download

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For any questions or support, please contact the Bridgetunes team.
