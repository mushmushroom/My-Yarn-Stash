# Yarn Stash

A personal yarn stash manager. Track your skeins by brand, color, fiber content and yardage, and plan knitting/crochet projects by reserving yarn from your stash.

## Features

- Add and edit skeins with brand, color, weight, yardage, fiber content, and notes
- Filter your stash by brand, color, and fiber
- Create projects and assign skeins to them — reserved weight is tracked automatically
- Autocomplete yarn names from your existing stash

## Tech stack

**Frontend:** React 19, Vite, Tailwind CSS v4, TanStack Query, React Hook Form, Zod, Zustand

**Backend:** FastAPI, SQLModel, PostgreSQL, psycopg2

---

## Running locally

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker (for PostgreSQL)

### 1. Start the database

```bash
cd backend
docker compose up -d
```

### 2. Start the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy the example env file and adjust values if needed:

```bash
cp backend/.env.example backend/.env
```

Then run:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/documentation`.

### 3. Start the frontend

```bash
cd frontend
npm install
```

Copy the example env file:

```bash
cp frontend/.env.example frontend/.env
```

Then run:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Deployment

### Frontend → Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com), set the root directory to `frontend`
3. Add environment variable: `VITE_BACKEND_URL=https://your-backend-url`
4. Deploy

### Backend → Railway

1. Create a new project at [Railway](https://railway.app)
2. Add a **PostgreSQL** database service — Railway will provide a `DATABASE_URL`
3. Add your backend as a service, set root directory to `backend`
4. Set environment variables:
   ```
   DATABASE_URL=<provided by Railway>
   CORS_ORIGINS=["https://your-frontend.vercel.app"]
   ```
5. Railway will auto-detect Python and run `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## Forking and customizing

Feel free to fork this repo and make it your own. Some things you might want to adjust:

- **Brands** — currently seeded manually via the API; add your own brands through the `/documentation` endpoint
- **Fiber types** — defined in `backend/models.py` as the `Fiber` enum; add or remove fiber types there
- **Categories** — same pattern, in the `Category` enum in `backend/models.py`
- **Color filter palette** — defined in `frontend/src/lib/constants.ts` in `COLOR_MAP`
- **Brand logos** — add logo images to `frontend/public/yarn-logos/` and map them in `brandLogos` in `constants.ts`

> Note: this app has no authentication. If you deploy it publicly, anyone with the URL can modify your stash. Consider adding auth (e.g. via [FastAPI Users](https://fastapi-users.github.io/fastapi-users/)) before sharing the URL widely.
