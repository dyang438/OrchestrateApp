# Orchestrate

A minimal full-stack application boilerplate with React + TypeScript frontend and Express backend.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- React Router (routing)
- Material-UI (component library)
- ESLint (linting)

### Backend
- Express (Node.js framework)
- TypeScript
- dotenv (environment variables)

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```
The server will run on `http://localhost:8000` (or the PORT specified in `.env`)

2. Start the frontend dev server:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

### Building for Production

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
```

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   └── index.ts          # Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # Entry point
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Environment Variables

Create a `.env` file in the `backend` directory:
```
PORT=8000
```

## Next Steps

- Add your routes in `backend/src/index.ts`
- Create components in `frontend/src/`
- Add pages and routes in `frontend/src/main.tsx`
- Style your app using Material-UI components
