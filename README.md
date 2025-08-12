# Gift Loop API Integration

This project has been updated to use a real API server instead of simulated API calls. The registration and login functionality now communicates with a backend server.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the API Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 3. Open the Application

Open `auth.html` in your browser. The registration and login forms will now communicate with the real API server.

## 📁 File Structure

```
├── auth.html          # Authentication page
├── auth.js            # Updated authentication logic
├── js/
│   ├── api.js         # API service class
│   ├── config.js      # Configuration settings
│   ├── notify.js      # Notification system
│   └── core/
│       └── App.js     # Core application logic
├── server.js          # Express API server
└── package.json       # Node.js dependencies
```

## 🔧 Configuration

### API Settings

Edit `js/config.js` to configure your API settings:

```javascript
const CONFIG = {
    API: {
        DEV_URL: 'http://localhost:3000/api',        // Development server
        PROD_URL: 'https://your-server.com/api',     // Production server
        ENVIRONMENT: 'development',                   // Change to 'production' when deploying
        TIMEOUT: 10000
    }
    // ...
};
```

### Environment Setup

- **Development**: Uses `DEV_URL` (localhost:3000)
- **Production**: Uses `PROD_URL` (your production server)

## 📡 API Endpoints

The server provides the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/forgot-password` | Request password reset |
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update user profile |
| POST | `/api/user/change-password` | Change password |
| GET | `/api/health` | Health check |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Registration/Login**: Returns a JWT token
2. **Protected Routes**: Require `Authorization: Bearer <token>` header
3. **Token Storage**: Tokens are stored in localStorage

## 🛠️ Development

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon for automatic server restart on file changes.

### Testing the API

You can test the API endpoints using curl or Postman:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1990-01-01"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🚀 Production Deployment

### 1. Update Configuration

Change the environment to production in `js/config.js`:

```javascript
ENVIRONMENT: 'production'
```

### 2. Set Production URL

Update the `PROD_URL` in `js/config.js` to point to your production server.

### 3. Deploy Server

Deploy the `server.js` file to your production server with the required dependencies.

### 4. Environment Variables

Set these environment variables on your production server:

```bash
PORT=3000
JWT_SECRET=your-secure-secret-key
```

## 🔒 Security Notes

- **JWT Secret**: Change the JWT secret in production
- **HTTPS**: Use HTTPS in production
- **Database**: Replace in-memory storage with a real database
- **Password Hashing**: Already implemented with bcrypt
- **CORS**: Configure CORS settings for your domain

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the server is running and CORS is configured
2. **Network Errors**: Check if the API server is running on the correct port
3. **Token Issues**: Clear localStorage and try logging in again

### Debug Mode

Enable debug logging by setting `DEBUG: true` in the config:

```javascript
APP: {
    DEBUG: true
}
```

## 📝 API Response Format

### Success Response
```json
{
  "message": "Success message",
  "user": { /* user data */ },
  "token": "jwt-token"
}
```

### Error Response
```json
{
  "message": "Error message"
}
```

## 🔄 Migration from Simulated API

The main changes made:

1. **Created `js/api.js`**: Real API service class
2. **Created `js/config.js`**: Configuration management
3. **Updated `auth.js`**: Uses real API calls instead of setTimeout
4. **Created `server.js`**: Express API server
5. **Added `package.json`**: Node.js dependencies

The registration code now looks like this:

```javascript
try {
    const { user, token } = await giftApi.register({
        email,
        password,
        firstName,
        lastName,
        birthDate,
    });
    
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    localStorage.setItem('isLoggedIn', 'true');
    
    showNotification('アカウントが正常に作成されました！', 'success');
    setTimeout(() => {
        window.location.href = 'mypage.html';
    }, 800);
} catch (err) {
    showNotification(err.message || '登録に失敗しました。', 'error');
}
```

## 📞 Support

If you encounter any issues:

1. Check the browser console for JavaScript errors
2. Check the server console for API errors
3. Verify the API server is running
4. Check network connectivity