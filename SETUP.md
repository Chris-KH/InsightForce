# Project Setup Guide

This document provides instructions for setting up the development environment and getting the project running locally.

## 🛠 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: version 18.0.0 or higher (Recommended: Long Term Support (LTS) version)
- **Package Manager**: [npm](https://www.npmjs.com/) (comes pre-installed with Node.js)
- **Git**: For version control.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

This project uses a lockfile (`package-lock.json`) to ensure consistent builds across environments.

```bash
npm install
```

### 3. Environment Configuration

Local development requires specific environment variables. Copy the example template to create your local environment file:

```bash
cp .env.example .env.local
```

_Note: Never commit `.env.local` or any file containing secrets to version control._

### 3.1 Backend Environment (Required for Upload-Post Finance/Automation features)

If Finance or Automation pages display an error like `Missing UPLOAD_POST_API_KEY in the backend environment`, configure backend env variables before testing those flows:

- `UPLOAD_POST_API_KEY`: API key used by backend Upload-Post service calls.
- `UPLOAD_POST_JWT`: optional default JWT token fallback for protected Upload-Post operations.

See backend task list in `backend/TODO.md` for remaining integration items.

### 4. Start Development Server

Launch the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📦 Available Scripts

| Script            | Description                                                                |
| :---------------- | :------------------------------------------------------------------------- |
| `npm run dev`     | Starts the development server with HMR.                                    |
| `npm run build`   | Compiles and optimizes the application for production (output in `/dist`). |
| `npm run preview` | Locally previews the production build.                                     |
| `npm run lint`    | Runs ESLint to check for code quality and style issues.                    |
| `npm run format`  | Runs Prettier to automatically format the codebase.                        |

## 🏗 Project Architecture

To maintain a scalable and performant codebase, the project follows this structure:

- `src/assets/`: Static assets like images and fonts.
- `src/components/`: Reusable UI components (Atomic design or feature-based).
- `src/hooks/`: Custom React hooks for logic extraction.
- `src/services/`: API calls and external data fetching logic.
- `src/store/`: State management logic (e.g., Zustand, Redux, or Context).
- `src/utils/`: Pure helper functions and constants.

## 🔧 Technical Notes

- **Vite Configuration**: The build pipeline uses ESbuild for extremely fast bundling during development and Rollup for production builds.
- **Linting & Formatting**: This project enforces strict TypeScript and React linting rules. Ensure your editor is configured to use the project's `.eslintrc` and `.prettierrc`.
- **Optimization**: All components should utilize lazy loading where appropriate to minimize the initial bundle size.

## 🛑 Troubleshooting

- **Node Version Mismatch**: If you encounter errors during `install`, verify your version with `node -v`. Use `nvm` (Node Version Manager) to switch versions if necessary.
- **Dependency Conflicts**: If dependency errors occur, try deleting `node_modules` and the `package-lock.json` file, then run `npm install` again.
