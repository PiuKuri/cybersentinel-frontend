# CyberSentinel – Deployment Guide

## STEP 1 — Push to GitHub (do this FIRST)

You need TWO GitHub repos:
1. `cybersentinel-backend`  ← upload the `backend/` folder contents
2. `cybersentinel-frontend` ← upload everything EXCEPT the `backend/` folder

---

## STEP 2 — Deploy Backend on Render (Free)

1. Go to https://render.com → sign up with GitHub
2. Click **New → Web Service**
3. Connect your `cybersentinel-backend` repo
4. Fill in:
   - Name: `cybersentinel-backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
5. Click **Add Environment Variables**:
   - `GMAIL_ADDRESS` → your Gmail
   - `GMAIL_APP_PASS` → your 16-char app password
   - `SECRET_KEY`    → any random string
   - `FRONTEND_URL`  → https://your-app.vercel.app (fill after Vercel deploy)
6. Click **New → PostgreSQL** (free tier)
   - Render will auto-link it and set `DATABASE_URL` automatically ✅
7. Deploy → copy your backend URL e.g. `https://cybersentinel-backend.onrender.com`

---

## STEP 3 — Deploy Frontend on Vercel (Free)

1. Go to https://vercel.com → sign up with GitHub
2. Click **New Project** → connect `cybersentinel-frontend` repo
3. Add Environment Variable:
   - `REACT_APP_API_URL` → your Render backend URL
     e.g. `https://cybersentinel-backend.onrender.com`
4. Click **Deploy** → get your live URL ✅

---

## STEP 4 — Update CORS on Render

Go back to Render → your backend → Environment Variables
- Update `FRONTEND_URL` → your Vercel URL
- Render will redeploy automatically

---

## Local Development

Backend:
```
cd backend
pip install -r requirements.txt
python app.py
```

Frontend:
```
npm install
npm start
```
