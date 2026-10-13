# PlainClause 📄

> **Understand any contract in plain language — instantly.**

PlainClause is an AI-powered web app that analyzes legal contracts and explains them in plain language. Paste or upload any contract (Rental, Freelance, Internship, or Other) and get:

- ✅ A **risk score** from 0–100 with a visual gauge
- ✅ A **5-line plain-language summary**
- ✅ A list of **risky clauses** with explanations and color-coded risk badges
- ✅ **Questions to ask before signing**
- ✅ A **downloadable report**
- ✅ Support for **English and Hindi** explanations

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React + TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Claude (via Anthropic SDK) |
| API | Vercel Serverless Functions |
| PDF | pdf-parse |

---

## Running Locally on Windows

### Prerequisites

- Node.js 18+ installed
- An Anthropic API key from console.anthropic.com

### Step 1 — Install dependencies

```powershell
cd C:\path\to\plainclause
npm install
```

### Step 2 — Set up environment variables

```powershell
Copy-Item .env.example .env
```

Open `.env` in Notepad or VS Code and replace the placeholder:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3 — Start both servers (two terminal windows)

**Terminal 1 — API server:**
```powershell
npm run api:dev
```
You should see: `Dev API server running on http://localhost:3001`

**Terminal 2 — Frontend:**
```powershell
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## Deploying to Vercel

### Step 1 — Push to GitHub

```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/plainclause.git
git push -u origin main
```

### Step 2 — Import to Vercel

1. Go to vercel.com -> New Project
2. Import your GitHub repo
3. Framework Preset: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Step 3 — Add environment variable

In Vercel dashboard -> Settings -> Environment Variables:

- Name: `ANTHROPIC_API_KEY`
- Value: `sk-ant-your-key-here`

### Step 4 — Deploy

Click Deploy. Vercel automatically routes `/api/*` to serverless functions.

---

## Project Structure

```
plainclause/
├── api/
│   ├── analyze.ts          # Claude API integration
│   └── extract-pdf.ts      # PDF text extraction
├── src/
│   ├── components/
│   │   ├── ClauseCard.tsx  # Risky clause card
│   │   ├── Footer.tsx      # Legal disclaimer footer
│   │   └── RiskGauge.tsx   # Animated SVG gauge
│   ├── lib/
│   │   ├── api.ts          # Frontend API client
│   │   └── i18n.ts         # EN/HI translations
│   ├── screens/
│   │   ├── HomeScreen.tsx  # Input screen
│   │   └── ResultsScreen.tsx
│   ├── types.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── dev-server.cjs
├── vercel.json
└── README.md
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key from console.anthropic.com |

Never commit `.env` to version control.

---

## Limits

- Max contract size: 15,000 characters (~10 pages)
- PDF uploads: 5 MB max
- Supported file types: .txt, .pdf

---

**PlainClause is not legal advice.** Please consult a qualified lawyer before making any legal decisions.
