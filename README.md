# 🏕️ WanderLust

A full-stack Airbnb-inspired web application where users can explore, create, and review travel listings from around the world.

---
🌐 Live Demo — https://wanderlust-project-dr7b.onrender.com

> Note: App may take 30–50 seconds to load on first visit as Render free tier spins down after inactivity.

---

## 🛠️ Tech Stack

- **Backend** — Node.js, Express.js
- **Database** — MongoDB Atlas + Mongoose
- **Authentication** — Passport.js (Local Strategy)
- **Session Storage** — connect-mongo
- **Image Upload** — Cloudinary + Multer
- **Maps** — Mapbox GL JS
- **Templating** — EJS + EJS-Mate
- **Styling** — Bootstrap 5

---

## ✨ Features

- User registration, login, and logout
- Create, edit, and delete listings
- Upload listing images (stored on Cloudinary)
- Interactive maps for each listing (Mapbox)
- Leave and delete reviews with star ratings
- Authorization — only owners can edit/delete their listings
- Flash messages for success and error feedback
- Category filter — filter listings by mountains, beaches, cities etc.
- Responsive design — works on mobile, tablet and desktop

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mosharib-dev/wanderlust.git
cd wanderlust
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:
```env
ATLASDB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_access_token
```

### 4. Seed the database (optional)
```bash
node seed.js
```

### 5. Start the server
```bash
node app.js
```

Visit `http://localhost:8080`

---

## 🔑 Sample Login Credentials (after seeding)

| Username | Email | Password |
|---|---|---|
| rahul_explorer | rahul@example.com | password123 |
| priya_travels | priya@example.com | password123 |
| john_wanders | john@example.com | password123 |
| sofia_adventures | sofia@example.com | password123 |

---

## 📁 Project Structure

```
wanderlust/
├── controllers/        # Route logic
├── models/             # Mongoose schemas
├── routes/             # Express routers
├── views/              # EJS templates
├── Public/             # Static assets (CSS, JS)
├── utils/              # Helper classes (ExpressError, wrapAsync)
├── middleware.js        # Custom middleware
├── schema.js           # Joi validation schemas
├── app.js              # Main entry point
└── seed.js             # Database seeder
```

---

## ⚙️ Environment & API Notes

- **MongoDB Atlas** — Free M0 cluster is sufficient for development
- **Cloudinary** — Free tier offers 25GB storage
- **Mapbox** — Free tier includes 50,000 map loads/month

---

## 📄 License

This project is for educational purposes.
