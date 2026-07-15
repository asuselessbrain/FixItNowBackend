# FixItNow 🔧
**"Your Trusted Home Service Platform"**

FixItNow is a backend REST API for a home services marketplace. It enables customers to browse and book qualified service professionals (plumbing, electrical, cleaning, painting, etc.), make payments securely via Stripe, track bookings, and leave reviews. Technicians can manage their service profiles, customize their availability slots, and update job progress. Admins oversee the entire platform, manage users, and moderate categories.

---

## 🚀 Live Demo & Repository
- **Client Deployment:** https://assignment-4-arfan.vercel.app
- **Server Base URL:** `http://localhost:8000/api/v1`

---

## 🛠️ Tech Stack

- **Core Runtime:** Node.js (ES Module support)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database ORM:** Prisma ORM
- **Database Engine:** PostgreSQL (Hosted on Neon)
- **Payment Processor:** Stripe API
- **Development Tooling:** tsx (TypeScript Execute), ESLint, Prettier

---

## 📋 Features

### 👤 Public Features
- **Browse Categories:** Explore all service categories (Plumbing, Electrical, Cleaning, etc.).
- **Browse Technicians:** View all registered service professionals.
- **Search & Filter:** Search technicians by name, skills, and rating.
- **Technician Profiles:** View detailed bio, experience, pricing, reviews, and ratings.

### 👤 Customer Features
- **Register & Login:** Secure authentication with password hashing and JWT access/refresh tokens.
- **Profile Management:** Update personal details (Name, Address, Phone, Avatar).
- **Time Slot Bookings:** Select a service, technician, and available time slot on a specific date.
- **Past Date Validation:** Safety checks prevent booking services on dates that have already passed.
- **Stripe Payments:** Make payments securely for accepted bookings. Webhook validations protect against unauthorized updates on cancelled bookings.
- **Booking Cancellations:** Cancel bookings anytime before the job starts (`IN_PROGRESS` status), automatically releasing the time slot back to `AVAILABLE`.
- **Review & Ratings:** Provide feedback with star ratings and reviews for completed jobs.

### 👤 Technician Features
- **Profile Creation & Customization:** Configure skills, years of experience, bio, location, and pricing.
- **Availability Management:** Add or modify daily slots. Validation checks prevent deleting slots with active bookings.
- **Past Date Validation:** Prevent creating or updating availability slots in past dates.
- **Job lifecycle management:** Update booking status progressively:
  - `REQUESTED` ➔ `CONFIRMED` / `REJECTED`
  - `PAID` ➔ `IN_PROGRESS` ➔ `COMPLETED`

### 👤 Admin Features
- **User Moderation:** View all users with filters. Ban or unban customers and technicians.
- **Booking Overview:** Browse all jobs, payments, and histories across the system.
- **Category Control:** Create, update, and toggle active/inactive status for service categories.

---

## 🗄️ Database Schema & Architecture

The database consists of the following key tables:
- **User:** Stores credentials, personal profile info, role (`customer`, `technician`, `admin`), and status (`active`, `banned`).
- **TechnicianProfiles:** Contains professional technician details (skills, bio, price, average rating).
- **Categories:** Stores service classifications (active/inactive).
- **Service:** Stores specific services provided by technicians.
- **TechnicianSlots:** Manages specific daily slots for technicians (`AVAILABLE`, `BOOKED`).
- **Bookings:** Tracks job status (`REQUESTED`, `REJECTED`, `CONFIRMED`, `PAID`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
- **Payments:** Records Stripe transactions (transactionId, amount, payment status).
- **Review:** Connects customer rating and reviews to technicians and services.

---

## 🧭 API Endpoints

### 🔐 Authentication & Profile
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/v1/auth/register` | Public | Register customer/technician |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user, return JWT tokens |
| `PATCH` | `/api/v1/auth/update-profile` | Registered | Update profile details |

### 🛠️ Service Categories
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/v1/categories` | Public | Fetch all active categories |
| `GET` | `/api/v1/categories/:id` | Public | Fetch single category details |
| `POST` | `/api/v1/categories` | Admin | Create a service category |
| `PATCH` | `/api/v1/categories/:id` | Admin | Update category details |
| `PATCH` | `/api/v1/categories/:id/toggle-status` | Admin | Activate / deactivate category |

### 📅 Bookings & Jobs
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/v1/booking` | Customer | Create a booking request |
| `GET` | `/api/v1/booking/my-bookings` | Customer | Get customer's booking list |
| `GET` | `/api/v1/booking/technician-bookings` | Technician | View incoming job requests |
| `GET` | `/api/v1/booking/:bookingId` | Authorized | View details of a specific booking |
| `PATCH` | `/api/v1/booking/:bookingId/accept` | Technician | Confirm booking (`CONFIRMED`) |
| `PATCH` | `/api/v1/booking/:bookingId/reject` | Technician | Decline booking (`REJECTED`) |
| `PATCH` | `/api/v1/booking/:bookingId/in-progress`| Technician | Start the job (`IN_PROGRESS`) |
| `PATCH` | `/api/v1/booking/:bookingId/complete` | Technician | Complete the job (`COMPLETED`) |
| `PATCH` | `/api/v1/booking/:bookingId/cancel-by-customer` | Customer | Cancel booking (before it starts) |

### 💳 Payments
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/v1/payment/checkout-session` | Customer | Create Stripe checkout session |
| `GET` | `/api/v1/payment/history` | Customer | Get user's payment history |
| `GET` | `/api/v1/payment/:paymentId` | Customer/Admin | View detailed payment transaction |
| `POST` | `/api/v1/payment/webhook` | Webhook | Handle Stripe successful payment events |

### 📅 Technician Management
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `PATCH` | `/api/v1/technician` | Technician | Update technician service profile |
| `PUT` | `/api/v1/technician-time-slot` | Technician | Update daily availability slots |

### ⭐ Reviews
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/v1/reviews` | Customer | Leave feedback for a completed job |

### 👑 Admin Moderation
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/v1/user` | Admin | View all users (Search, Filter, Sort) |
| `PATCH` | `/api/v1/user/:userId/status` | Admin | Update user status (ban/unban) |
| `GET` | `/api/v1/booking` | Admin | View all bookings in system |

---

## 🛠️ Setup & Installation

### 1. Clone the repository and install dependencies
```bash
git clone <repository-url>
cd Assignment-4
yarn install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=8000
NODE_ENV=development

# Database Connection (Neon Postgres)
DATABASE_URL="your-postgresql-url"

# Security
SALT_ROUNDS=salt-rounds-number
JWT_TOKEN_SECRET="your-jwt-token-secret"
JWT_TOKEN_EXPIRES_IN="your-jwt-expires-in"
JWT_REFRESH_TOKEN_SECRET="your-jwt-refresh-secret"
JWT_REFRESH_TOKEN_EXPIRES_IN="your-jwt-refresh-token-expires-in"

# Stripe Settings
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-signing-secret"

# Email Configuration
EMAIL_HOST="your-email-host"
EMAIL_PORT="your-email-port"
EMAIL_USER="your-smtp-email"
EMAIL_PASS="your-smtp-app-password"
```

### 3. Setup Database Schema
Execute Prisma migrations to set up schema structures in Neon Postgres:
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Seed Admin Account
To seed default admin credentials, run:
```bash
npx tsx lib/seedAdmin.ts
```

### 5. Running the Application

#### Start local server:
```bash
yarn dev
```

#### Listen to Stripe Webhooks locally:
To handle Stripe callbacks locally, run the Stripe listener to forward events:
```bash
yarn stripe
```