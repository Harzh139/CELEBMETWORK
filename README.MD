# CelebNetwork

A modern web app for discovering, following, and recommending celebrities.  
**Frontend:** Next.js (Vercel)  
**Backend:** NestJS (Render)  
**Database:** PostgreSQL  
**AI:** GROQ/OpenAI for recommendations  
**Image Search:** Google Custom Search API

---

## 🚀 Features

- Sign up & Login as a fan (regular user)
- AI-powered celebrity suggestions
- Follow/unfollow your favorite celebrities
- Download celebrity profiles as PDF
- Modern, mobile-friendly UI
- Automatic celebrity images (with fallback avatar)
- Secure: Only logged-in users can add celebrities or follow/unfollow

---

## 🖥️ Live Demo

- **Frontend (Vercel):** [your-frontend-url.vercel.app](https://celebmetwork-harzh139s-projects.vercel.app/)
- **Backend (Render):** [https://celebmetwork-8.onrender.com](https://celebmetwork-8.onrender.com)

---

## 📝 How to Use (For Non-Programmers)

1. **Visit the website** (see "Live Demo" above).
2. **Sign up** as a fan (regular user).
3. **Log in** with your email and password.
4. **Browse celebrities** or use the AI recommender to discover new ones.
5. **Follow** celebrities you like.
6. **Download their profile as a PDF** if you want.
7. **Add a new celebrity** (if you’re logged in as a fan).

---

## 🛠️ Local Setup (For Developers)

### 1. Clone the Repository

```sh
git clone https://github.com/Harzh139/CELEBMETWORK
cd celebnetwork-app
```

### 2. Configure Environment Variables

Create `.env` files in both `backend` and `frontend` directories.  
**Backend `.env` example:**
```
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CX=your_google_cx_id
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=celebnetwork
JWT_SECRET=your_jwt_secret
```

**Frontend `.env.local` example:**
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Start the Application

With Docker:
```sh
docker-compose up --build
```

Or manually:
```sh
cd backend
npm install
npm run start:dev

cd ../frontend
npm install
npm run dev
```

---

## Image Handling

- Celebrity images are fetched automatically from Google Custom Search API.
- If no image is found or the image is broken, a default avatar (`/default-avatar.png`) from the `frontend/public` directory is used.
- To test the fallback, remove or break the image URL and reload the page.

---

## Notes

- Make sure your Google Programmable Search Engine is set to "Search the entire web" and image search is enabled.
- Update `frontend/next.config.js` to allow remote images:
  ```js
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  }
  ```
- API keys should **never** be exposed to the frontend.

---

## Troubleshooting

- If you encounter issues, check the browser console and network tab for errors.
- Ensure all services are running in Docker and check logs for any errors.
- For database issues, make sure PostgreSQL is running and the credentials in the `.env` file are correct.