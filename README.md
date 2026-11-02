# YuBu 🎓📺

> **YuBu** is a modern developer learning platform built on the **MERN** stack (MongoDB, Express.js, React, Node.js). Think Udemy meets YouTube — designed specifically for developers, where instructors publish comprehensive video courses, and students enroll, stream lessons, take interactive quizzes, and track progress.

---

## 🏗️ Repository Architecture

The project is structured into two decoupled directories:

```
YuBu/
├── backend/                  # Node.js, Express & MongoDB backend service
│   ├── public/temp/          # Temporary disk storage for Multer file uploads
│   ├── src/
│   │   ├── controllers/      # Route controllers (user, courses, etc.)
│   │   ├── db/               # Database connection logic
│   │   ├── middlewares/      # Multer, JWT authentication & role-based access
│   │   ├── models/           # Mongoose schemas (User, Video/Course)
│   │   ├── routes/           # Express API route declarations
│   │   ├── utils/            # Async handlers, ApiError, ApiResponse, Cloudinary
│   │   ├── app.js            # Express application configuration
│   │   ├── constants.js      # Global constants & DB name
│   │   └── index.js          # Server entry point & DB startup
│   ├── .env.sample           # Sample environment variables
│   ├── package.json          # Backend dependencies and scripts
│   └── .prettierrc           # Prettier code formatting rules
└── frontend/                 # React frontend application (Phase-ready)
```

---

## 🗺️ Project Roadmap & Phases

- [x] **Phase 1: Auth, Roles & User Profiles (YuBu Core)**
  - JWT Authentication (Access & Refresh tokens with HTTP-only cookies)
  - Role-based Access Control (`student`, `instructor`, `admin`)
  - Developer profiles (headline, bio, social links, watch history, enrolled courses)
  - Cloudinary avatar & cover image uploads with Multer
- [ ] **Phase 2: Course, Section & Lesson CRUD with Uploads**
- [ ] **Phase 3: Catalog, Search, Filters & Pagination**
- [ ] **Phase 4: Enrollment, Video Player & Progress Tracking**
- [ ] **Phase 5: Quizzes, Reviews & Certificates**
- [ ] **Phase 6: Emails, Dashboards, Validation, Rate Limiting & Tests**
- [ ] **Phase 7: Deployment, README, Screenshots & Buffer**

---

## 🚀 Phase 1 API Endpoints (`/api/v1/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register student/instructor with avatar & cover image |
| `POST` | `/login` | Public | Authenticate user, receive JWTs in cookies & body |
| `POST` | `/refresh-token` | Public / Cookie | Rotate and issue new access & refresh tokens |
| `POST` | `/logout` | Authenticated | Clear user refresh token & invalidate cookies |
| `POST` | `/change-password`| Authenticated | Securely update password with bcrypt verification |
| `GET`  | `/current-user` | Authenticated | Retrieve current authenticated user profile |
| `PATCH`| `/update-account` | Authenticated | Update full name, headline, bio & developer links |
| `PATCH`| `/avatar` | Authenticated | Upload & replace profile avatar (Cloudinary) |
| `PATCH`| `/cover-image` | Authenticated | Upload & replace channel cover image (Cloudinary) |
| `GET`  | `/profile/:username` | Authenticated | Fetch public profile and aggregated stats |
| `PATCH`| `/become-instructor` | Authenticated | Upgrade role to instructor |
| `GET`  | `/history` | Authenticated | Fetch user video/lesson watch history |

---

## 🛠️ Getting Started (Backend)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Configure your `.env` file (refer to `.env.sample`):
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
