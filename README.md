# YuBu 📄✨

> **YuBu** is a modern full-stack **MERN** platform designed for software developers to share resumes, receive constructive peer feedback, and help each other land tech roles. Developers upload resume PDFs, view in-browser previews, provide granular section-by-section feedback, and earn community reputation points for their contributions.

---

## 🚀 Key Features

- **🔐 Robust JWT Authentication**: Secure session management using short-lived Access Tokens and long-lived Refresh Tokens stored in `httpOnly`, `SameSite=Lax` cookies with automatic silent token rotation via Axios interceptors.
- **📄 Resume PDF Upload & Cloud Storage**: Upload resume PDFs with titles and target role descriptions. Integrated with **Cloudinary** for persistent cloud storage and server streaming.
- **👁️ In-Browser PDF Preview**: Seamless built-in PDF viewer inside the app to inspect resumes without forced downloads.
- **⭐ Peer Review & Scoring System**:
  - 1 to 5 star rating system.
  - Granular, dynamic section-by-section critiques (e.g. *Summary*, *Technical Skills*, *Work Experience*, *Projects*).
  - High-level actionable takeaway advice.
  - Self-review prevention (users cannot review their own resumes).
  - Compound unique constraint preventing duplicate reviews on the same resume by the same reviewer.
- **🏆 Gamified Community Reputation**: Reviewers earn **+1 reputation point** for every helpful peer review they submit.
- **🎨 Sleek Developer UI**: Dark-themed responsive interface built with React, Vite, Tailwind CSS, and React Router v6.

---

## 🏗️ Repository Structure

```
YuBu/
├── backend/
│   ├── public/
│   │   ├── resumes/               # Persistent local copies for reliable PDF streaming
│   │   └── temp/                  # Temporary staging directory for Multer uploads
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── resume.controller.js # Upload, stream, browse, and delete resumes
│   │   │   ├── review.controller.js # Create and retrieve peer reviews (+1 rep)
│   │   │   └── user.controller.js   # Register, login, logout, refresh-token, me
│   │   ├── db/
│   │   │   └── index.js           # MongoDB Atlas connection handler
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js # verifyJWT cookie/header authentication
│   │   │   └── multer.js          # File upload handler for avatars and PDFs
│   │   ├── models/
│   │   │   ├── resume.model.js    # Resume schema (title, pdfUrl, status, owner)
│   │   │   ├── review.model.js    # Review schema (feedback sections, score, reviewer)
│   │   │   └── user.js            # User schema (bcrypt hash, tokens, reputation)
│   │   ├── routes/
│   │   │   ├── resume.routes.js   # /api/v1/resumes routes
│   │   │   ├── review.routes.js   # /api/v1/reviews routes
│   │   │   └── user.routes.js     # /api/v1/users routes
│   │   ├── utils/
│   │   │   ├── ApiError.js        # Standardized API error class
│   │   │   ├── ApiResponse.js      # Standardized API JSON response envelope
│   │   │   ├── asyncHandler.js    # Async wrapper catching controller exceptions
│   │   │   └── cloudinary.js      # Cloudinary upload and deletion helper
│   │   ├── app.js                 # Express application & CORS configuration
│   │   ├── constants.js           # Database constants
│   │   └── index.js               # Entry point starting the HTTP server
│   ├── .env                       # Environment configuration
│   └── package.json
│
└── frontend/
    ├── index.html                 # Vite HTML entry
    ├── vite.config.js             # Vite configuration with React & /api proxy
    ├── tailwind.config.js         # Tailwind CSS styling configuration
    ├── package.json
    └── src/
        ├── api/
        │   └── axios.js           # Axios instance with credentials and 401 retry interceptor
        ├── components/
        │   ├── Navbar.jsx         # Sticky top navigation bar
        │   ├── ProtectedRoute.jsx # Route guard redirecting unauthenticated users to /login
        │   └── PublicRoute.jsx    # Route guard redirecting authenticated users to /
        ├── context/
        │   └── AuthContext.jsx    # Global user session and auth state provider
        ├── pages/
        │   ├── BrowseResumes.jsx  # Browse peer resumes open for review
        │   ├── Dashboard.jsx      # User profile, statistics, and quick navigation
        │   ├── Login.jsx          # Login form with email/username support
        │   ├── MyResumes.jsx      # Manage own resumes, status badges, and delete actions
        │   ├── Register.jsx       # Account registration with optional avatar upload
        │   ├── ResumeDetail.jsx   # In-browser PDF preview, review form & feedback list
        │   └── UploadResume.jsx   # Resume PDF upload form with validation
        ├── App.jsx                # Router declaration and route hierarchy
        ├── index.css              # Tailwind base imports
        └── main.jsx               # React DOM root render
```

---

## 📡 API Endpoints

### 1. Authentication & Users (`/api/v1/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register account with fullName, username, email, password & avatar |
| `POST` | `/login` | Public | Authenticate with username/email + password; sets httpOnly cookies |
| `POST` | `/refresh-token` | Public (Cookie) | Rotates tokens and issues new access/refresh tokens |
| `POST` | `/logout` | Authenticated | Clears cookies and revokes refresh token in database |
| `GET`  | `/me` | Authenticated | Returns currently authenticated user profile |

### 2. Resumes (`/api/v1/resumes`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Authenticated | Upload resume PDF with title and target role notes |
| `GET`  | `/my` | Authenticated | Fetch resumes uploaded by the current user |
| `GET`  | `/browse` | Authenticated | Fetch peer resumes uploaded by other developers |
| `GET`  | `/:id` | Authenticated | Fetch details and author of a specific resume |
| `GET`  | `/:id/file` | Public / Cookie | Stream PDF inline for in-browser preview |
| `DELETE`| `/:id` | Authenticated | Delete own resume from cloud storage, server, and database |

### 3. Reviews (`/api/v1/reviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/:resumeId` | Authenticated | Submit review with 1–5 score, section notes & overall advice (+1 rep) |
| `GET`  | `/:resumeId` | Authenticated | Fetch all peer reviews for a specific resume |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas database cluster
- Cloudinary account for media assets

### 1. Backend Setup
```bash
cd backend
npm install
```

Configure your `backend/.env` file:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_generated_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_generated_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:
```bash
npm run dev
```
*(Server will start on `http://localhost:8000`)*

### 2. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*(Frontend will run on `http://localhost:5173`)*

---

## 🧪 Testing the User Journey

1. **Register & Login**:
   - Navigate to `http://localhost:5173/register` and create an account.
   - You will automatically be authenticated and redirected to your **Dashboard**.
2. **Upload a Resume**:
   - Click **"Upload Resume"** in the top navigation.
   - Enter a title (e.g. *Full Stack Engineer 2026*), optional role focus notes, and select your resume PDF.
3. **Track Your Resume**:
   - Go to **"My Resumes"** to see your resume with its `pending` status badge.
   - Click **"View Details & Feedback"** to see the in-browser PDF preview.
4. **Peer Review**:
   - Create or switch to a second account and visit **"Browse Resumes"**.
   - Open any peer resume, inspect the PDF preview, pick a 1–5 star rating, add section notes, and submit.
   - Your reputation counter will immediately increment by **+1 pt**!

---

## 🛡️ Security Highlights

- **Passwords**: Hashed with `bcrypt` using 10 salt rounds in pre-save hooks.
- **JWT Storage**: Tokens stored in `httpOnly`, `SameSite=Lax` cookies, preventing client-side script access.
- **Protection Against Self-Review**: Backend rejects review submissions if the reviewer matches the resume author.
- **Duplicate Prevention**: Compound index enforces maximum 1 review per reviewer per resume.
