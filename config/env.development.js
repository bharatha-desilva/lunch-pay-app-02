/**
 * Development Environment Configuration
 * ====================================
 * 
 * This file contains development-specific environment variables
 * for the LunchPay React application.
 * 
 * Usage:
 * - Copy values to .env.local for local development
 * - Use as reference for development environment setup
 */

export const developmentConfig = {
  // Application Info
  VITE_APP_NAME: "LunchPay (Dev)",
  VITE_APP_VERSION: "1.0.0-dev",
  VITE_APP_ENVIRONMENT: "development",

  // API Configuration
  VITE_API_BASE_URL: "http://localhost:3001/api",
  VITE_API_TIMEOUT: "30000",
  VITE_API_RETRY_ATTEMPTS: "5",

  // Authentication
  VITE_AUTH_TOKEN_EXPIRY: "24h",
  VITE_SESSION_TIMEOUT: "3600000",
  VITE_ENABLE_AUTH_PERSISTENCE: "true",
  VITE_PASSWORD_MIN_LENGTH: "6",

  // Feature Toggles (All enabled for development)
  VITE_ENABLE_REGISTRATION: "true",
  VITE_ENABLE_GROUP_CREATION: "true",
  VITE_ENABLE_EXPENSE_CATEGORIES: "true",
  VITE_ENABLE_UNEQUAL_SPLITTING: "true",
  VITE_ENABLE_EXPENSE_SEARCH: "true",
  VITE_ENABLE_SETTLEMENT_TRACKING: "true",
  VITE_ENABLE_BALANCE_HISTORY: "true",

  // Development Limits (Relaxed)
  VITE_MAX_GROUP_MEMBERS: "50",
  VITE_MAX_GROUPS_PER_USER: "20",
  VITE_MAX_EXPENSE_AMOUNT: "100000",
  VITE_MAX_EXPENSES_PER_DAY: "200",
  VITE_RATE_LIMIT_REQUESTS: "1000",
  VITE_RATE_LIMIT_WINDOW: "60000",

  // Logging & Debug (Verbose)
  VITE_LOG_LEVEL: "debug",
  VITE_ENABLE_DEBUG_LOGS: "true",
  VITE_ENABLE_PERFORMANCE_MONITORING: "true",
  VITE_ERROR_REPORTING_ENABLED: "false",

  // External Services (Dev/Mock)
  VITE_SENTRY_DSN: "",
  VITE_ANALYTICS_ID: "",
  VITE_HOTJAR_ID: "",
  VITE_SUPPORT_EMAIL: "dev@localhost",

  // Development-Only Features
  VITE_ENABLE_API_MOCKING: "true",
  VITE_MOCK_DELAY: "500",
  VITE_SHOW_DEV_TOOLS: "true",
  VITE_ENABLE_REDUX_DEVTOOLS: "true",

  // UI Configuration
  VITE_BUTTON_DEBOUNCE_MS: "500",
  VITE_SEARCH_DEBOUNCE_MS: "300",
  VITE_TOAST_DURATION: "6000",
  VITE_DEFAULT_THEME: "light",
  VITE_ENABLE_DARK_MODE: "true",

  // Security (Relaxed for development)
  VITE_CSP_ENABLED: "false",
  VITE_CSP_REPORT_ONLY: "true",
  VITE_HTTPS_ONLY: "false",
  
  // Development URLs
  VITE_APP_DOMAIN: "localhost:3000",
  VITE_APP_URL: "http://localhost:3000",
};

/**
 * Environment file template for .env.local
 */
export const developmentEnvTemplate = `# Development Environment - LunchPay
# Copy this to .env.local and modify as needed

# Application
VITE_APP_NAME="LunchPay (Dev)"
VITE_APP_VERSION="1.0.0-dev"
VITE_APP_ENVIRONMENT="development"

# API
VITE_API_BASE_URL="http://localhost:3001/api"
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=5

# Features (All enabled)
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_GROUP_CREATION=true
VITE_ENABLE_EXPENSE_CATEGORIES=true
VITE_ENABLE_UNEQUAL_SPLITTING=true

# Development
VITE_LOG_LEVEL="debug"
VITE_ENABLE_DEBUG_LOGS=true
VITE_ENABLE_API_MOCKING=true
VITE_SHOW_DEV_TOOLS=true

# Limits (Relaxed)
VITE_MAX_GROUP_MEMBERS=50
VITE_RATE_LIMIT_REQUESTS=1000
`;

export default developmentConfig;
