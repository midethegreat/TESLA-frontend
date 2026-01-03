# Tesla Investment Platform

## Overview

This is a cryptocurrency investment platform built with React, TypeScript, and Vite. The application allows users to register, verify their identity through KYC, deposit cryptocurrency, choose investment plans, and withdraw profits. It includes both a customer-facing dashboard and an admin panel for managing users and KYC requests.

The frontend communicates with a backend API hosted at `https://tesla-backend-2da8.onrender.com` for authentication, user management, transactions, and KYC processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7 with hot module replacement
- **Styling**: Tailwind CSS v4 with custom glass-morphism design system
- **Routing**: React Router DOM v7 for client-side navigation
- **State Management**: React hooks with custom hooks pattern for data fetching

### Component Structure
- **Pages**: Located in `src/Pages/` - main page components like Home
- **Components**: Organized by feature in `src/components/`
  - `Auth/` - Login, Register, Reset Password, Admin Login
  - `Dashboard/` - User dashboard components (Deposit, Withdraw, KYC, Settings, etc.)
  - `Navigation/` - Header, Footer, Layout wrappers
  - `admin/` - Admin panel components
- **Hooks**: Custom hooks in `src/hooks/` for authentication, profile, documents, and dashboard features
- **Services**: API service layer in `src/services/` handling all backend communication

### Authentication Flow
- JWT-based authentication with access and refresh tokens
- Tokens stored in localStorage (`token`, `refreshToken` for users; `adminToken`, `adminRefreshToken` for admins)
- AuthGuard component protects dashboard routes
- Separate admin authentication flow with role-based access (ADMIN, SUPERADMIN)

### API Communication
- Axios instance with interceptors for token injection and refresh
- Automatic token refresh on 401 responses
- Separate token handling for user vs admin requests

### Design System
- Dark theme with amber/orange accent colors
- JetBrains Mono font family
- Glass-card components with blur effects
- Responsive design with mobile bottom navigation

### Key Features
- Multi-step registration with email verification
- KYC verification with document upload
- Cryptocurrency deposits (BTC, ETH, USDT)
- Investment plans with profit calculations
- Referral system with unique referral codes
- Admin dashboard for user and KYC management

## External Dependencies

### Third-Party Libraries
- **axios**: HTTP client for API requests
- **react-router-dom**: Client-side routing
- **lucide-react**: Icon library
- **tailwindcss**: Utility-first CSS framework

### External Services
- **Backend API**: `https://tesla-backend-2da8.onrender.com` - Handles all business logic, authentication, and data persistence
- **Google Fonts**: JetBrains Mono font loaded via CDN
- **Telegram**: Support channel integration (`https://t.me/Allyssabroker`)

### Cryptocurrency Integration
- Wallet addresses configured for BTC, ETH (ERC20), and USDT (TRC20)
- Real-time token price fetching for deposit calculations

### Deployment
- Configured for Vercel deployment with SPA rewrites (`vercel.json`)
- Development server runs on port 5000 with host `0.0.0.0`