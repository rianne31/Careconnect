# CareConnect Setup Guide

## Backend (Django) - ✅ COMPLETED

The Django backend is now running successfully on `http://localhost:8000`

### What's been set up:
- ✅ Django project structure fixed
- ✅ Database migrations applied
- ✅ API endpoints configured
- ✅ User registration endpoint added
- ✅ JWT authentication configured
- ✅ CORS headers enabled for frontend integration
- ✅ Admin user created (username: `admin`, password: `admin123`)
- ✅ Development server running on port 8000

### API Endpoints Available:
- `POST /api/token/` - Login
- `POST /api/token/refresh/` - Refresh token
- `POST /api/register/` - User registration
- `GET /api/user-profiles/` - User profiles
- `GET /api/patients/` - Patient management
- `GET /api/auctions/` - Auction items
- `GET /api/donations/` - Donations
- `GET /api/transactions/` - Transactions
- `GET /api/recommendations/donor/` - AI recommendations

## Frontend (React Native/Expo) - ⚠️ REQUIRES NODE.JS

### Prerequisites:
You need to install Node.js and npm first:

1. **Download and install Node.js** from https://nodejs.org/
   - Choose the LTS version (recommended)
   - This will also install npm

2. **Verify installation:**
   ```bash
   node --version
   npm --version
   ```

### Frontend Setup (After installing Node.js):

1. **Navigate to the frontend directory:**
   ```bash
   cd careconnect-expo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npm start
   ```

4. **Run on different platforms:**
   - **Web:** `npm run web`
   - **Android:** `npm run android` (requires Android Studio)
   - **iOS:** `npm run ios` (requires Xcode on macOS)

### Frontend Configuration:
- ✅ API service layer created (`services/apiService.js`)
- ✅ API configuration file created (`config/api.js`)
- ✅ Login/Register screens updated to use backend API
- ✅ JWT token handling implemented
- ✅ Automatic token refresh configured

## Testing the Integration:

### 1. Test Backend API:
```bash
# Test registration
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123", "role": "donor"}'

# Test login
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

### 2. Test Frontend (after Node.js setup):
1. Start the frontend: `npm start` in `careconnect-expo` directory
2. Open the app in your browser or mobile device
3. Try registering a new user
4. Try logging in with the created user

## Current Status:
- ✅ **Backend:** Fully functional and running
- ⚠️ **Frontend:** Ready to run (requires Node.js installation)
- ✅ **Integration:** API service layer configured and ready

## Next Steps:
1. Install Node.js and npm
2. Run `npm install` in the `careconnect-expo` directory
3. Start the frontend with `npm start`
4. Test the complete system integration

## Troubleshooting:

### Backend Issues:
- If Django server won't start, check if port 8000 is available
- If migrations fail, delete `db.sqlite3` and run migrations again

### Frontend Issues:
- If npm commands don't work, ensure Node.js is properly installed
- If Expo won't start, try clearing cache: `npx expo start --clear`
- If API calls fail, check that the Django server is running on port 8000

## Admin Access:
- **Django Admin:** http://localhost:8000/admin/
- **Username:** admin
- **Password:** admin123


