# 🎬 CineVerse Backend

The backend API for CineVerse, built with Node.js, Express, and PostgreSQL (via Prisma). It handles user authentication, movie data integration, reviews, and watchlists.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon DB)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs

---

## 🏗️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- PostgreSQL Database URL

### 1️⃣ Setup Workspace
Navigate to the backend directory:
```bash
cd backend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment
Create a `.env` file in the `backend` directory:
```env
PORT=8080
DATABASE_URL="postgresql://username:password@host:5432/database"
JWT_SECRET="your_super_secret_jwt_key"
TMDB_API_KEY="your_tmdb_api_key"
NODE_ENV="development"
```

### 4️⃣ Database Migration
Run Prisma migrations to set up your database schema:
```bash
npx prisma migrate dev --name init
```

### 5️⃣ Start Server
```bash
npm run dev
```
The server will start at `http://localhost:8080`.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login user & return token |
| `GET` | `/api/auth/verify` | Verify current session |
| `POST` | `/api/auth/logout` | Logout user |

### Movies (Public)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/movies/trending` | Get trending movies |
| `GET` | `/api/movies/latest` | Get latest releases |
| `GET` | `/api/movies/genre/:name` | Get movies by genre |
| `GET` | `/api/movies/search` | Search movies (`?query=title`) |
| `GET` | `/api/movies/:id` | Get movie details |
| `GET` | `/api/reviews/:id` | Get reviews for a movie |

### User Actions (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/user/watchlist` | Get user's watchlist |
| `POST` | `/api/user/watchlist` | Add movie to watchlist |
| `DELETE` | `/api/user/watchlist/:id` | Remove from watchlist |
| `POST` | `/api/reviews` | Post a review |
| `GET` | `/api/user/profile` | Get user profile stats |
| `PUT` | `/api/user/profile` | Update profile info |

---

## 🗄️ Database Schema

### User
- Handles authentication and profile data.
- Relations: `Watchlist[]`, `Review[]`.

### Watchlist
- Stores movies saved by users.
- Unique constraint on `[userId, tmdbId]` to prevent duplicates.

### Review
- Stores user-generated reviews and ratings.

---

## 🛡️ Security
- **Passwords**: Hashed using `bcryptjs`.
- **Tokens**: JWT signed tokens for session management.
- **Middleware**: Protected routes verify valid JWT signatures.
- **CORS**: Configured to allow frontend requests.

---

## 📜 License
MIT License.

## 👨‍💻 Author
**Pratiti Paul**  
- [GitHub](https://github.com/Pratiti-paul)