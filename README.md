# NutriBee Web

A comprehensive nutrition practice management web application built with React and TypeScript. NutriBee intent is to help nutritionists manage clients, schedule appointments, track health metrics, and monitor client progress.

## Features

### Current Features

- **Dashboard**: Overview of key metrics including total clients, appointments, active programs, and client progress
- **Client Management**: 
  - Add new clients with comprehensive intake forms
  - View and search client list
  - Track client health metrics, dietary information, and health goals
  - Manage personal information, appointment information, and dietary preferences
- **Appointment Scheduling**:
  - Calendar view with FullCalendar integration
  - List view for detailed appointment management
  - Create, edit, and manage appointments
  - Filter by status and date

### Coming Soon

- Reports and analytics
- User profile management
- Settings and configuration
- Advanced client tracking and progress reports

## Tech Stack

### Core Technologies

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing

### Code Quality

- **ESLint** - Linting with TypeScript and React plugins
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher) or **yarn** or **pnpm**

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nutribee-web
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Configure environment variables (see [Environment Variables](#environment-variables) section)

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the port specified in your Vite config).

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Environment Variable Descriptions

- `VITE_API_BASE_URL` - Base URL for the backend API (required)

**Note**: All environment variables prefixed with `VITE_` are exposed to the client-side code. Do not include sensitive information like API keys or secrets.

## Available Scripts

### Development

- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

### Code Quality

- `npm run lint` - Run ESLint to check for code issues
- `npm run format` - Format code using Prettier
