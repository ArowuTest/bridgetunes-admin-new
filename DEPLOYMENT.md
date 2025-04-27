# Bridgetunes MTN Admin Portal - Deployment Guide

This document provides detailed instructions for deploying the Bridgetunes MTN Admin Portal and integrating it with your GoLang backend.

## Table of Contents

1. [Deployment Options](#deployment-options)
2. [Frontend Deployment](#frontend-deployment)
3. [Backend Integration](#backend-integration)
4. [Security Considerations](#security-considerations)
5. [Troubleshooting](#troubleshooting)

## Deployment Options

The Bridgetunes MTN Admin Portal can be deployed in several ways:

1. **Vercel Deployment** (Recommended for quick setup)
2. **Docker Deployment** (Recommended for self-hosted option)
3. **Traditional Server Deployment**

## Frontend Deployment

### Option 1: Vercel Deployment (Recommended for Quick Setup)

Vercel is a cloud platform for static sites and frontend frameworks that's perfect for deploying React applications.

1. **Create a Vercel Account**:
   - Go to [vercel.com](https://vercel.com) and sign up for an account

2. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

3. **Deploy from GitHub**:
   - Push your admin portal code to GitHub
   - Log in to Vercel and click "Import Project"
   - Select your GitHub repository
   - Configure the project:
     - Framework Preset: React
     - Build Command: `npm run build`
     - Output Directory: `build`
     - Environment Variables: Add `REACT_APP_API_URL` with your backend API URL

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll receive a URL for your deployed application

### Option 2: Docker Deployment

1. **Create a Dockerfile** in the root of your project:
   ```dockerfile
   # Build stage
   FROM node:16-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   ARG REACT_APP_API_URL
   ENV REACT_APP_API_URL=$REACT_APP_API_URL
   RUN npm run build

   # Production stage
   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create an nginx.conf file**:
   ```nginx
   server {
     listen 80;
     
     location / {
       root /usr/share/nginx/html;
       index index.html index.htm;
       try_files $uri $uri/ /index.html;
     }
     
     # Redirect API requests to backend server
     # Uncomment and modify if you want to proxy API requests through nginx
     # location /api {
     #   proxy_pass http://your-backend-api:5000;
     #   proxy_http_version 1.1;
     #   proxy_set_header Upgrade $http_upgrade;
     #   proxy_set_header Connection 'upgrade';
     #   proxy_set_header Host $host;
     #   proxy_cache_bypass $http_upgrade;
     # }
   }
   ```

3. **Build the Docker image**:
   ```bash
   docker build --build-arg REACT_APP_API_URL=https://your-backend-api.com/api -t bridgetunes-admin-portal .
   ```

4. **Run the Docker container**:
   ```bash
   docker run -p 80:80 bridgetunes-admin-portal
   ```

### Option 3: Traditional Server Deployment

1. **Build the application**:
   ```bash
   REACT_APP_API_URL=https://your-backend-api.com/api npm run build
   ```

2. **Deploy to a web server** (example using Apache):
   - Copy the contents of the `build` directory to your web server's document root
   - Configure your web server to serve the `index.html` file for all routes
   
   Apache configuration example (.htaccess file):
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

## Backend Integration

The admin portal requires a GoLang backend that implements the API endpoints described in the [API Documentation](./API_DOCUMENTATION.md). Here's how to integrate with your existing GoLang backend:

### 1. Setting Up the GoLang Backend

1. **Project Structure**:
   Add the following directories and files to your existing GoLang backend:

   ```
   your-backend-repo/
   ├── api/
   │   ├── auth/         # Authentication endpoints
   │   ├── users/        # User management endpoints
   │   ├── dashboard/    # Dashboard data endpoints
   │   ├── draws/        # Draw management endpoints
   │   ├── notifications/ # Notification endpoints
   │   └── csv/          # CSV upload endpoints
   ├── middleware/
   │   ├── auth.go       # JWT authentication middleware
   │   └── rbac.go       # Role-based access control
   ├── models/
   │   ├── user.go       # User model
   │   ├── draw.go       # Draw model
   │   ├── notification.go # Notification model
   │   └── csv.go        # CSV upload model
   ├── config/
   │   └── config.go     # Configuration
   └── main.go           # Entry point
   ```

2. **Dependencies**:
   Add the following dependencies to your GoLang project:

   ```bash
   go get -u github.com/gin-gonic/gin
   go get -u github.com/dgrijalva/jwt-go
   go get -u github.com/gin-contrib/cors
   go get -u go.mongodb.org/mongo-driver/mongo
   ```

3. **CORS Configuration**:
   Configure CORS in your GoLang backend to allow requests from your frontend:

   ```go
   // In main.go
   import (
       "github.com/gin-contrib/cors"
       "github.com/gin-gonic/gin"
   )

   func main() {
       router := gin.Default()

       // Configure CORS
       config := cors.DefaultConfig()
       config.AllowOrigins = []string{"https://your-frontend-domain.com"}
       config.AllowCredentials = true
       config.AllowHeaders = append(config.AllowHeaders, "Authorization")
       router.Use(cors.New(config))

       // Setup routes
       // ...

       router.Run(":5000")
   }
   ```

### 2. Implementing JWT Authentication

1. **Create JWT Middleware**:

   ```go
   // middleware/auth.go
   package middleware

   import (
       "net/http"
       "strings"

       "github.com/dgrijalva/jwt-go"
       "github.com/gin-gonic/gin"
   )

   func AuthMiddleware() gin.HandlerFunc {
       return func(c *gin.Context) {
           authHeader := c.GetHeader("Authorization")
           if authHeader == "" {
               c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
               c.Abort()
               return
           }

           parts := strings.Split(authHeader, " ")
           if len(parts) != 2 || parts[0] != "Bearer" {
               c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
               c.Abort()
               return
           }

           token := parts[1]
           claims := jwt.MapClaims{}

           // Parse the JWT token
           parsedToken, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
               // Replace with your actual JWT secret
               return []byte("your-jwt-secret"), nil
           })

           if err != nil || !parsedToken.Valid {
               c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
               c.Abort()
               return
           }

           // Set user ID and role in context
           c.Set("userId", claims["userId"])
           c.Set("role", claims["role"])
           c.Next()
       }
   }
   ```

2. **Create Role-Based Access Control**:

   ```go
   // middleware/rbac.go
   package middleware

   import (
       "net/http"

       "github.com/gin-gonic/gin"
   )

   func RoleMiddleware(allowedRoles ...string) gin.HandlerFunc {
       return func(c *gin.Context) {
           role, exists := c.Get("role")
           if !exists {
               c.JSON(http.StatusUnauthorized, gin.H{"error": "User role not found"})
               c.Abort()
               return
           }

           userRole := role.(string)
           allowed := false
           for _, r := range allowedRoles {
               if r == userRole {
                   allowed = true
                   break
               }
           }

           if !allowed {
               c.JSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
               c.Abort()
               return
           }

           c.Next()
       }
   }
   ```

### 3. Implementing API Endpoints

Refer to the [API Documentation](./API_DOCUMENTATION.md) for detailed specifications of all required endpoints. Here's an example of implementing the authentication endpoints:

```go
// api/auth/auth.go
package auth

import (
    "net/http"
    "time"

    "github.com/dgrijalva/jwt-go"
    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
)

// LoginRequest represents the login request body
type LoginRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
}

// RegisterRequest represents the registration request body
type RegisterRequest struct {
    Username string `json:"username" binding:"required"`
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
    Role     string `json:"role" binding:"required,oneof=admin manager viewer"`
}

// Setup sets up the authentication routes
func Setup(router *gin.Engine) {
    auth := router.Group("/api/auth")
    {
        auth.POST("/login", Login)
        auth.POST("/register", Register)
        auth.POST("/forgot-password", ForgotPassword)
        auth.POST("/reset-password/:token", ResetPassword)
    }
}

// Login handles user login
func Login(c *gin.Context) {
    var request LoginRequest
    if err := c.ShouldBindJSON(&request); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Here you would validate the user credentials against your database
    // For this example, we'll just create a token

    // Create the token
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "userId": "user123",
        "role":   "admin",
        "exp":    time.Now().Add(time.Hour * 24).Unix(),
    })

    // Sign the token with your secret
    tokenString, err := token.SignedString([]byte("your-jwt-secret"))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "token":   tokenString,
        "user": gin.H{
            "id":       "user123",
            "username": "admin",
            "email":    request.Email,
            "role":     "admin",
            "status":   "active",
        },
    })
}

// Register handles user registration
func Register(c *gin.Context) {
    var request RegisterRequest
    if err := c.ShouldBindJSON(&request); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Here you would create the user in your database
    // For this example, we'll just return a success message

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "User registered successfully. Please check your email for verification.",
        "user": gin.H{
            "id":        "user123",
            "username":  request.Username,
            "email":     request.Email,
            "role":      request.Role,
            "status":    "pending",
            "createdAt": time.Now(),
            "updatedAt": time.Now(),
        },
    })
}

// ForgotPassword handles password reset requests
func ForgotPassword(c *gin.Context) {
    var request struct {
        Email string `json:"email" binding:"required,email"`
    }
    if err := c.ShouldBindJSON(&request); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Here you would send a password reset email
    // For this example, we'll just return a success message

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Password reset email sent. Please check your inbox.",
    })
}

// ResetPassword handles password reset with token
func ResetPassword(c *gin.Context) {
    token := c.Param("token")
    var request struct {
        Password        string `json:"password" binding:"required,min=6"`
        ConfirmPassword string `json:"confirmPassword" binding:"required,eqfield=Password"`
    }
    if err := c.ShouldBindJSON(&request); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Here you would validate the token and update the user's password
    // For this example, we'll just return a success message

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Password reset successfully. You can now log in with your new password.",
    })
}
```

### 4. Setting Up Routes

Configure your routes in the main.go file:

```go
// main.go
package main

import (
    "your-backend-repo/api/auth"
    "your-backend-repo/api/users"
    "your-backend-repo/api/dashboard"
    "your-backend-repo/api/draws"
    "your-backend-repo/api/notifications"
    "your-backend-repo/api/csv"
    "your-backend-repo/middleware"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // Configure CORS
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"https://your-frontend-domain.com"}
    config.AllowCredentials = true
    config.AllowHeaders = append(config.AllowHeaders, "Authorization")
    router.Use(cors.New(config))

    // Setup routes
    auth.Setup(router)
    
    // Protected routes
    api := router.Group("/api")
    api.Use(middleware.AuthMiddleware())
    {
        users.Setup(api)
        dashboard.Setup(api)
        draws.Setup(api)
        notifications.Setup(api)
        csv.Setup(api)
    }

    router.Run(":5000")
}
```

## Security Considerations

1. **JWT Secret**:
   - Use a strong, unique secret for JWT token signing
   - Store this secret in environment variables, not in code
   - Rotate the secret periodically

2. **CORS Configuration**:
   - Only allow requests from your frontend domain
   - Be specific about allowed methods and headers

3. **Password Security**:
   - Always hash passwords before storing them
   - Use bcrypt or Argon2 for password hashing
   - Implement rate limiting for login attempts

4. **API Security**:
   - Validate all input data
   - Implement proper error handling
   - Use HTTPS for all communications
   - Implement rate limiting for API endpoints

5. **Database Security**:
   - Use parameterized queries to prevent SQL injection
   - Limit database user permissions
   - Encrypt sensitive data

## Troubleshooting

### Frontend Issues

1. **API Connection Errors**:
   - Verify that the `REACT_APP_API_URL` environment variable is set correctly
   - Check that your backend server is running
   - Verify CORS configuration on the backend

2. **Authentication Issues**:
   - Check that the JWT token is being stored correctly
   - Verify that the token is being sent in the Authorization header
   - Check that the token has not expired

3. **Rendering Issues**:
   - Check the browser console for errors
   - Verify that the API is returning data in the expected format

### Backend Issues

1. **CORS Errors**:
   - Verify that your CORS configuration includes your frontend domain
   - Check that the CORS middleware is applied before route handlers

2. **Database Connection Issues**:
   - Verify database connection string
   - Check database credentials
   - Ensure the database server is running

3. **JWT Errors**:
   - Verify that the JWT secret is consistent
   - Check token expiration settings
   - Ensure the token payload contains the required claims

## Custom Domain Setup

If you want to use a custom domain for your admin portal:

1. **Vercel Deployment**:
   - Go to your project settings in Vercel
   - Click on "Domains"
   - Add your custom domain
   - Configure DNS settings as instructed by Vercel

2. **Traditional Server Deployment**:
   - Configure your DNS provider to point your domain to your server
   - Set up a virtual host in your web server configuration

## Monitoring and Logging

For production deployments, consider setting up:

1. **Error Monitoring**:
   - Implement error logging in your GoLang backend
   - Consider using a service like Sentry for frontend error tracking

2. **Performance Monitoring**:
   - Monitor server resources (CPU, memory, disk)
   - Track API response times
   - Monitor database performance

3. **User Activity Logging**:
   - Implement audit logs for sensitive operations
   - Track login attempts and failures

## Conclusion

This deployment guide provides the necessary steps to deploy the Bridgetunes MTN Admin Portal and integrate it with your GoLang backend. If you encounter any issues during deployment, refer to the troubleshooting section or contact the development team for assistance.

Remember to test thoroughly in a staging environment before deploying to production, and ensure that all security considerations are addressed.
