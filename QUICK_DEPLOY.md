# 🚀 Quick Deploy Script for Render

## Step-by-Step Render Deployment

### 1. **Go to Render Dashboard**
Visit: https://render.com/dashboard

### 2. **Deploy Backend First**

**Click "New +" → "Web Service"**

**Connect Repository:**
- Connect GitHub account
- Select: `omanox-dev/Demistify`

**Configure Backend Service:**
```
Service Name: demistify-backend
Branch: master
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables:**
```
SECRET_KEY=demistify-super-secret-jwt-key-2025-hackathon
GOOGLE_GENAI_API_KEY=your-actual-google-api-key-here
```

**Click "Create Web Service"**

⏱️ **Wait 3-5 minutes for deployment**

**Copy the Backend URL** (e.g., `https://demistify-backend-xyz.onrender.com`)

### 3. **Deploy Frontend**

**Click "New +" → "Static Site"**

**Select Repository:**
- Same GitHub repository: `omanox-dev/Demistify`

**Configure Frontend:**
```
Service Name: demistify-frontend
Branch: master
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

**Environment Variables:**
```
VITE_API_URL=https://demistify-backend-xyz.onrender.com
```
*(Replace with your actual backend URL from step 2)*

**Click "Create Static Site"**

⏱️ **Wait 2-3 minutes for deployment**

### 4. **Test Your Deployment**

Your app will be live at:
- **Frontend:** `https://demistify-frontend-xyz.onrender.com`
- **Backend:** `https://demistify-backend-xyz.onrender.com`

**Test these URLs:**
1. Visit frontend URL → Should show your homepage
2. Visit backend URL → Should show: `{"message": "Demistify backend is running"}`
3. Try registration/login on frontend
4. Upload a test document

---

## 🎯 **For Hackathon Demo**

### **Share These URLs:**
```
Live Demo: https://demistify-frontend-xyz.onrender.com
GitHub: https://github.com/omanox-dev/Demistify
Backend API: https://demistify-backend-xyz.onrender.com
```

### **Demo Flow:**
1. **Show live website** at frontend URL
2. **Register/login** with demo account
3. **Upload test document** from your test_documents folder
4. **Show AI processing** and results
5. **Highlight GitHub repository** for code review

---

## 🆘 **Troubleshooting**

### **Backend Issues:**
- Check environment variables are set correctly
- View logs in Render dashboard
- Ensure Google API key is valid

### **Frontend Issues:**
- Verify VITE_API_URL points to correct backend
- Check console for CORS errors
- Ensure backend is running first

### **CORS Issues:**
Your backend already has CORS configured for all origins, so this shouldn't be an issue.

---

## ⚡ **Quick Alternative: Ngrok (5 minutes)**

If Render is too slow or you need immediate demo:

```bash
# Terminal 1: Start backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2: Expose backend
ngrok http 8000
# Copy the HTTPS URL

# Terminal 3: Update frontend config and start
cd frontend
# Update config.js with ngrok URL
npm run dev

# Terminal 4: Expose frontend
ngrok http 3000
```

**Pros:** Instant setup  
**Cons:** URLs change every restart

---

**🎉 Your Demistify webapp will be live and ready for the hackathon demo!**