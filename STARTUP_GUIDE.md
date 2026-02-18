# Startup Guide - Funkidz Animation Frontend

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```
✅ Installs all packages including fixed dependencies

### Step 2: Configure Environment
Create `.env.local` in project root:
```
VITE_API_URL=http://localhost:8000/api
```

### Step 3: Start Development Server
```bash
npm run dev
```
✅ Server starts on http://localhost:5173

### Step 4: Open Browser
Navigate to `http://localhost:5173` and test the application.

---

## ✅ What's Already Fixed

Before you start, know that we've already fixed:

1. **AuthContext Hook Issues** - ✅ Fixed
2. **Vite Environment Variables** - ✅ Fixed  
3. **Tailwind CSS Classes** - ✅ Fixed
4. **Navbar Colors** - ✅ Fixed
5. **Footer Styling** - ✅ Fixed

See `BUG_FIXES_REPORT.md` for details.

---

## 📂 Project Structure

```
funkidz-animation/
├── src/
│   ├── pages/              # 22 page components
│   ├── components/         # Reusable UI components
│   ├── services/           # API clients and utilities
│   ├── context/            # React Context (Auth)
│   ├── App.jsx             # Main app with routing
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── .env.local             # Environment variables (create this)
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── tailwind.config.js     # Tailwind configuration
```

---

## 🧪 Testing the Application

### 1. Test Home Page
- Visit http://localhost:5173
- Should see hero section with Funkidz logo
- "Réserver maintenant" button visible

### 2. Test Navigation
- Click menu items (Services, Tarifs, Galerie, Contact)
- Each page should load without errors
- Mobile menu should work on small screens

### 3. Test Colors  
- Navbar should have proper colors (blue/gray)
- Footer should have dark background
- Buttons should be blue

### 4. Test Authentication
- Click "Inscription" 
- Form should load
- Error messages should display properly (when API connected)

---

## 🔧 Troubleshooting

### Issue: "npm ERR! Cannot find module"
**Solution:** 
```bash
rm -rf node_modules
npm install
```

### Issue: "Port 5173 already in use"
**Solution:**
```bash
npm run dev -- --port 3000
```

### Issue: "Blank page or no styling"
**Solution:**
- Check browser console (F12)
- Verify `.env.local` exists
- Ensure `npm install` completed successfully

### Issue: "Colors not showing correctly"
**Solution:** Already fixed in code! If still issues:
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server

---

## 📝 Environment Variables

### Required
- `VITE_API_URL` - Backend API endpoint (e.g., http://localhost:8000/api)

### Optional
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe public key (for payments)

### Example .env.local
```
# Required
VITE_API_URL=http://localhost:8000/api

# Optional (for payment testing)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here
```

---

## 🌐 Available Routes

### Public Routes
- `/` - Home
- `/services` - Services catalog
- `/pricing` - Pricing page
- `/gallery` - Gallery
- `/contact` - Contact form
- `/auth/login` - Login
- `/auth/signup` - Signup
- `/auth/forgot-password` - Password reset
- `/terms` - Terms of service
- `/privacy` - Privacy policy

### Protected Routes (requires login)
- `/dashboard` - User dashboard
- `/rgpd-settings` - RGPD settings
- `/payment` - Payment page
- `/payment-success` - Payment success

### Admin Routes (requires admin role)
- `/admin` - Admin dashboard
- `/admin/services` - Manage services
- `/admin/bookings` - Manage bookings
- `/admin/users` - Manage users
- `/admin/payments` - Manage payments
- `/admin/gallery` - Manage gallery
- `/admin/settings` - Admin settings

---

## 🏗️ Building for Production

### Build
```bash
npm run build
```
Creates optimized `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Test production build locally

### Deploy to Vercel
```bash
vercel
```

---

## 📚 Documentation Files

1. **README.md** - Overview and setup
2. **QUICK_START.md** - Quick reference guide
3. **COMPLETE_BUILD_GUIDE.md** - Detailed architecture
4. **IMPLEMENTATION_CHECKLIST.md** - Feature checklist
5. **BUG_FIXES_REPORT.md** - Bug analysis and fixes
6. **PRE_LAUNCH_CHECKLIST.md** - Launch verification
7. **CODE_ANALYSIS_COMPLETE.md** - Code analysis results
8. **STARTUP_GUIDE.md** - This file

---

## 🤝 Development Tips

### Add New Page
1. Create file in `src/pages/MyPage.jsx`
2. Add route in `src/App.jsx`
3. Add navigation link if needed

### Add New Service
1. Create in `src/services/myService.js`
2. Export functions
3. Import and use in components

### Test API Integration
1. Start Django backend on :8000
2. Set `VITE_API_URL=http://localhost:8000/api`
3. Login should work (when backend ready)

### Debug Issues
- Open DevTools: F12
- Check Console tab for errors
- Check Network tab for API calls
- Check Application tab for localStorage (token)

---

## ⚡ Performance Tips

- Use Chrome DevTools to check bundle size
- Lazy load routes as needed
- Optimize images for web
- Use React DevTools to find re-render issues

---

## 🔒 Security Notes

- ✅ JWT tokens stored in localStorage
- ✅ Tokens sent in Authorization headers
- ✅ Routes protected by PrivateRoute component
- ✅ Admin routes require admin role
- ✅ Input validation on forms

---

## 📞 Getting Help

### If you get stuck:
1. Check the specific documentation file
2. Review BUG_FIXES_REPORT.md if errors appear
3. Check browser console (F12) for error messages
4. Verify environment variables are set

### Common issues are documented in:
- PRE_LAUNCH_CHECKLIST.md - "Common Issues & Solutions"
- BUG_FIXES_REPORT.md - "Testing Checklist"

---

## ✨ What's Next?

### Phase 1: Frontend Testing (You are here)
- [x] Install dependencies
- [x] Configure environment
- [x] Start dev server
- [x] Test pages load

### Phase 2: Backend Development
- [ ] Implement Django endpoints (30+)
- [ ] Connect API to frontend
- [ ] Test authentication flow
- [ ] Test data operations

### Phase 3: Integration
- [ ] Connect frontend to backend
- [ ] Test full user flows
- [ ] Setup Stripe payments
- [ ] Configure email service

### Phase 4: Deployment
- [ ] Build for production
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to production
- [ ] Go live!

---

## 🎉 You're All Set!

```bash
npm install
npm run dev
```

Visit http://localhost:5173 and enjoy! 🚀

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Ready for Development ✅
