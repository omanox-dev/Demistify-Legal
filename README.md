# Demistify: AI-Powered Legal Document Simplifier

This project helps non-legal professionals understand complex legal documents using AI.

link to demo Video Of Application :- 

Project Overview :- https://screenrec.com/share/DV5xI2v0FW

Project Initial Development Link :- https://screenrec.com/share/DV5xI2v0FW
## Features

- Upload or paste legal documents
- AI-powered simplification and summary (optional GenAI integration)
- Clean, easy-to-use interface

## Quick start (dev)

1. Backend

	cd backend
	# create and activate a virtual environment, install deps
	python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
	# copy env example and set SECRET_KEY and any API keys
	copy ..\.env.example .env
	uvicorn main:app --reload --port 8000

2. Frontend

	cd frontend
	npm install
	npm run dev

The frontend expects the API at `http://localhost:8000` by default.

## Docs

- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`

## Important notes

- Do NOT commit real secrets or `.env` with API keys to the repository. Use `.env.example` to document required variables.
- The local SQLite DB file `demistify.db` is intentionally ignored; do not commit it. If you need a clean DB for CI, create a fresh one at runtime.
- Tests are present under `backend/` (pytest). If you want tests included in the public repo, remove the test-ignore lines from `.gitignore`.

---

This is an MVP for the Google Gen AI Hackathon. Contributions and feedback are welcome!
