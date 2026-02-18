# Funkidz Animation - Backend Django Setup

Ce document décrit la configuration requise pour le backend Django qui communique avec le frontend Next.js.

## Architecture

```
Frontend Next.js (ce projet)
        ↓
API REST Django Backend
        ↓
PostgreSQL Database
```

## Endpoints Required

Le backend Django doit exposer les endpoints API suivants :

### Authentication Endpoints

- `POST /api/auth/register/` - Inscription utilisateur
  - Body: `{ email, password, first_name, last_name }`
  - Response: `{ access, refresh }` or `{ token }`

- `POST /api/auth/login/` - Connexion utilisateur
  - Body: `{ email, password }`
  - Response: `{ access, refresh }` or `{ token }`

- `POST /api/auth/logout/` - Déconnexion (optionnel)
  - Headers: `Authorization: Bearer {token}`

- `GET /api/auth/me/` - Récupérer les infos utilisateur courant
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ id, email, first_name, last_name }`

- `POST /api/auth/refresh/` - Rafraîchir le token
  - Body: `{ token }`

- `POST /api/auth/password-reset/` - Demander réinitialisation
  - Body: `{ email }`

- `POST /api/auth/password-reset-confirm/` - Confirmer réinitialisation
  - Body: `{ token, password }`

### Services Endpoints

- `GET /api/services/` - Lister tous les services
  - Query Params: `search` (optional)
  - Response: `[{ id, name, description, base_price, duration }, ...]`

- `GET /api/services/{id}/` - Récupérer un service
  - Response: `{ id, name, description, base_price, duration }`

### Options Endpoints

- `GET /api/options/` - Lister toutes les options
  - Response: `[{ id, name, price }, ...]`

- `GET /api/options/{id}/` - Récupérer une option
  - Response: `{ id, name, price }`

### Reservations Endpoints (User)

- `GET /api/reservations/` - Lister les réservations de l'utilisateur
  - Headers: `Authorization: Bearer {token}`
  - Response: `[{ id, service, date, time, status, total_price }, ...]`

- `POST /api/reservations/` - Créer une réservation
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ service_id, date, time, duration, guest_count, client_first_name, client_last_name, client_email, client_phone, client_address, client_city, client_postal_code, notes, selected_options }`
  - Response: `{ id, service_id, total_price, status }`

- `GET /api/reservations/{id}/` - Récupérer une réservation
  - Headers: `Authorization: Bearer {token}`

- `PATCH /api/reservations/{id}/` - Modifier une réservation
  - Headers: `Authorization: Bearer {token}`

- `POST /api/reservations/{id}/cancel/` - Annuler une réservation
  - Headers: `Authorization: Bearer {token}`

### Admin Reservations Endpoints

- `GET /api/admin/reservations/` - Lister toutes les réservations
  - Headers: `Authorization: Bearer {admin_token}`
  - Query Params: `status`, `date_from`, `date_to` (optional)

- `GET /api/admin/reservations/{id}/` - Récupérer une réservation

- `PATCH /api/admin/reservations/{id}/` - Modifier une réservation

- `POST /api/admin/reservations/{id}/approve/` - Approuver une réservation

- `POST /api/admin/reservations/{id}/reject/` - Rejeter une réservation
  - Body: `{ reason }`

### Admin Services Endpoints

- `GET /api/admin/services/` - Lister tous les services (admin)
- `POST /api/admin/services/` - Créer un service
- `GET /api/admin/services/{id}/` - Récupérer un service
- `PATCH /api/admin/services/{id}/` - Modifier un service
- `DELETE /api/admin/services/{id}/` - Supprimer un service

### Payment Endpoints

- `POST /api/payments/create-session/` - Créer une session de paiement Stripe
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ reservation_id }`
  - Response: `{ url }` (URL de redirection Stripe)

- `POST /api/payments/confirm/` - Confirmer le paiement
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ session_id }`

## Database Models Required

### User Model
```
- id
- email (unique)
- password (hashed)
- first_name
- last_name
- created_at
```

### Service Model
```
- id
- name
- description
- base_price (decimal)
- duration (hours)
- is_active
- created_at
```

### ServiceOption Model
```
- id
- service (FK)
- name
- price (decimal)
- created_at
```

### Reservation Model
```
- id
- user (FK)
- service (FK)
- date (date)
- time (time)
- duration (hours)
- guest_count (int)
- client_first_name
- client_last_name
- client_email
- client_phone
- client_address
- client_city
- client_postal_code
- notes
- status (enum: pending, confirmed, rejected, cancelled)
- total_price (decimal)
- selected_options (M2M with ServiceOption)
- created_at
- updated_at
```

### Payment Model
```
- id
- reservation (FK)
- stripe_session_id
- amount (decimal)
- status (enum: pending, success, failed)
- created_at
```

## Authentication Method

Two options recommended:

### Option 1: JWT Tokens (Recommended)
Use Django REST Framework with `djangorestframework-simplejwt`
- `POST /api/auth/login/` returns `{ access, refresh }`
- Frontend sends `Authorization: Bearer {access_token}`

### Option 2: Session Tokens
Custom token-based auth with database storage
- `POST /api/auth/login/` returns `{ token }`
- Frontend sends `Authorization: Bearer {token}`

## CORS Configuration

The Django backend must allow CORS requests from:
- `http://localhost:3000` (development)
- `https://yourdomain.com` (production)

Use `django-cors-headers` package:
```python
INSTALLED_APPS = [
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://yourdomain.com",
]
```

## Stripe Integration

The backend must handle:
1. Create Stripe checkout session for payment
2. Verify webhook signatures from Stripe
3. Update reservation status on successful payment
4. Send confirmation emails

## Environment Variables for Backend

```
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/funkidz
STRIPE_SECRET_KEY=sk_test_your_key_here
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
```

## Frontend Configuration

Set these in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api  # or your production URL
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

## Testing the Integration

1. Start Django backend: `python manage.py runserver`
2. Start Next.js frontend: `npm run dev`
3. Test signup at `http://localhost:3000/auth/signup`
4. Test booking at `http://localhost:3000/booking`

## Security Notes

- Always use HTTPS in production
- Validate all inputs on backend
- Use secure cookies for sessions
- Implement rate limiting
- Use CSRF protection
- Sanitize user inputs
- Never expose sensitive data in API responses
