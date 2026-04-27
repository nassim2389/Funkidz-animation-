# 🚀 BACKEND READY - Django Implementation Guide

**Date**: 27 avril 2026  
**Frontend Status**: ✅ 100% Code Ready  
**Backend Status**: 📋 À Implémenter

---

## 📋 Ce Qu'Il Faut Coder en Backend (Django)

### 1️⃣ DATABASE MODELS (À Créer)

```python
# users/models.py
User
  - email (unique)
  - password_hash
  - first_name
  - last_name
  - role (CLIENT, ADMIN, ANIMATEUR)
  - is_verified (email verification)
  - created_at
  - updated_at

AnimateurProfile
  - user (FK to User)
  - bio
  - phone
  - avatar_url
  - rating (avg stars)

# services/models.py
Service
  - name
  - description
  - base_price (euros)
  - duration_minutes
  - category (enum)
  - is_active (bool)
  - max_children
  - min_children

Option
  - name
  - description
  - price
  - pricing_type (FIXED, PER_CHILD, PER_HOUR)
  - service (FK)
  - is_active

# bookings/models.py
Booking
  - user (FK to User)
  - service (FK to Service)
  - booking_date
  - booking_time
  - estimated_price
  - final_price
  - status (PENDING, CONFIRMED, CANCELLED, DONE)
  - nb_children
  - location_address
  - location_city
  - location_zip
  - location_lat/lng (coordinates)
  - special_instructions
  - created_at
  - updated_at

BookingOption
  - booking (FK to Booking)
  - option (FK to Option)
  - quantity
  - price_at_time

BookingAssignment
  - booking (FK to Booking)
  - animateur (FK to AnimateurProfile)
  - status (PENDING, ACCEPTED, REFUSED)
  - created_at

Availability
  - animateur (FK to AnimateurProfile)
  - date
  - start_time
  - end_time
  - is_blocked (bool, for days off)

# payments/models.py
Payment
  - booking (FK to Booking)
  - stripe_session_id (unique)
  - stripe_payment_intent
  - amount (euros)
  - status (PENDING, SUCCEEDED, FAILED, REFUNDED)
  - created_at

# media/models.py
MediaGallery
  - service (FK to Service, nullable)
  - media_url
  - media_type (IMAGE, VIDEO)
  - title
  - order (int, for sorting)

# contact/models.py
ContactMessage
  - name
  - email
  - phone
  - message
  - is_read (bool)
  - created_at

# reviews/models.py
Review
  - booking (FK to Booking)
  - rating (1-5)
  - comment
  - created_at
```

---

### 2️⃣ API ENDPOINTS (À Implémenter)

#### 🔐 Authentication (No Auth Required)
```
POST /api/auth/signup
  Body: {email, password, first_name, last_name}
  Response: {access_token, refresh_token, user}

POST /api/auth/login
  Body: {email, password}
  Response: {access_token, refresh_token, user}

POST /api/auth/refresh
  Body: {refresh_token}
  Response: {access_token}

POST /api/auth/logout
  Headers: {Authorization: Bearer token}
  Response: {message: "Logged out"}

POST /api/auth/forgot-password
  Body: {email}
  Response: {message: "Email sent"}

POST /api/auth/reset-password/:token
  Body: {password, password_confirm}
  Response: {message: "Password reset"}

GET /api/auth/verify-email/:token
  Response: {message: "Email verified"}
```

#### 📦 Services (No Auth Required)
```
GET /api/services
  Query: ?category=anniversaire&active=true
  Response: [{id, name, description, price, duration, category}...]

GET /api/services/:id
  Response: {id, name, description, price, duration, category, options: [...]}

POST /api/services (ADMIN ONLY)
  Body: {name, description, price, duration, category, max_children}
  Response: {id, name, ...}

PATCH /api/services/:id (ADMIN ONLY)
  Body: {...fields to update}
  Response: {id, name, ...}

DELETE /api/services/:id (ADMIN ONLY)
  Response: {message: "Deleted"}
```

#### 🎯 Options (No Auth Required)
```
GET /api/options
  Query: ?service_id=123
  Response: [{id, name, price, pricing_type}...]

GET /api/options/:id
  Response: {id, name, description, price, pricing_type}

POST /api/options (ADMIN ONLY)
  Body: {name, description, price, pricing_type, service_id}
  Response: {id, ...}

PATCH /api/options/:id (ADMIN ONLY)
  Body: {...}
  Response: {id, ...}

DELETE /api/options/:id (ADMIN ONLY)
  Response: {message: "Deleted"}
```

#### 🎁 Bookings (AUTH REQUIRED)
```
POST /api/bookings
  Headers: {Authorization: Bearer token}
  Body: {
    service_id,
    booking_date,
    booking_time,
    nb_children,
    location_address,
    location_city,
    location_zip,
    selected_options: [{option_id, quantity}],
    special_instructions
  }
  Response: {id, status: "PENDING", final_price, ...}

GET /api/bookings
  Headers: {Authorization: Bearer token}
  Query: ?status=PENDING&page=1
  Response: [{id, service, date, price, status}...]

GET /api/bookings/:id
  Headers: {Authorization: Bearer token}
  Response: {id, service, options, price_breakdown, status, animateur}

PATCH /api/bookings/:id (ADMIN or OWNER)
  Headers: {Authorization: Bearer token}
  Body: {...fields to update}
  Response: {id, ...}

DELETE /api/bookings/:id (ADMIN or OWNER)
  Headers: {Authorization: Bearer token}
  Response: {message: "Booking cancelled", refund_status}
```

#### 💳 Payments (AUTH REQUIRED)
```
POST /api/payments/stripe
  Headers: {Authorization: Bearer token}
  Body: {booking_id}
  Response: {session_id, redirect_url}

GET /api/payments/:booking_id/status
  Headers: {Authorization: Bearer token}
  Response: {status: "SUCCEEDED|PENDING|FAILED", amount}

POST /api/payments/webhook
  Headers: {stripe-signature: ...}
  Body: Stripe webhook payload
  Response: {received: true}
```

#### 🎬 Media/Gallery (No Auth Required)
```
GET /api/media
  Query: ?service_id=123&type=IMAGE
  Response: [{url, type, title, order}...]

POST /api/media (ADMIN ONLY)
  Body: FormData {file, service_id (optional), title, type}
  Response: {url, id, ...}

DELETE /api/media/:id (ADMIN ONLY)
  Response: {message: "Deleted"}
```

#### ⭐ Reviews (No Auth Required)
```
GET /api/reviews
  Query: ?service_id=123&booking_id=456
  Response: [{rating, comment, user_name, created_at}...]

POST /api/reviews (AUTH REQUIRED)
  Headers: {Authorization: Bearer token}
  Body: {booking_id, rating, comment}
  Response: {id, rating, comment, ...}
```

#### 👤 User Profile (AUTH REQUIRED)
```
GET /api/users/me
  Headers: {Authorization: Bearer token}
  Response: {id, email, first_name, last_name, role, created_at}

PATCH /api/users/me
  Headers: {Authorization: Bearer token}
  Body: {first_name, last_name, email, avatar_url}
  Response: {id, ...}

PATCH /api/users/me/password
  Headers: {Authorization: Bearer token}
  Body: {current_password, new_password}
  Response: {message: "Password updated"}
```

#### 📅 Availability (No Auth Required)
```
GET /api/availability
  Query: ?animateur_id=123&date=2026-05-15
  Response: [{time, available: true/false}...]

GET /api/availability/:animateur_id/calendar
  Query: ?month=05&year=2026
  Response: {availability_map: {date: [times]}}
```

#### 📞 Contact Form (No Auth Required)
```
POST /api/contact
  Body: {name, email, phone, message}
  Response: {id, message: "Received"}
```

---

### 3️⃣ ADMIN ENDPOINTS (ADMIN ONLY)

```
GET /api/admin/dashboard
  Response: {total_bookings, revenue, active_users, pending_assignments}

GET /api/admin/reservations
  Query: ?status=PENDING&page=1
  Response: [{booking with details}...]

PATCH /api/admin/reservations/:id
  Body: {status, assigned_animateur_id}
  Response: {id, status, assigned_to}

POST /api/admin/reservations/:id/send-payment-link
  Body: {email_template_id}
  Response: {message: "Sent"}

GET /api/admin/animateurs
  Response: [{id, name, rating, availability_count}...]

POST /api/admin/animateurs
  Body: {email, first_name, last_name, phone, bio}
  Response: {id, ...}

GET /api/admin/users
  Response: [{id, email, role, created_at, bookings_count}...]

POST /api/admin/stats
  Query: ?start_date=2026-01-01&end_date=2026-12-31
  Response: {revenue_total, bookings_count, avg_rating, ...}
```

---

## 🛠️ Technology Stack Required

```
Django 4.2+
Django REST Framework
Python 3.10+
PostgreSQL
Stripe API
Redis (optional, for caching/tasks)
Celery (optional, for async tasks)
```

---

## 📝 Implementation Order

### Phase 1: Core Auth + Database (1-2 days)
1. [ ] Setup Django project
2. [ ] Create User model with JWT
3. [ ] Create signup/login endpoints
4. [ ] Create token refresh endpoint
5. [ ] Email verification setup

### Phase 2: Services + Options (1 day)
1. [ ] Create Service model
2. [ ] Create Option model
3. [ ] Create GET endpoints
4. [ ] Create admin POST/PATCH/DELETE

### Phase 3: Bookings Core (2 days)
1. [ ] Create Booking model
2. [ ] Create BookingOption model
3. [ ] Create POST /api/bookings (create)
4. [ ] Create GET /api/bookings (list/detail)
5. [ ] Add price calculation logic

### Phase 4: Payments (1 day)
1. [ ] Stripe integration
2. [ ] Create Payment model
3. [ ] POST /api/payments/stripe
4. [ ] Webhook handler

### Phase 5: Availability + Admin (2 days)
1. [ ] Create Availability model
2. [ ] GET endpoints for availability
3. [ ] Admin dashboard
4. [ ] Admin assignment logic

### Phase 6: Polish (1 day)
1. [ ] Error handling
2. [ ] Logging
3. [ ] Rate limiting
4. [ ] Documentation

---

## 🔑 Key Business Logic to Implement

### 1. **Price Calculation**
```
final_price = base_price + sum(option_prices)

Option prices:
- FIXED: option.price × quantity
- PER_CHILD: option.price × nb_children × quantity  
- PER_HOUR: option.price × (duration_minutes/60) × quantity
```

### 2. **Booking Status Workflow**
```
User creates → PENDING
Payment successful → CONFIRMED
Animateur assigned → CONFIRMED (updated)
Animateur accepts → CONFIRMED
Event happens → DONE
User cancels (48h+) → CANCELLED (refund 100%)
User cancels (24h+) → CANCELLED (refund 50%)
User cancels (<24h) → CANCELLED (refund 0%)
```

### 3. **Animateur Assignment Logic**
```
1. Find animateurs available for date/time
2. Filter by service category expertise
3. Check no conflicts with other bookings
4. Send assignment request (PENDING status)
5. Wait for acceptance or timeout (24h)
6. If refused, try next animateur
7. If all refuse, notify admin
```

### 4. **Payment Processing**
```
1. User confirms booking (POST /api/bookings)
2. System creates Stripe Session
3. User pays on Stripe Checkout
4. Stripe webhook confirms payment
5. System marks booking as CONFIRMED
6. System assigns animateur
```

---

## 🧪 Testing Scenarios

### Test Case 1: Complete Booking Flow
```
1. User signs up
2. User browses services
3. User books service (date/time/options)
4. System calculates price: €150
5. User pays via Stripe
6. System confirms booking
7. Admin assigns animateur
8. Animateur accepts
9. Event happens
10. User leaves review ⭐⭐⭐⭐⭐
```

### Test Case 2: Cancellation with Refund
```
1. User has booking (status CONFIRMED)
2. User cancels 48h before → 100% refund
3. Payment status changes to REFUNDED
4. Animateur is notified
5. Booking status changes to CANCELLED
```

### Test Case 3: Admin Assignment
```
1. Booking created (PENDING)
2. Admin sees in dashboard
3. Admin selects animateur
4. System sends assignment request
5. Animateur has 24h to accept/refuse
6. If accepted → Booking CONFIRMED, time to event decreases
7. If refused → Try next animateur
```

---

## 🔒 Security Requirements

```
✅ JWT authentication (access + refresh tokens)
✅ CSRF protection
✅ Rate limiting (login: 5/min, API: 100/min per user)
✅ SQL injection protection (use ORM, parameterized queries)
✅ CORS configured properly
✅ Stripe webhook signature verification
✅ Email verification for new users
✅ Password reset token expires (24h)
✅ Sensitive data not in logs (passwords, tokens)
✅ HTTPS only in production
✅ Database backups automated
```

---

## 📊 Database Schema

```
Users
├── id (PK)
├── email (unique)
├── password_hash
├── role (enum)
├── created_at
└── updated_at

Services
├── id (PK)
├── name
├── description
├── base_price
├── duration_minutes
├── category
└── is_active

Options
├── id (PK)
├── service_id (FK)
├── name
├── price
└── pricing_type

Bookings
├── id (PK)
├── user_id (FK)
├── service_id (FK)
├── booking_date
├── booking_time
├── nb_children
├── final_price
├── status
└── created_at

Payments
├── id (PK)
├── booking_id (FK)
├── stripe_session_id
└── amount

... (See models.py section for full schema)
```

---

## 📦 Deliverables Checklist

- [ ] Django project setup
- [ ] All 12 models created + migrations
- [ ] JWT authentication working
- [ ] 30+ endpoints fully functional
- [ ] Stripe integration complete
- [ ] Admin panel working
- [ ] Automated testing (unit + integration)
- [ ] API documentation (Swagger/Postman)
- [ ] Database backups configured
- [ ] Error logging configured
- [ ] Production deployment ready
- [ ] README with setup instructions

---

## 🎯 Success Criteria

```
✅ All 30+ endpoints return correct responses
✅ Auth flow works (signup → login → refresh)
✅ Booking flow works (create → payment → assignment → done)
✅ Price calculation 100% accurate
✅ Admin assignment logic functional
✅ Cancellation refunds working
✅ Email notifications sending
✅ Database queries optimized (<100ms)
✅ 95%+ test coverage
✅ Zero security vulnerabilities
✅ Ready for production deployment
```

---

## 🚀 Deployment

### Local Development
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Production (Docker)
```bash
docker build -t funkidz-backend .
docker run -e DEBUG=False -e DATABASE_URL=... funkidz-backend
```

### Environment Variables
```
DEBUG=False
SECRET_KEY=...
DATABASE_URL=postgresql://...
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_BACKEND=...
EMAIL_HOST_USER=...
ALLOWED_HOSTS=funkidz.com,www.funkidz.com
CORS_ALLOWED_ORIGINS=https://funkidz.com
```

---

## 📞 Frontend Integration Points

Frontend expects all 30+ endpoints to return JSON with these structures:

```javascript
// Services
GET /api/services → [{id, name, description, price, duration, category, options}]

// Bookings
POST /api/bookings → {id, status, final_price, estimated_delivery}

// Auth
POST /api/auth/login → {access_token, refresh_token, user: {id, email, role}}

// Payments
POST /api/payments/stripe → {session_id, redirect_url}
```

See `lib/api-client.ts` in frontend for exact expected types.

---

## ✅ Ready to Start?

Frontend is 100% ready. Backend can start immediately.

**Total Backend Effort**: ~2-3 weeks for full implementation
- Week 1: Auth + Core models
- Week 2: Bookings + Payments
- Week 3: Admin + Polish

Then: 1 week integration testing with frontend.

---

**Questions? Refer to CODE_READY.md for frontend status**

Let's build Funkidz! 🚀
