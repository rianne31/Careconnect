# CareConnect System - Working URLs

## ✅ **Currently Working Services**

### 1. **Django Backend API** 
- **URL:** `http://127.0.0.1:8000`
- **Status:** ✅ Running and tested
- **Admin Panel:** `http://127.0.0.1:8000/admin/`
- **API Base:** `http://127.0.0.1:8000/api/`

### 2. **Metro Bundler (Expo)**
- **URL:** `http://localhost:8081`
- **Status:** ✅ Running
- **Purpose:** Development server for React Native

## 🧪 **How to Test the System**

### **Option 1: Test Backend API Directly**

#### **Test User Registration:**
```bash
# In PowerShell:
$body = @{username="testuser3"; password="testpass123"; role="donor"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/register/" -Method POST -Body $body -ContentType "application/json"
```

#### **Test User Login:**
```bash
# In PowerShell:
$body = @{username="testuser3"; password="testpass123"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/token/" -Method POST -Body $body -ContentType "application/json"
$response.Content
```

#### **Test Admin Panel:**
1. Open browser: `http://127.0.0.1:8000/admin/`
2. Login with: `admin` / `admin123`
3. View users and system data

### **Option 2: Start Web Interface Manually**

#### **Start Expo Web Server:**
```bash
# In PowerShell, navigate to careconnect-expo directory:
cd careconnect-expo
npx expo start --web
```

#### **Then open in browser:**
- The terminal will show the web URL (usually `http://localhost:19006` or `http://localhost:3000`)

### **Option 3: Use Mobile App (Expo Go)**

1. **Install Expo Go** on your phone from App Store/Google Play
2. **Start Expo server:**
   ```bash
   cd careconnect-expo
   npx expo start
   ```
3. **Scan the QR code** with Expo Go app
4. **Test the app** on your mobile device

## 🔧 **Troubleshooting Connection Issues**

### **If you get "Connection Refused":**

1. **Check if Django is running:**
   ```bash
   Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/" -Method GET
   ```

2. **If Django is not running, start it:**
   ```bash
   cd "C:\Users\Ramir Santos\Downloads\Careconnect-anghel (1)\Careconnect-anghel"
   python manage.py runserver
   ```

3. **Check if Expo is running:**
   ```bash
   cd careconnect-expo
   npx expo start --web
   ```

### **Common Issues:**

- **Use `127.0.0.1` instead of `localhost`** for Django backend
- **Make sure both servers are running** before testing
- **Check firewall settings** if connections are blocked
- **Use the correct ports** (8000 for Django, 8081 for Metro, 19006/3000 for web)

## 📱 **Quick Test Commands**

### **Test Backend:**
```bash
# Test API endpoint
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/" -Method GET

# Expected: {"detail":"Authentication credentials were not provided."}
# This means the server is working!
```

### **Test Frontend:**
```bash
# Start Expo web server
cd careconnect-expo
npx expo start --web

# Then open the URL shown in terminal
```

## 🎯 **Current Status**

- ✅ **Backend API:** Fully functional
- ✅ **Database:** Working with test data
- ✅ **Authentication:** JWT tokens working
- ✅ **Admin Panel:** Accessible
- ⚠️ **Web Interface:** Needs manual start
- ✅ **Mobile Interface:** Ready via Expo Go

## 🚀 **Next Steps**

1. **Test the backend API** using the PowerShell commands above
2. **Start the web interface** manually with `npx expo start --web`
3. **Use the admin panel** to manage users and data
4. **Test on mobile** with Expo Go app

The system is working - you just need to start the web interface manually!

