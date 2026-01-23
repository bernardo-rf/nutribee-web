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

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22 or higher recommended)
- **npm** (v9 or higher) or **yarn** or **pnpm**

## Installation

- Clone the repository:

```bash
  git clone <repository-url>
  cd nutribee-web
```

- Install dependencies:

```bash
  npm install
```

- Create a `.env` file in the root directory:

```bash
  cp .env.example .env
```

- Start the development server:

```bash
  npm run dev
```

The application will be available at `http://localhost:3000` (or the port specified in your Vite config).

## Available Scripts

### Development

- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

### Code Quality

- `npm run lint` - Run ESLint to check for code issues
- `npm run format` - Format code using Prettier
