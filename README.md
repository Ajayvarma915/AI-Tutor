# AI_Tutor

AI_Tutor is a full-stack AI-powered tutoring application consisting of three components:

- `client` – Frontend (Next.js)
- `server` – Backend (Node.js / Express)
- `python_AiTutor` – AI logic or microservice (FastAPI, runs independently)

---

## 📁 Project Structure

AI_Tutor/ │ ├── client/ # Frontend (Next.js) ├── server/ # Backend (Node.js/Express) └── python_AiTutor/ # Python microservice (FastAPI)

yaml
Copy
Edit

---

## 🚀 Prerequisites

- Node.js and npm
- Python 3.8+
- `pip` or `conda`
- FastAPI dependencies (see below)

---

## 🧠 How to Run Each Module

### 1. Run the Frontend (client)

```bash
cd client
npm install
npm run dev
Frontend will be available at: http://localhost:3000

2. Run the Backend (server)
bash
Copy
Edit
cd server
npm install
npm start
Backend API will be available at: http://localhost:5000 (adjust if your server uses a different port)

3. Run the Python AI Service (python_AiTutor)
This module runs independently using FastAPI and uvicorn.

Step 1: Install dependencies
bash
Copy
Edit
cd python_AiTutor
pip install -r requirements.txt
Make sure you have fastapi, uvicorn, and any other required libraries listed in requirements.txt.

Step 2: Run the app
bash
Copy
Edit
uvicorn app:app --host 0.0.0.0 --port 9000 --reload
This will start the FastAPI app at: http://localhost:9000

🔗 Integration Note
All three services (client, server, and python_AiTutor) may communicate via REST APIs or environment configurations, depending on how you've set up inter-service communication.

Make sure to configure any necessary CORS, environment variables, or API URLs accordingly.

✅ Status
completed
