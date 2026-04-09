# Brutalist Luxury SaaS Platform - Complete Setup Guide

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Required Technologies](#required-technologies)
3. [IDE & Tools Setup](#ide--tools-setup)
4. [Local Installation](#local-installation)
5. [Database Setup](#database-setup)
6. [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
8. [Project Structure](#project-structure)
9. [End-to-End Project Roadmap](#end-to-end-project-roadmap)

---

## System Requirements

### Minimum Hardware
- **CPU**: Intel i5 / AMD Ryzen 5 or equivalent (2+ cores)
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 10GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Ubuntu 20.04+

### Network
- Stable internet connection (for npm package downloads)
- Ability to access localhost ports 3000 (frontend), 5173 (Vite dev), and 3306 (MySQL)

---

## Required Technologies

### Core Stack

| Technology | Version | Purpose | Download |
|-----------|---------|---------|----------|
| **Node.js** | 18.x or 20.x | JavaScript runtime | https://nodejs.org |
| **pnpm** | 10.x | Package manager | `npm install -g pnpm` |
| **MySQL** | 8.0+ | Database | https://dev.mysql.com/downloads/mysql/ |
| **Git** | Latest | Version control | https://git-scm.com |

### Frontend Dependencies
- **React** 19 - UI library
- **TypeScript** 5.9 - Type safety
- **Tailwind CSS** 4 - Styling
- **Framer Motion** 12 - Animations
- **Vite** 7 - Build tool
- **TailwindCSS** - Utility-first CSS

### Backend Dependencies
- **Express.js** 4 - Web framework
- **tRPC** 11 - Type-safe RPC
- **Drizzle ORM** 0.44 - Database ORM
- **MySQL2** 3 - MySQL driver
- **Helmet** 8 - Security headers
- **Express Rate Limit** 8 - Rate limiting
- **Jose** 6 - JWT handling

### Development Tools
- **TypeScript** - Type checking
- **Vitest** - Unit testing
- **Prettier** - Code formatting
- **ESLint** - Code linting (optional)

---

## IDE & Tools Setup

### Recommended IDE: Visual Studio Code

#### Installation
1. Download from https://code.visualstudio.com
2. Install and launch VS Code

#### Essential Extensions
```
1. TypeScript Vue Plugin (Volar)
   - ID: Vue.volar
   - Provides TypeScript support for Vue/React

2. Prettier - Code formatter
   - ID: esbenp.prettier-vscode
   - Auto-format on save

3. ESLint
   - ID: dbaeumer.vscode-eslint
   - Real-time linting

4. Tailwind CSS IntelliSense
   - ID: bradlc.vscode-tailwindcss
   - Autocomplete for Tailwind classes

5. REST Client
   - ID: humao.rest-client
   - Test API endpoints directly in VS Code

6. MySQL
   - ID: cweijan.vscode-mysql
   - Database management within VS Code

7. Thunder Client or Postman
   - For API testing
```

#### VS Code Settings (`.vscode/settings.json`)
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Alternative IDEs
- **WebStorm** - Full-featured IDE (paid)
- **Sublime Text** - Lightweight (paid)
- **Vim/Neovim** - For advanced users

---

## Local Installation

### Step 1: Clone the Repository

```bash
# Using Git
git clone https://github.com/yourusername/brutalist-saas.git
cd brutalist-saas

# Or download as ZIP and extract
```

### Step 2: Install Node.js and pnpm

#### Windows
```bash
# Download and install Node.js from https://nodejs.org
# Then install pnpm globally
npm install -g pnpm

# Verify installation
node --version    # Should be v18.x or v20.x
pnpm --version    # Should be 10.x+
```

#### macOS
```bash
# Using Homebrew (install from https://brew.sh if needed)
brew install node
npm install -g pnpm

# Or using nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
npm install -g pnpm
```

#### Linux (Ubuntu/Debian)
```bash
# Using apt
sudo apt update
sudo apt install nodejs npm

# Install pnpm
npm install -g pnpm

# Verify
node --version
pnpm --version
```

### Step 3: Install Project Dependencies

```bash
# Navigate to project directory
cd brutalist-saas

# Install all dependencies
pnpm install

# This will install:
# - Frontend dependencies (React, Tailwind, Framer Motion)
# - Backend dependencies (Express, tRPC, Drizzle)
# - Dev dependencies (TypeScript, Vitest, Prettier)
```

---

## Database Setup

### Step 1: Install MySQL

#### Windows
1. Download MySQL Community Server from https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. Choose "MySQL Server" and "MySQL Workbench"
4. Configure MySQL as a Windows Service
5. Set root password (remember this!)

#### macOS
```bash
# Using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation
mysql_secure_installation
```

#### Linux (Ubuntu)
```bash
# Install MySQL Server
sudo apt install mysql-server

# Run security script
sudo mysql_secure_installation

# Start service
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Step 2: Create Database and User

```bash
# Connect to MySQL as root
mysql -u root -p

# Enter root password when prompted
```

Then execute these SQL commands:

```sql
-- Create database
CREATE DATABASE brutalist_saas;

-- Create user (change password to something secure)
CREATE USER 'saas_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON brutalist_saas.* TO 'saas_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### Step 3: Verify Database Connection

```bash
# Test connection
mysql -u saas_user -p brutalist_saas

# You should see: mysql>
# If successful, exit with: EXIT;
```

---

## Environment Configuration

### Step 1: Create `.env.local` File

Create a file named `.env.local` in the project root:

```bash
# Navigate to project root
cd /path/to/brutalist-saas

# Create .env.local file
touch .env.local
```

### Step 2: Add Environment Variables

Edit `.env.local` and add:

```env
# Database Configuration
DATABASE_URL="mysql://saas_user:your_secure_password_here@localhost:3306/brutalist_saas"

# Server Configuration
NODE_ENV=development
PORT=3000

# JWT & Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
COOKIE_SECRET=your_cookie_secret_key_change_this_12345

# OAuth (Manus - optional for now)
VITE_APP_ID=your_app_id_here
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000

# Email Service (optional - for later)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Stripe (optional - for later)
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

### Step 3: Verify Environment Variables

```bash
# Check if .env.local is in .gitignore (it should be)
cat .gitignore | grep env

# Should output: .env.local
```

---

## Running the Application

### Option 1: Development Mode (Recommended for Learning)

#### Terminal 1: Start Backend Server
```bash
# From project root
pnpm dev

# Output should show:
# [OAuth] Initialized with baseURL: https://api.manus.im
# Server running on http://localhost:3000/
```

#### Terminal 2: Frontend (Automatic with Vite)
The frontend will automatically start on http://localhost:5173 when you run `pnpm dev`

#### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/trpc
- **Health Check**: http://localhost:3000/health

### Option 2: Production Build

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start

# Server will run on http://localhost:3000
```

### Option 3: Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test auth.logout.test.ts
```

### Option 4: Database Migrations

```bash
# Generate and apply migrations
pnpm db:push

# This will:
# 1. Generate SQL from schema
# 2. Apply migrations to database
# 3. Update Drizzle metadata
```

---

## Project Structure

```
brutalist-saas/
├── client/                          # Frontend React application
│   ├── public/                      # Static assets (favicon, robots.txt)
│   ├── src/
│   │   ├── _core/                   # Core utilities
│   │   │   └── hooks/
│   │   │       └── useAuth.ts       # Authentication hook
│   │   ├── components/              # Reusable React components
│   │   │   ├── MagneticButton.tsx   # Interactive button
│   │   │   ├── CustomCursor.tsx     # Animated cursor
│   │   │   ├── Hero.tsx             # Landing hero section
│   │   │   ├── Navigation.tsx       # Top navigation
│   │   │   └── ...
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Admin.tsx            # Admin dashboard
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── trpc.ts              # tRPC client setup
│   │   │   ├── api.ts               # API service
│   │   │   └── utils.ts             # Utility functions
│   │   ├── App.tsx                  # Main app component
│   │   ├── main.tsx                 # Entry point
│   │   └── index.css                # Global styles
│   └── index.html                   # HTML template
│
├── server/                          # Backend Express application
│   ├── _core/                       # Core backend infrastructure
│   │   ├── index.ts                 # Server entry point
│   │   ├── context.ts               # tRPC context
│   │   ├── trpc.ts                  # tRPC setup
│   │   ├── oauth.ts                 # OAuth integration
│   │   └── ...
│   ├── routers/                     # tRPC procedure routers
│   │   ├── auth.ts                  # Authentication procedures
│   │   ├── subscriptions.ts         # Subscription management
│   │   ├── admin.ts                 # Admin procedures
│   │   └── ...
│   ├── auth.ts                      # Authentication utilities
│   ├── middleware.ts                # Security middleware
│   ├── db.ts                        # Database queries
│   └── routers.ts                   # Main router export
│
├── drizzle/                         # Database schema & migrations
│   ├── schema.ts                    # Table definitions
│   ├── migrations/                  # SQL migration files
│   └── meta/                        # Migration metadata
│
├── shared/                          # Shared types & constants
│   ├── types.ts                     # Shared TypeScript types
│   └── const.ts                     # Shared constants
│
├── .env.local                       # Environment variables (local)
├── .env.example                     # Example environment variables
├── package.json                     # Project dependencies
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
├── drizzle.config.ts                # Drizzle ORM configuration
└── README.md                        # Project documentation
```

---

## Troubleshooting

### Issue: "pnpm: command not found"
```bash
# Solution: Install pnpm globally
npm install -g pnpm

# Verify
pnpm --version
```

### Issue: "Cannot connect to database"
```bash
# Check MySQL is running
mysql -u root -p

# If connection fails, restart MySQL:
# Windows: net start MySQL80
# macOS: brew services restart mysql
# Linux: sudo systemctl restart mysql
```

### Issue: "Port 3000 already in use"
```bash
# Find process using port 3000
# Windows: netstat -ano | findstr :3000
# macOS/Linux: lsof -i :3000

# Kill the process or use different port
PORT=3001 pnpm dev
```

### Issue: "TypeScript errors in IDE"
```bash
# Ensure TypeScript is installed
pnpm add -D typescript

# Restart VS Code TypeScript server:
# Cmd+Shift+P (macOS) or Ctrl+Shift+P (Windows)
# Type: "TypeScript: Restart TS Server"
```

### Issue: "Module not found errors"
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Quick Start Checklist

- [ ] Install Node.js 18+ and pnpm
- [ ] Install MySQL 8.0+
- [ ] Clone/download project
- [ ] Run `pnpm install`
- [ ] Create `.env.local` with database URL
- [ ] Create MySQL database and user
- [ ] Run `pnpm db:push`
- [ ] Run `pnpm dev`
- [ ] Open http://localhost:5173
- [ ] Test login/signup flow

---

## Next Steps After Setup

1. **Explore the Codebase**: Review `server/routers/auth.ts` to understand authentication flow
2. **Test API**: Use Thunder Client or Postman to test endpoints
3. **Customize Branding**: Update colors in `client/src/index.css`
4. **Add Features**: Create new routers in `server/routers/`
5. **Deploy**: Follow deployment guide for production

---

## Support & Resources

- **tRPC Documentation**: https://trpc.io/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **Express.js**: https://expressjs.com
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com

