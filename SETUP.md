# Setup Instructions

## Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

## Backend
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn api.server:app --reload
# Backend runs at http://127.0.0.1:8000
```

## Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://127.0.0.1:5173
```

## Tests
```bash
pytest -v
# Expected: 60 passed in ~1.6s
```

## Production Build
```bash
cd frontend
npm run build
# Output: dist/ directory (deploy to Vercel/Netlify)
```

## Deployment
- **Frontend**: Deploy `dist/` to Vercel or Netlify.
- **Backend**: Deploy `api/server.py` and `models/` to Render, Railway, or AWS Lambda.
- **Environment Variables**: None required (pure NumPy, no external APIs).
