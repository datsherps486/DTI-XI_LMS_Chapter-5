# Algorithm & Data Structure Tutorial (Class XI)

An interactive, visual learning platform for teaching Linked Lists, Stacks, Queues, memory models, and standard algorithms according to Chapter 5 of the Class XI Computer Science curriculum.

---

## 🚀 Quick Start (Local Development with VS Code)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 2. Installation
```bash
# Clone the repository
git clone <YOUR_GITHUB_REPO_URL>
cd <REPO_FOLDER>

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and set your `GEMINI_API_KEY`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend / API**: Node.js, Express, tsx (`server.ts`)
- **AI Engine**: `@google/genai` (Gemini 3.5 Flash, Gemini 3.1 Flash-Lite, Gemini 3.1 Pro Preview)
- **Database & Auth**: Google Cloud Firestore & Firebase Google Authentication
- **Build Tool**: Vite
