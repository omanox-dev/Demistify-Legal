# 🚀 Demistify Deployment Guide

Complete guide to host your Demistify webapp for the Google Gen AI Hackathon demo.

---

## 🎯 **Quick Deploy Options** (Recommended for Demo)

### **Option 1: Render (Easiest - Full Stack)**
✅ **Best for:** Quick deployment, both frontend and backend  
✅ **Cost:** Free tier available  
✅ **Time:** 10-15 minutes  

### **Option 2: Vercel + Railway**
✅ **Best for:** Professional deployment  
✅ **Frontend:** Vercel (free)  
✅ **Backend:** Railway (free tier)  

### **Option 3: Netlify + Render**
✅ **Best for:** Static frontend with API backend  
✅ **Frontend:** Netlify (free)  
✅ **Backend:** Render (free tier)  

---

## 🏗️ **Option 1: Deploy on Render (Recommended)**

### **Step 1: Prepare Your Repository**
Your code is already on GitHub at `https://github.com/omanox-dev/Demistify` ✅

### **Step 2: Deploy Backend on Render**

1. **Go to [render.com](https://render.com)** and sign up/login
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub** and select your `Demistify` repository
4. **Configure Backend Service:**
   ```
   Name: demistify-backend
   Branch: master
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

5. **Set Environment Variables:**
   ```
   SECRET_KEY=your-super-secret-key-here
   GOOGLE_GENAI_API_KEY=your-google-api-key
   ```

6. **Click "Create Web Service"**
7. **Note the URL** (e.g., `https://demistify-backend.onrender.com`)

### **Step 3: Deploy Frontend on Render**

1. **Click "New +"** → **"Static Site"**
2. **Select your `Demistify` repository**
3. **Configure Frontend:**
   ```
   Name: demistify-frontend
   Branch: master
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Set Environment Variable:**
   ```
   VITE_API_URL=https://demistify-backend.onrender.com
   ```

5. **Click "Create Static Site"**

### **Step 4: Update Frontend Configuration**

You'll need to update your frontend to use the deployed backend URL:

1. **Create environment configuration in frontend:**

---

## 🏗️ **Option 2: Vercel + Railway**

### **Deploy Backend on Railway**

1. **Go to [railway.app](https://railway.app)**
2. **Login with GitHub**
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select `Demistify` repository**
5. **Configure:**
   ```
   Root Directory: backend
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
6. **Add Environment Variables:**
   ```
   SECRET_KEY=your-secret-key
   GOOGLE_GENAI_API_KEY=your-google-api-key
   ```

### **Deploy Frontend on Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Configure:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
4. **Environment Variables:**
   ```
   VITE_API_URL=https://your-railway-backend-url
   ```

---

## 🏗️ **Option 3: Local + Ngrok (Quick Demo)**

### **For Immediate Demo (5 minutes setup):**

1. **Install ngrok:** `npm install -g ngrok` or download from [ngrok.com](https://ngrok.com)

2. **Start your backend:**
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

3. **In new terminal, expose backend:**
   ```bash
   ngrok http 8000
   ```
   **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

4. **Update frontend config and start:**
   ```bash
   cd frontend
   # Update API URL in your code to use ngrok URL
   npm run dev
   ```

5. **In new terminal, expose frontend:**
   ```bash
   ngrok http 3000
   ```

**Now you have public URLs for both frontend and backend!**

---

## 🔧 **Production Configuration Files**

### **Create `backend/Dockerfile`:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **Create `frontend/.env.production`:**
```env
VITE_API_URL=https://your-backend-url.com
```

### **Update `frontend/vite.config.js`:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
})
```

---

## 🌐 **Environment Variables Setup**

### **Backend Environment Variables:**
```env
SECRET_KEY=your-super-secret-jwt-key-min-32-chars
GOOGLE_GENAI_API_KEY=your-google-gemini-api-key
DATABASE_URL=sqlite:///./demistify.db
```

### **Frontend Environment Variables:**
```env
VITE_API_URL=https://your-backend-domain.com
```

---

## 🎯 **For Hackathon Demo (Fastest)**

### **5-Minute Deployment with Render:**

1. **Push your code to GitHub** ✅ (Already done)

2. **Deploy Backend:**
   - Go to render.com
   - New Web Service → Connect GitHub → Select Demistify
   - Root: `backend`, Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables
   - Deploy (takes 3-5 minutes)

3. **Deploy Frontend:**
   - New Static Site → Same repo
   - Root: `frontend`, Build: `npm install && npm run build`
   - Add `VITE_API_URL` pointing to backend
   - Deploy (takes 2-3 minutes)

**Total Time: ~10 minutes with live URLs!**

---

## 🚨 **Pre-Deployment Checklist**

### **Backend:**
- [ ] All dependencies in `requirements.txt`
- [ ] Environment variables configured
- [ ] Google Gen AI API key ready
- [ ] CORS configured for frontend domain
- [ ] Database migrations handled

### **Frontend:**
- [ ] Build command works locally (`npm run build`)
- [ ] API URL configurable via environment
- [ ] No hardcoded localhost URLs
- [ ] Production optimizations enabled

### **Security:**
- [ ] Secret keys are strong and unique
- [ ] API keys not committed to repository
- [ ] HTTPS enabled in production
- [ ] CORS restricted to your domain

---

## 🎬 **Demo URLs Structure**

After deployment, you'll have:
```
Frontend: https://demistify-frontend.onrender.com
Backend:  https://demistify-backend.onrender.com
GitHub:   https://github.com/omanox-dev/Demistify
```

**Perfect for sharing with judges!** 🎉

---

## 🆘 **Troubleshooting**

### **Common Issues:**

**Backend not starting:**
- Check environment variables are set
- Verify requirements.txt includes all dependencies
- Check logs for specific error messages

**Frontend can't connect to backend:**
- Verify API URL is correct in environment variables
- Check CORS settings in backend
- Ensure backend is actually running

**Build failures:**
- Run `npm run build` locally first
- Check for any TypeScript/ESLint errors
- Verify all dependencies are in package.json

---

## 🎯 **Recommended for Hackathon**

**Use Render for both frontend and backend** - it's the fastest and most reliable option for demo purposes. You'll have your webapp live in under 15 minutes!

**Need help with deployment? I can guide you through any of these options step by step!** 🚀