# 🔥 DevTinder Frontend

A modern, responsive networking platform crafted for software engineers and developers to discover peers, connect, and collaborate. Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Zustand**.

---

## 🚀 Overview

**DevTinder** brings the discovery-and-match model to the developer community. Developers can create personalized profiles, explore a curated feed of other developers, establish connections, and expand their technical network.

---

## ✨ Features

- **🔐 Robust Authentication & Session Handling**
  - Dual login modes: standard Password authentication & One-Time Password (OTP) login.
  - Multi-step signup flow with comprehensive input validation.
  - Client-side route protection (`ProtectedRoute` & `PublicRoute`) with automatic session checks and redirect handling.
  - Persistent auth state using Zustand storage persistence.
  - Global Axios interceptors for handling credentials and automatic logout on 401 unauthorized responses.

- **💻 Developer Feed (`/feed`)**
  - Explore fellow developers with interactive user cards.
  - View key details including bio, technical background, age, and profile pictures.
  - Connect with or pass on developer profiles.

- **🤝 Connections Management (`/connections`)**
  - View all accepted developer connections and network in one dedicated space.

- **🎨 Live Profile Editor (`/profile`)**
  - Edit personal and professional information (Name, Age, Gender, Bio, About).
  - Real-time side-by-side **Live Profile Preview Card** that reflects updates instantly as you type.

- **⚡ Modern & Accessible UI/UX**
  - Styled with **Tailwind CSS v4** and **DaisyUI v5** components.
  - Responsive design supporting dark and light themes.
  - Toast notifications powered by **Sonner** for real-time feedback on API operations.
  - Fast page loads with code-splitting via `React.lazy` and `Suspense`.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Core** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 7](https://vitejs.dev/) with SWC |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [DaisyUI v5](https://daisyui.com/), [Lucide React](https://lucide.dev/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) (with `persist` & `devtools` middleware) |
| **Data Fetching & API** | [SWR](https://swr.vercel.app/), [Axios](https://axios-http.com/) |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), `@hookform/resolvers` |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Testing** | [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/), [MSW (Mock Service Worker)](https://mswjs.io/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |

---

## 📁 Project Structure

```text
dev-tinder-frontend/
├── public/                 # Static assets
├── src/
│   ├── Components/         # React UI components
│   │   ├── Atoms/          # Reusable atomic UI (FormField, InputField, UserCard, Loader, etc.)
│   │   ├── Connections/    # Connections page
│   │   ├── Feed/           # Developer feed page
│   │   ├── Footer/         # App footer
│   │   ├── Login/          # Password & OTP login component
│   │   ├── Navbar/         # Main navigation bar with profile menu
│   │   ├── Profile/        # Profile editor with live preview card
│   │   ├── Signup/         # Multi-step signup form
│   │   └── UserDetails/    # Shared user feed/connections display list
│   ├── Hooks/              # Custom hooks (`useApiQuery`, `useApiMutation`, `useIsUserAuthenticated`)
│   ├── Routes/             # Route guards (`ProtectedRoute`, `PublicRoute`)
│   ├── SchemaValidation/   # Zod validation schemas (Login, Signup, Profile)
│   ├── Services/           # Axios interceptors, SWR client, and API service functions
│   │   └── Api/            # Auth & User API definitions
│   ├── Store/              # Zustand global store & auth slices
│   ├── constants/          # Application constants & enum definitions
│   ├── interfacesAndTypes/ # TypeScript interfaces and type definitions
│   ├── test/               # Vitest & React Testing Library test suites
│   │   ├── atoms/          # Unit tests for atomic components
│   │   ├── components/     # Integration tests for page components
│   │   ├── fixtures/       # Mock data fixtures
│   │   ├── hooks/          # Custom hook tests
│   │   ├── integration/    # Full app routing and integration tests
│   │   ├── schemas/        # Zod schema validation tests
│   │   ├── services/       # Service & interceptor tests
│   │   ├── store/          # Zustand store tests
│   │   ├── handlers.ts     # MSW request handlers
│   │   └── server.ts       # MSW mock node server setup
│   ├── App.tsx             # Route definitions and layout setup
│   ├── Body.tsx            # Main layout wrapper (Navbar, Outlet, Footer, Toaster)
│   ├── main.tsx            # React application entry point
│   └── index.css           # Global stylesheet & Tailwind CSS configurations
├── .env                    # Environment variables
├── eslint.config.js        # ESLint configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration & Vitest setup
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/dev-tinder-frontend.git
cd dev-tinder-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (or update the existing one):

```env
VITE_APP_NODE_ENV=development
VITE_API_BASE_URL=http://localhost:8000/api/
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🧪 Testing

The repository includes a comprehensive testing suite using **Vitest**, **React Testing Library**, and **MSW**:

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

To locally preview the production build:

```bash
npm run preview
```

---

## 🧹 Code Quality & Linting

```bash
npm run lint
```

---

## 📄 License

This project is private / open for development and learning purposes.
