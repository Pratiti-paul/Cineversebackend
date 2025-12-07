🎬 CineVerse

CineVerse offers a smart recommendation system that personalizes movie suggestions based on user preferences, genres, and ratings.
It allows users to explore trending movies, browse by genre, search movies with pagination, and maintain their own watchlists — making movie discovery simple and enjoyable.

🌟 Features
🎥 Movie Discovery

Latest Releases

Trending Movies

🎭 Genre-Based Browsing

Thriller

Drama

Kids

Action & Adventure

🔍 Smart Search System

Search by movie title

Live suggestions

Search results page with pagination

📌 User Watchlist

Add movies to watchlist

Remove movies from watchlist

Persistent per-user

🔐 User Authentication

Signup

Login

Protected routes

JWT verification

📝 User Reviews

Add your own reviews

View other user reviews

🛠️ Tech Stack
Frontend

React

React Router

Axios

Context API

Custom CSS

Backend

Node.js

Express.js

Database

PostgreSQL

Prisma ORM

Authentication

JWT-based login/signup

Hosting

Frontend: Vercel

Backend: Render

Database: Neon

External API

TMDB API

📁 Project Structure
CineVerse/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DetailSkeleton.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Hero.css
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── LoadingSpinner.css
│   │   │   ├── MovieCard.jsx
│   │   │   ├── MovieCard.css
│   │   │   ├── MovieCardSkeleton.jsx
│   │   │   ├── Nav.jsx
│   │   │   ├── Nav.css
│   │   │   ├── Pagination.jsx
│   │   │   ├── Pagination.css
│   │   │   ├── RankedRow.jsx
│   │   │   ├── RankedRow.css
│   │   │   ├── RowSkeleton.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SearchBar.css
│   │   │   ├── Skeleton.css
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Detailspage.jsx
│   │   │   ├── Detailspage.css
│   │   │   ├── Home.jsx
│   │   │   ├── Home.css
│   │   │   ├── Login.jsx
│   │   │   ├── Login.css
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── MovieDetails.css
│   │   │   ├── Profile.jsx
│   │   │   ├── Profile.css
│   │   │   ├── Recommendations.jsx
│   │   │   ├── Recommendations.css
│   │   │   ├── SearchResults.jsx
│   │   │   ├── SearchResults.css
│   │   │   ├── Signup.jsx
│   │   │   ├── Signup.css
│   │   │   ├── Watchlist.jsx
│   │   │   ├── Watchlist.css
│   │   │   ├── WelcomePage.jsx
│   │   │   ├── WelcomePage.css
│   │   │
│   │   ├── api.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   ├── .env
│   │
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── reviewController.js
│   │   ├── userController.js
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── moviesRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── userRoutes.js
│   │
│   ├── server.js
│   ├── .env
│   ├── package.json
│
├── .gitignore
└── README.md

🚀 Getting Started
✅ Prerequisites

Install the following:

Node.js (v16+)

NPM or Yarn

PostgreSQL

Git

🏗️ Installation
1️⃣ Clone the Repository
git clone https://github.com/your-username/CineVerse.git
cd CineVerse

2️⃣ Backend Setup
cd backend
npm install

Create .env inside backend
DATABASE_URL="postgresql://username:password@localhost:5432/cineverse"
JWT_SECRET="your-super-secret-key"
TMDB_API_KEY="your_tmdb_api_key"
PORT=8080

Run Prisma Migration
npx prisma migrate dev --name init

Start Backend
npm run dev


📌 Backend runs at: http://localhost:8080

3️⃣ Frontend Setup
cd ../frontend
npm install

Create .env inside frontend
VITE_API_URL="http://localhost:8080"
VITE_TMDB_IMAGE_BASE="https://image.tmdb.org/t/p/w500"

Start Frontend
npm run dev


📌 Frontend runs at: http://localhost:5173

🔐 Authentication Flow
Signup

User registers

Password hashed using bcrypt

User stored in database

JWT token issued

Token saved in localStorage

Login

Credentials validated

Token re-issued

AuthContext updates user

Protected Routes

Frontend verifies token

Backend verifies via verifyToken middleware

Logout

Token cleared from storage

Redirect to login

🗄️ Database Schema (Prisma)
model User {
  id           Int        @id @default(autoincrement())
  name         String?
  email        String     @unique
  passwordHash String
  createdAt    DateTime   @default(now())

  watchlists   Watchlist[]
  reviews      Review[]
}

model Watchlist {
  id         Int      @id @default(autoincrement())
  user       User     @relation(fields: [userId], references: [id])
  userId     Int
  tmdbId     Int
  title      String?  @db.VarChar(512)
  posterPath String?  @db.VarChar(512)
  addedAt    DateTime @default(now())

  @@unique([userId, tmdbId], name: "ux_user_tmdb")
}

model Review {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  tmdbId    Int
  content   String   @db.Text
  rating    Int?
  createdAt DateTime @default(now())
}

🔌 API Endpoints
Auth
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/verify
POST /api/auth/logout

Movies
GET /api/movies/trending
GET /api/movies/latest
GET /api/movies/genre/:name
GET /api/movies/search?query=
GET /api/movies/:id
GET /api/movies/:id/reviews

Watchlist
GET    /api/user/watchlist
POST   /api/user/watchlist
DELETE /api/user/watchlist/:id

🛡️ Security Features

JWT authentication

Password hashing (bcryptjs)

Protected routes on both frontend & backend

CORS configuration

Environment variables hidden in .env

🧪 Troubleshooting
❗ Watchlist not updating?

Check token in localStorage

Ensure Axios adds token header via AuthContext

❗ TMDB API not working?

Ensure .env includes:

TMDB_API_KEY=your_key_here

❗ CORS Errors?

Backend must include:

app.use(cors({ origin: "*" }));

📦 Build & Deployment
Frontend
npm run build

Deployment Options

Frontend → Vercel, Netlify

Backend → Render

Database → Neon

📜 License

MIT License

👨‍💻 Author

Pratiti Paul
GitHub: https://github.com/Pratiti-paul

🎥 CineVerse — Escape into Cinema ✨