# 📘 PDF Learning Platform

Transform your PDFs into **interactive learning experiences** using AI. This platform allows users to upload PDF documents and automatically generate **flashcards, quizzes, summaries, and chat-based learning** powered by Google Gemini.

## 🚀 Features

* 📄 **PDF Upload & Processing**
* 🧠 **AI-Generated Flashcards**
* ❓ **Interactive Quizzes**
* 📝 **Smart Summaries**
* 💬 **Chat with Your PDF**

## 📁 Project Structure

```
root/
│
├── backend/
│   ├── config/          # DB & environment configs
│   ├── controller/      # Request handlers
│   ├── model/           # Mongoose schemas
│   ├── routers/         # API routes
│   ├── upload_documents/# Uploaded PDFs
│   ├── utils/           # Helpers (Gemini, PDF parser, etc.)
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Global state
│   │   ├── pages/       # App pages
│   │   ├── services/    # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## ⚙️ Environment Variables

Create a `.env` file inside the **backend** folder:

```
PORT=8000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ Never expose your API keys in the frontend.

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/dilushamadushan/pdf-learning-platform.git
cd pdf-learning-platform
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔄 Application Flow

1. User uploads a PDF
2. Backend extracts text from PDF
3. Content is sent to **Gemini API**
4. AI generates flashcards / quizzes / summary
5. Data is stored in MongoDB
6. Frontend fetches and displays learning content

⭐ If you like this project, give it a star and feel free to contribute!
