/**
 * Production Environment Configuration
 * ===================================
 * 
 * This file contains production-specific environment variables
 * for the LunchPay React application.
 * 
 * Usage:
 * - Reference for production deployment
 * - Platform environment variable setup
 * - Security and performance optimization settings
 */

export const productionConfig = {
  // Application Info
  VITE_APP_NAME: "LunchPay",
  VITE_APP_VERSION: "1.0.0",
  VITE_APP_ENVIRONMENT: "production",

  // API Configuration
  VITE_API_BASE_URL: "https://api.lunchpay.app",
  VITE_API_TIMEOUT: "10000",
  VITE_API_RETRY_ATTEMPTS: "2",

  // Authentication (Secure)
  VITE_AUTH_TOKEN_EXPIRY: "12h",
  VITE_SESSION_TIMEOUT: "1800000",
  VITE_ENABLE_AUTH_PERSISTENCE: "true",
  VITE_PASSWORD_MIN_LENGTH: "8",

  // Feature Toggles (Stable features only)
  VITE_ENABLE_REGISTRATION: "true",
  VITE_ENABLE_GROUP_CREATION: "true",
  VITE_ENABLE_EXPENSE_CATEGORIES: "true",
  VITE_ENABLE_UNEQUAL_SPLITTING: "true",
  VITE_ENABLE_EXPENSE_SEARCH: "true",
  VITE_ENABLE_SETTLEMENT_TRACKING: "true",
  VITE_ENABLE_BALANCE_HISTORY: "true",

  // Experimental Features (Disabled in production)
  VITE_ENABLE_RECURRING_EXPENSES: "false",
  VITE_ENABLE_EXPENSE_PHOTOS: "false",
  VITE_ENABLE_CURRENCY_CONVERSION: "false",

  // Production Limits (Strict)
  VITE_MAX_GROUP_MEMBERS: "20",
  VITE_MAX_GROUPS_PER_USER: "10",
  VITE_MAX_EXPENSE_AMOUNT: "10000",
  VITE_MAX_EXPENSES_PER_DAY: "50",
  VITE_RATE_LIMIT_REQUESTS: "60",
  VITE_RATE_LIMIT_WINDOW: "60000",
  VITE_RATE_LIMIT_BURST: "5",

  // Logging & Monitoring (Minimal)
  VITE_LOG_LEVEL: "warn",
  VITE_ENABLE_DEBUG_LOGS: "false",
  VITE_ENABLE_PERFORMANCE_MONITORING: "true",
  VITE_ERROR_REPORTING_ENABLED: "true",
  VITE_ERROR_SAMPLE_RATE: "1.0",

  // External Services (Production - replace with actual values)
  VITE_SENTRY_DSN: "https://production-key@sentry.io/project",
  VITE_ANALYTICS_ID: "G-PRODUCTION123",
  VITE_HOTJAR_ID: "3123456",
  VITE_SUPPORT_EMAIL: "help@lunchpay.app",

  // UI Configuration (Optimized)
  VITE_BUTTON_DEBOUNCE_MS: "1000",
  VITE_SEARCH_DEBOUNCE_MS: "500",
  VITE_TOAST_DURATION: "4000",
  VITE_DEFAULT_THEME: "light",
  VITE_ENABLE_DARK_MODE: "true",

  // Security (Strict)
  VITE_CSP_ENABLED: "true",
  VITE_CSP_REPORT_ONLY: "false",
  VITE_HTTPS_ONLY: "true",
  VITE_HSTS_MAX_AGE: "31536000",

  // Production URLs
  VITE_APP_DOMAIN: "lunchpay.app",
  VITE_APP_URL: "https://lunchpay.app",

  // CDN Configuration
  VITE_CDN_URL: "https://cdn.lunchpay.app",
  VITE_ASSETS_URL: "https://assets.lunchpay.app",

  // Development Features (Disabled)
  VITE_ENABLE_API_MOCKING: "false",
  VITE_SHOW_DEV_TOOLS: "false",
  VITE_ENABLE_REDUX_DEVTOOLS: "false",
};

/**
 * Security Configuration for Production
 */
export const productionSecurityConfig = {
  // Content Security Policy
  csp: {
    defaultSrc: "'self'",
    scriptSrc: "'self' 'unsafe-inline'",
    styleSrc: "'self' 'unsafe-inline'",
    imgSrc: "'self' data: https:",
    connectSrc: "'self' https://api.lunchpay.app https://sentry.io",
    fontSrc: "'self'",
    objectSrc: "'none'",
    mediaSrc: "'self'",
    frameSrc: "'none'",
  },

  // Security Headers
  headers: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
};

/**
 * Platform-specific deployment configurations
 */
export const deploymentConfigs = {
  vercel: {
    // Vercel-specific environment variables
    VERCEL_ENV: "production",
    BUILD_COMMAND: "npm run build",
    OUTPUT_DIRECTORY: "dist",
    INSTALL_COMMAND: "npm ci",
    
    // Build settings
    NODE_VERSION: "18.x",
    NPM_RC: "registry=https://registry.npmjs.org/",
  },

  netlify: {
    // Netlify-specific settings
    NETLIFY_ENV: "production",
    BUILD_COMMAND: "npm run build",
    PUBLISH_DIRECTORY: "dist",
    
    // Headers and redirects
    NETLIFY_HEADERS: `
      /*
        X-Frame-Options: DENY
        X-XSS-Protection: 1; mode=block
        X-Content-Type-Options: nosniff
        Referrer-Policy: strict-origin-when-cross-origin
    `,
    
    NETLIFY_REDIRECTS: `
      /api/* https://api.lunchpay.app/:splat 200
      /* /index.html 200
    `,
  },

  docker: {
    // Docker environment
    NODE_ENV: "production",
    PORT: "3000",
    
    // Health check
    HEALTH_CHECK_ENDPOINT: "/health",
    HEALTH_CHECK_INTERVAL: "30s",
  },
};

/**
 * Environment validation rules for production
 */
export const productionValidation = {
  required: [
    'VITE_APP_ENVIRONMENT',
    'VITE_API_BASE_URL',
    'VITE_APP_NAME',
    'VITE_APP_VERSION',
  ],
  
  mustBeHttps: [
    'VITE_API_BASE_URL',
    'VITE_APP_URL',
    'VITE_CDN_URL',
  ],
  
  mustBeBoolean: [
    'VITE_ENABLE_REGISTRATION',
    'VITE_ENABLE_DEBUG_LOGS',
    'VITE_ERROR_REPORTING_ENABLED',
    'VITE_CSP_ENABLED',
    'VITE_HTTPS_ONLY',
  ],
  
  mustBeNumeric: [
    'VITE_API_TIMEOUT',
    'VITE_SESSION_TIMEOUT',
    'VITE_MAX_GROUP_MEMBERS',
    'VITE_RATE_LIMIT_REQUESTS',
  ],
};

export default productionConfig;
