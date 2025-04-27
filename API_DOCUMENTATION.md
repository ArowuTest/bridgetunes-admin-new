# Bridgetunes MTN Admin Portal - API Documentation

This document outlines the API endpoints required for the Bridgetunes MTN Admin Portal to communicate with the backend server. The backend should implement these endpoints to support all the functionality of the admin portal.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:5000/api
```

For production, this would be replaced with the actual API server URL.

## Authentication Endpoints

### Register User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: Register a new admin user
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "admin | manager | viewer"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully. Please check your email for verification.",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "status": "pending",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### Verify Email

- **URL**: `/auth/verify-email/:token`
- **Method**: `GET`
- **Description**: Verify user email with token sent to email
- **Response**:
  ```json
  {
    "success": true,
    "message": "Email verified successfully. You can now log in."
  }
  ```

### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticate user and get JWT token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "status": "string",
      "lastLogin": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### Forgot Password

- **URL**: `/auth/forgot-password`
- **Method**: `POST`
- **Description**: Request password reset email
- **Request Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset email sent. Please check your inbox."
  }
  ```

### Reset Password

- **URL**: `/auth/reset-password/:token`
- **Method**: `POST`
- **Description**: Reset password with token
- **Request Body**:
  ```json
  {
    "password": "string",
    "confirmPassword": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password reset successfully. You can now log in with your new password."
  }
  ```

### Change Password

- **URL**: `/auth/change-password`
- **Method**: `POST`
- **Description**: Change user password (requires authentication)
- **Request Body**:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string",
    "confirmPassword": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password changed successfully."
  }
  ```

## User Management Endpoints

### Get All Users

- **URL**: `/users`
- **Method**: `GET`
- **Description**: Get all users (requires admin role)
- **Response**:
  ```json
  [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "status": "string",
      "lastLogin": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
  ```

### Get User by ID

- **URL**: `/users/:id`
- **Method**: `GET`
- **Description**: Get user by ID (requires admin role)
- **Response**:
  ```json
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "status": "string",
    "lastLogin": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### Create User

- **URL**: `/users`
- **Method**: `POST`
- **Description**: Create a new user (requires admin role)
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "admin | manager | viewer"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "status": "pending",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### Update User

- **URL**: `/users/:id`
- **Method**: `PUT`
- **Description**: Update user (requires admin role)
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "role": "admin | manager | viewer",
    "status": "active | inactive | pending"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "status": "string",
    "lastLogin": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### Delete User

- **URL**: `/users/:id`
- **Method**: `DELETE`
- **Description**: Delete user (requires admin role)
- **Response**:
  ```json
  {
    "success": true,
    "message": "User deleted successfully."
  }
  ```

### Get User Activity

- **URL**: `/users/:id/activity`
- **Method**: `GET`
- **Description**: Get user activity log (requires admin role)
- **Response**:
  ```json
  [
    {
      "id": "string",
      "userId": "string",
      "action": "string",
      "details": "string",
      "ipAddress": "string",
      "timestamp": "string"
    }
  ]
  ```

### Get User Statistics

- **URL**: `/users/stats`
- **Method**: `GET`
- **Description**: Get user statistics (requires admin role)
- **Response**:
  ```json
  {
    "totalUsers": 0,
    "activeUsers": 0,
    "inactiveUsers": 0,
    "pendingUsers": 0,
    "adminCount": 0,
    "managerCount": 0,
    "viewerCount": 0
  }
  ```

## Dashboard Endpoints

### Get Dashboard Statistics

- **URL**: `/dashboard/stats`
- **Method**: `GET`
- **Description**: Get dashboard statistics
- **Response**:
  ```json
  {
    "totalSubscribers": 0,
    "activeSubscribers": 0,
    "totalTopUps": 0,
    "totalTopUpAmount": 0,
    "totalDraws": 0,
    "totalWinners": 0,
    "totalPrizeAmount": 0
  }
  ```

### Get Subscriber Growth

- **URL**: `/dashboard/subscriber-growth`
- **Method**: `GET`
- **Description**: Get subscriber growth over time
- **Query Parameters**:
  - `period`: `daily | weekly | monthly | yearly` (default: `monthly`)
  - `startDate`: ISO date string (optional)
  - `endDate`: ISO date string (optional)
- **Response**:
  ```json
  [
    {
      "date": "string",
      "count": 0
    }
  ]
  ```

### Get Top-Up Distribution

- **URL**: `/dashboard/topup-distribution`
- **Method**: `GET`
- **Description**: Get distribution of top-up amounts
- **Response**:
  ```json
  [
    {
      "amount": 0,
      "count": 0
    }
  ]
  ```

### Get Recent Draws

- **URL**: `/dashboard/recent-draws`
- **Method**: `GET`
- **Description**: Get recent draws
- **Query Parameters**:
  - `limit`: number (default: 5)
- **Response**:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "date": "string",
      "totalParticipants": 0,
      "totalWinners": 0,
      "totalPrizeAmount": 0,
      "status": "string"
    }
  ]
  ```

### Get Revenue Trend

- **URL**: `/dashboard/revenue-trend`
- **Method**: `GET`
- **Description**: Get revenue trend over time
- **Query Parameters**:
  - `period`: `daily | weekly | monthly | yearly` (default: `monthly`)
  - `startDate`: ISO date string (optional)
  - `endDate`: ISO date string (optional)
- **Response**:
  ```json
  [
    {
      "date": "string",
      "amount": 0
    }
  ]
  ```

## Draw Management Endpoints

### Get All Draws

- **URL**: `/draws`
- **Method**: `GET`
- **Description**: Get all draws
- **Response**:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "drawDate": "string",
      "status": "scheduled | in-progress | completed | cancelled",
      "totalParticipants": 0,
      "totalWinners": 0,
      "totalPrizeAmount": 0,
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
  ```

### Get Draw by ID

- **URL**: `/draws/:id`
- **Method**: `GET`
- **Description**: Get draw by ID
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "drawDate": "string",
    "status": "scheduled | in-progress | completed | cancelled",
    "totalParticipants": 0,
    "totalWinners": 0,
    "totalPrizeAmount": 0,
    "createdAt": "string",
    "updatedAt": "string",
    "winners": [
      {
        "id": "string",
        "msisdn": "string",
        "prizeAmount": 0,
        "status": "pending | paid | failed"
      }
    ]
  }
  ```

### Create Draw

- **URL**: `/draws`
- **Method**: `POST`
- **Description**: Create a new draw
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "drawDate": "string",
    "prizeAmount": 0,
    "winnerCount": 0,
    "filters": {
      "endingDigits": ["string"],
      "minTopUpAmount": 0,
      "maxTopUpAmount": 0,
      "startDate": "string",
      "endDate": "string",
      "optInStatus": true
    }
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "drawDate": "string",
    "status": "scheduled",
    "totalParticipants": 0,
    "totalWinners": 0,
    "totalPrizeAmount": 0,
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### Update Draw

- **URL**: `/draws/:id`
- **Method**: `PUT`
- **Description**: Update draw
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "drawDate": "string",
    "status": "scheduled | in-progress | completed | cancelled",
    "prizeAmount": 0,
    "winnerCount": 0,
    "filters": {
      "endingDigits": ["string"],
      "minTopUpAmount": 0,
      "maxTopUpAmount": 0,
      "startDate": "string",
      "endDate": "string",
      "optInStatus": true
    }
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "drawDate": "string",
    "status": "string",
    "totalParticipants": 0,
    "totalWinners": 0,
    "totalPrizeAmount": 0,
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### Delete Draw

- **URL**: `/draws/:id`
- **Method**: `DELETE`
- **Description**: Delete draw
- **Response**:
  ```json
  {
    "success": true,
    "message": "Draw deleted successfully."
  }
  ```

### Run Draw

- **URL**: `/draws/:id/run`
- **Method**: `POST`
- **Description**: Run draw to select winners
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "status": "completed",
    "totalParticipants": 0,
    "totalWinners": 0,
    "totalPrizeAmount": 0,
    "winners": [
      {
        "id": "string",
        "msisdn": "string",
        "prizeAmount": 0,
        "status": "pending"
      }
    ]
  }
  ```

### Get Draw Winners

- **URL**: `/draws/:id/winners`
- **Method**: `GET`
- **Description**: Get winners for a specific draw
- **Response**:
  ```json
  [
    {
      "id": "string",
      "msisdn": "string",
      "prizeAmount": 0,
      "status": "pending | paid | failed",
      "paymentDate": "string"
    }
  ]
  ```

### Update Winner Payment Status

- **URL**: `/draws/:drawId/winners/:winnerId`
- **Method**: `PUT`
- **Description**: Update winner payment status
- **Request Body**:
  ```json
  {
    "status": "paid | failed",
    "paymentReference": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "msisdn": "string",
    "prizeAmount": 0,
    "status": "string",
    "paymentDate": "string",
    "paymentReference": "string"
  }
  ```

## Notification Management Endpoints

### Get All Notifications

- **URL**: `/notifications`
- **Method**: `GET`
- **Description**: Get all notifications
- **Response**:
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "message": "string",
      "type": "info | success | warning | error",
      "recipient": "string",
      "channel": "email | sms | in-app",
      "status": "pending | sent | failed",
      "createdAt": "string",
      "sentAt": "string"
    }
  ]
  ```

### Get Notification by ID

- **URL**: `/notifications/:id`
- **Method**: `GET`
- **Description**: Get notification by ID
- **Response**:
  ```json
  {
    "id": "string",
    "title": "string",
    "message": "string",
    "type": "info | success | warning | error",
    "recipient": "string",
    "channel": "email | sms | in-app",
    "status": "pending | sent | failed",
    "createdAt": "string",
    "sentAt": "string"
  }
  ```

### Create Notification

- **URL**: `/notifications`
- **Method**: `POST`
- **Description**: Create a new notification
- **Request Body**:
  ```json
  {
    "title": "string",
    "message": "string",
    "type": "info | success | warning | error",
    "recipient": "string",
    "channel": "email | sms | in-app"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "title": "string",
    "message": "string",
    "type": "string",
    "recipient": "string",
    "channel": "string",
    "status": "pending",
    "createdAt": "string"
  }
  ```

### Delete Notification

- **URL**: `/notifications/:id`
- **Method**: `DELETE`
- **Description**: Delete notification
- **Response**:
  ```json
  {
    "success": true,
    "message": "Notification deleted successfully."
  }
  ```

### Resend Notification

- **URL**: `/notifications/:id/resend`
- **Method**: `POST`
- **Description**: Resend a failed or pending notification
- **Response**:
  ```json
  {
    "id": "string",
    "title": "string",
    "message": "string",
    "type": "string",
    "recipient": "string",
    "channel": "string",
    "status": "pending",
    "createdAt": "string",
    "sentAt": "string"
  }
  ```

### Get Notification Templates

- **URL**: `/notifications/templates`
- **Method**: `GET`
- **Description**: Get all notification templates
- **Response**:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "title": "string",
      "message": "string",
      "type": "info | success | warning | error",
      "channel": "email | sms | in-app"
    }
  ]
  ```

### Get Notification Template by ID

- **URL**: `/notifications/templates/:id`
- **Method**: `GET`
- **Description**: Get notification template by ID
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "title": "string",
    "message": "string",
    "type": "info | success | warning | error",
    "channel": "email | sms | in-app"
  }
  ```

### Create Notification Template

- **URL**: `/notifications/templates`
- **Method**: `POST`
- **Description**: Create a new notification template
- **Request Body**:
  ```json
  {
    "name": "string",
    "title": "string",
    "message": "string",
    "type": "info | success | warning | error",
    "channel": "email | sms | in-app"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "title": "string",
    "message": "string",
    "type": "string",
    "channel": "string"
  }
  ```

### Update Notification Template

- **URL**: `/notifications/templates/:id`
- **Method**: `PUT`
- **Description**: Update notification template
- **Request Body**:
  ```json
  {
    "name": "string",
    "title": "string",
    "message": "string",
    "type": "info | success | warning | error",
    "channel": "email | sms | in-app"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "title": "string",
    "message": "string",
    "type": "string",
    "channel": "string"
  }
  ```

### Delete Notification Template

- **URL**: `/notifications/templates/:id`
- **Method**: `DELETE`
- **Description**: Delete notification template
- **Response**:
  ```json
  {
    "success": true,
    "message": "Notification template deleted successfully."
  }
  ```

### Get Notification Statistics

- **URL**: `/notifications/stats`
- **Method**: `GET`
- **Description**: Get notification statistics
- **Response**:
  ```json
  {
    "totalNotifications": 0,
    "pendingNotifications": 0,
    "sentNotifications": 0,
    "failedNotifications": 0,
    "emailNotifications": 0,
    "smsNotifications": 0,
    "inAppNotifications": 0
  }
  ```

## CSV Upload Endpoints

### Upload CSV

- **URL**: `/csv/upload`
- **Method**: `POST`
- **Description**: Upload CSV file with subscriber data
- **Request Body**: Form data with file field
- **Response**:
  ```json
  {
    "success": true,
    "totalRecords": 0,
    "processedRecords": 0,
    "failedRecords": 0,
    "errors": ["string"]
  }
  ```

### Validate CSV

- **URL**: `/csv/validate`
- **Method**: `POST`
- **Description**: Validate CSV file before upload
- **Request Body**: Form data with file field
- **Response**:
  ```json
  {
    "totalRecords": 0,
    "validRecords": 0,
    "invalidRecords": 0,
    "duplicateRecords": 0,
    "optInRecords": 0,
    "optOutRecords": 0,
    "rechargeAmountDistribution": {
      "100": 0,
      "200": 0,
      "500": 0,
      "1000": 0
    },
    "dateDistribution": {
      "07/04/2025": 0,
      "08/04/2025": 0
    }
  }
  ```

### Get CSV Upload History

- **URL**: `/csv/history`
- **Method**: `GET`
- **Description**: Get CSV upload history
- **Response**:
  ```json
  [
    {
      "id": "string",
      "fileName": "string",
      "uploadedBy": "string",
      "uploadDate": "string",
      "totalRecords": 0,
      "processedRecords": 0,
      "failedRecords": 0,
      "status": "completed | processing | failed"
    }
  ]
  ```

### Get CSV Upload Summary

- **URL**: `/csv/summary/:id`
- **Method**: `GET`
- **Description**: Get summary of a specific CSV upload
- **Response**:
  ```json
  {
    "totalRecords": 0,
    "validRecords": 0,
    "invalidRecords": 0,
    "duplicateRecords": 0,
    "optInRecords": 0,
    "optOutRecords": 0,
    "rechargeAmountDistribution": {
      "100": 0,
      "200": 0,
      "500": 0,
      "1000": 0
    },
    "dateDistribution": {
      "07/04/2025": 0,
      "08/04/2025": 0
    }
  }
  ```

### Get CSV Upload Statistics

- **URL**: `/csv/stats`
- **Method**: `GET`
- **Description**: Get CSV upload statistics
- **Response**:
  ```json
  {
    "totalUploads": 0,
    "totalRecordsProcessed": 0,
    "lastUploadDate": "string",
    "averageRecordsPerUpload": 0
  }
  ```

### Download CSV Template

- **URL**: `/csv/template`
- **Method**: `GET`
- **Description**: Download CSV template
- **Response**: CSV file download

## Error Responses

All API endpoints return appropriate HTTP status codes:

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error response format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error messages"]
}
```

## Authentication

All endpoints except for authentication endpoints (`/auth/*`) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

## Role-Based Access Control

The API implements role-based access control with the following roles:

- `admin`: Full access to all endpoints
- `manager`: Access to most endpoints except user management
- `viewer`: Read-only access to most endpoints

Each endpoint should implement appropriate permission checks based on the user's role.

## Database Schema

The backend should implement the following database schema to support the admin portal:

### Users Collection

```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "admin | manager | viewer",
  "status": "active | inactive | pending",
  "lastLogin": "Date",
  "emailVerified": "boolean",
  "emailVerificationToken": "string",
  "passwordResetToken": "string",
  "passwordResetExpires": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### UserActivity Collection

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "action": "string",
  "details": "string",
  "ipAddress": "string",
  "timestamp": "Date"
}
```

### Subscribers Collection

```json
{
  "_id": "ObjectId",
  "msisdn": "string",
  "optInStatus": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### TopUps Collection

```json
{
  "_id": "ObjectId",
  "msisdn": "string",
  "amount": "number",
  "date": "Date",
  "source": "api | csv",
  "csvUploadId": "ObjectId (optional)",
  "createdAt": "Date"
}
```

### Draws Collection

```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "drawDate": "Date",
  "status": "scheduled | in-progress | completed | cancelled",
  "totalParticipants": "number",
  "totalWinners": "number",
  "totalPrizeAmount": "number",
  "filters": {
    "endingDigits": ["string"],
    "minTopUpAmount": "number",
    "maxTopUpAmount": "number",
    "startDate": "Date",
    "endDate": "Date",
    "optInStatus": "boolean"
  },
  "createdBy": "ObjectId",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Winners Collection

```json
{
  "_id": "ObjectId",
  "drawId": "ObjectId",
  "msisdn": "string",
  "prizeAmount": "number",
  "status": "pending | paid | failed",
  "paymentDate": "Date",
  "paymentReference": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Notifications Collection

```json
{
  "_id": "ObjectId",
  "title": "string",
  "message": "string",
  "type": "info | success | warning | error",
  "recipient": "string",
  "channel": "email | sms | in-app",
  "status": "pending | sent | failed",
  "sentAt": "Date",
  "createdBy": "ObjectId",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### NotificationTemplates Collection

```json
{
  "_id": "ObjectId",
  "name": "string",
  "title": "string",
  "message": "string",
  "type": "info | success | warning | error",
  "channel": "email | sms | in-app",
  "createdBy": "ObjectId",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### CSVUploads Collection

```json
{
  "_id": "ObjectId",
  "fileName": "string",
  "uploadedBy": "ObjectId",
  "uploadDate": "Date",
  "totalRecords": "number",
  "processedRecords": "number",
  "failedRecords": "number",
  "status": "completed | processing | failed",
  "summary": {
    "validRecords": "number",
    "invalidRecords": "number",
    "duplicateRecords": "number",
    "optInRecords": "number",
    "optOutRecords": "number",
    "rechargeAmountDistribution": "object",
    "dateDistribution": "object"
  },
  "errors": ["string"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Integration with MTN APIs

The backend should be designed to integrate with the following MTN APIs:

1. **Subscriber API**: For retrieving subscriber information
2. **SMS Gateway API**: For sending SMS notifications
3. **Blacklist API**: For checking if a subscriber is blacklisted

These integrations should be implemented as separate services that can be easily switched between mock implementations (for development and testing) and real API implementations (for production).

## Implementation Notes

1. The backend should implement proper error handling and validation for all endpoints
2. All sensitive data should be encrypted or hashed as appropriate
3. The API should implement rate limiting to prevent abuse
4. All database operations should be properly indexed for performance
5. The API should implement proper logging for debugging and auditing
6. The API should implement proper CORS configuration for security
7. The API should implement proper input sanitization to prevent injection attacks
8. The API should implement proper output encoding to prevent XSS attacks
9. The API should implement proper authentication and authorization checks for all endpoints
10. The API should implement proper validation for all request parameters and body data
