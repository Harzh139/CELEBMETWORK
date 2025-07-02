# CelebNetwork

A full-stack application for celebrity discovery and recommendations, powered by NestJS (backend), Next.js (frontend), PostgreSQL, and AI (GROQ/OpenAI).

---

## Features

- User authentication (fan/celebrity roles)
- Celebrity search and recommendations (AI-powered)
- Celebrity info and stats
- Modern frontend with Next.js
- Celebrity images fetched automatically from Google Custom Search API (no uploads required)
- Fallback avatar for missing/broken images

---

## Prerequisites

- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/)
- GROQ/OpenAI API key (for AI-powered features)
- Google Custom Search API key and CX ID (for celebrity images)

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/celebnetwork-app.git
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