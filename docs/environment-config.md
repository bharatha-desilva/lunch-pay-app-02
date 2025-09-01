# Environment Configuration Guide

## Overview

This document defines environment variables, secrets, and configuration profiles for the **LunchPay** React application across Development, Staging, and Production environments. The application connects to a generic REST API backend and requires secure configuration management.

---

## Environment Variables Summary

### Core Application Variables

| Variable | Purpose | Required | Default | Security Level |
|----------|---------|----------|---------|----------------|
| `VITE_APP_NAME` | Application display name | Yes | "LunchPay" | Public |
| `VITE_APP_VERSION` | Application version | Yes | "1.0.0" | Public |
| `VITE_APP_ENVIRONMENT` | Current environment | Yes | "development" | Public |
| `VITE_API_BASE_URL` | Backend API endpoint | Yes | - | Public |
| `VITE_API_TIMEOUT` | API request timeout (ms) | No | 10000 | Public |
| `VITE_API_RETRY_ATTEMPTS` | API retry count | No | 3 | Public |

### Authentication & Security Variables

| Variable | Purpose | Required | Default | Security Level |
|----------|---------|----------|---------|----------------|
| `VITE_JWT_SECRET_KEY` | JWT token signing (client validation) | No | - | **Secret** |
| `VITE_AUTH_TOKEN_EXPIRY` | Token expiration time | No | "24h" | Public |
| `VITE_SESSION_TIMEOUT` | User session timeout | No | 1800000 | Public |
| `VITE_ENABLE_AUTH_PERSISTENCE` | Remember login sessions | No | true | Public |
| `VITE_PASSWORD_MIN_LENGTH` | Minimum password length | No | 8 | Public |

### Feature Toggles & Limits

| Variable | Purpose | Required | Default | Security Level |
|----------|---------|----------|---------|----------------|
| `VITE_ENABLE_REGISTRATION` | Allow new user registration | No | true | Public |
| `VITE_ENABLE_GROUP_CREATION` | Allow group creation | No | true | Public |
| `VITE_ENABLE_EXPENSE_CATEGORIES` | Show expense categories | No | true | Public |
| `VITE_ENABLE_UNEQUAL_SPLITTING` | Enable custom split options | No | true | Public |
| `VITE_MAX_GROUP_MEMBERS` | Maximum members per group | No | 20 | Public |
| `VITE_MAX_EXPENSE_AMOUNT` | Maximum expense amount | No | 10000 | Public |
| `VITE_RATE_LIMIT_REQUESTS` | Rate limit per minute | No | 60 | Public |

### External Service Integration

| Variable | Purpose | Required | Default | Security Level |
|----------|---------|----------|---------|----------------|
| `VITE_SENTRY_DSN` | Error tracking endpoint | No | - | Public |
| `VITE_ANALYTICS_ID` | Google Analytics ID | No | - | Public |
| `VITE_HOTJAR_ID` | User behavior analytics | No | - | Public |
| `VITE_SUPPORT_EMAIL` | Customer support contact | No | "help@lunchpay.app" | Public |

### Logging & Monitoring

| Variable | Purpose | Required | Default | Security Level |
|----------|---------|----------|---------|----------------|
| `VITE_LOG_LEVEL` | Application log level | No | "info" | Public |
| `VITE_ENABLE_DEBUG_LOGS` | Show debug information | No | false | Public |
| `VITE_ENABLE_PERFORMANCE_MONITORING` | Performance tracking | No | false | Public |
| `VITE_ERROR_REPORTING_ENABLED` | Send error reports | No | true | Public |

---

## Environment-Specific Configurations

### 🛠️ Development Environment

**Purpose**: Local development and testing
**Security Level**: Relaxed for development ease
**Data**: Mock/test data acceptable

#### Development Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_APP_ENVIRONMENT` | `"development"` | Enables dev tools |
| `VITE_API_BASE_URL` | `"http://localhost:3001/api"` | Local API server |
| `VITE_API_TIMEOUT` | `30000` | Longer timeout for debugging |
| `VITE_LOG_LEVEL` | `"debug"` | Verbose logging |
| `VITE_ENABLE_DEBUG_LOGS` | `true` | Show all debug info |
| `VITE_RATE_LIMIT_REQUESTS` | `1000` | Relaxed rate limiting |
| `VITE_ENABLE_PERFORMANCE_MONITORING` | `true` | Monitor during development |
| `VITE_ERROR_REPORTING_ENABLED` | `false` | Don't send dev errors to production |

#### Development .env File

```bash
# Development Environment Configuration
# ====================================

# Application Info
VITE_APP_NAME="LunchPay (Dev)"
VITE_APP_VERSION="1.0.0-dev"
VITE_APP_ENVIRONMENT="development"

# API Configuration
VITE_API_BASE_URL="http://localhost:3001/api"
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=5

# Authentication
VITE_AUTH_TOKEN_EXPIRY="24h"
VITE_SESSION_TIMEOUT=3600000
VITE_ENABLE_AUTH_PERSISTENCE=true
VITE_PASSWORD_MIN_LENGTH=6

# Feature Toggles
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_GROUP_CREATION=true
VITE_ENABLE_EXPENSE_CATEGORIES=true
VITE_ENABLE_UNEQUAL_SPLITTING=true

# Development Limits (Relaxed)
VITE_MAX_GROUP_MEMBERS=50
VITE_MAX_EXPENSE_AMOUNT=100000
VITE_RATE_LIMIT_REQUESTS=1000

# Logging & Debug
VITE_LOG_LEVEL="debug"
VITE_ENABLE_DEBUG_LOGS=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ERROR_REPORTING_ENABLED=false

# External Services (Dev/Mock)
VITE_SENTRY_DSN=""
VITE_ANALYTICS_ID=""
VITE_HOTJAR_ID=""
VITE_SUPPORT_EMAIL="dev@localhost"

# Development-Only Features
VITE_ENABLE_API_MOCKING=true
VITE_MOCK_DELAY=500
VITE_SHOW_DEV_TOOLS=true
```

---

### 🧪 Staging Environment

**Purpose**: Pre-production testing and QA
**Security Level**: Production-like but with testing features
**Data**: Clean test data, production-like but isolated

#### Staging Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_APP_ENVIRONMENT` | `"staging"` | Staging-specific features |
| `VITE_API_BASE_URL` | `"https://api-staging.lunchpay.app"` | Staging API endpoint |
| `VITE_API_TIMEOUT` | `15000` | Moderate timeout |
| `VITE_LOG_LEVEL` | `"info"` | Standard logging |
| `VITE_ENABLE_DEBUG_LOGS` | `false` | Clean logs |
| `VITE_RATE_LIMIT_REQUESTS` | `120` | Slightly relaxed limits |
| `VITE_ERROR_REPORTING_ENABLED` | `true` | Report errors for testing |

#### Staging .env File

```bash
# Staging Environment Configuration
# =================================

# Application Info
VITE_APP_NAME="LunchPay (Staging)"
VITE_APP_VERSION="1.0.0-staging"
VITE_APP_ENVIRONMENT="staging"

# API Configuration
VITE_API_BASE_URL="https://api-staging.lunchpay.app"
VITE_API_TIMEOUT=15000
VITE_API_RETRY_ATTEMPTS=3

# Authentication
VITE_AUTH_TOKEN_EXPIRY="24h"
VITE_SESSION_TIMEOUT=1800000
VITE_ENABLE_AUTH_PERSISTENCE=true
VITE_PASSWORD_MIN_LENGTH=8

# Feature Toggles (Production-like)
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_GROUP_CREATION=true
VITE_ENABLE_EXPENSE_CATEGORIES=true
VITE_ENABLE_UNEQUAL_SPLITTING=true

# Production-like Limits
VITE_MAX_GROUP_MEMBERS=20
VITE_MAX_EXPENSE_AMOUNT=10000
VITE_RATE_LIMIT_REQUESTS=120

# Logging & Monitoring
VITE_LOG_LEVEL="info"
VITE_ENABLE_DEBUG_LOGS=false
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ERROR_REPORTING_ENABLED=true

# External Services (Staging)
VITE_SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
VITE_ANALYTICS_ID="G-XXXXXXXXXX"
VITE_HOTJAR_ID=""
VITE_SUPPORT_EMAIL="staging@lunchpay.app"

# Staging-Specific Features
VITE_ENABLE_TEST_USERS=true
VITE_SHOW_ENVIRONMENT_BANNER=true
```

---

### 🚀 Production Environment

**Purpose**: Live application serving real users
**Security Level**: Maximum security and performance
**Data**: Real user data with strict protection

#### Production Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_APP_ENVIRONMENT` | `"production"` | Production optimizations |
| `VITE_API_BASE_URL` | `"https://api.lunchpay.app"` | Production API |
| `VITE_API_TIMEOUT` | `10000` | Fast timeout |
| `VITE_LOG_LEVEL` | `"warn"` | Minimal logging |
| `VITE_ENABLE_DEBUG_LOGS` | `false` | No debug info |
| `VITE_RATE_LIMIT_REQUESTS` | `60` | Strict rate limiting |
| `VITE_ERROR_REPORTING_ENABLED` | `true` | Monitor production errors |

#### Production .env File

```bash
# Production Environment Configuration
# ====================================

# Application Info
VITE_APP_NAME="LunchPay"
VITE_APP_VERSION="1.0.0"
VITE_APP_ENVIRONMENT="production"

# API Configuration
VITE_API_BASE_URL="https://api.lunchpay.app"
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=2

# Authentication (Secure)
VITE_AUTH_TOKEN_EXPIRY="12h"
VITE_SESSION_TIMEOUT=1800000
VITE_ENABLE_AUTH_PERSISTENCE=true
VITE_PASSWORD_MIN_LENGTH=8

# Feature Toggles (Stable Features Only)
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_GROUP_CREATION=true
VITE_ENABLE_EXPENSE_CATEGORIES=true
VITE_ENABLE_UNEQUAL_SPLITTING=true

# Production Limits (Strict)
VITE_MAX_GROUP_MEMBERS=20
VITE_MAX_EXPENSE_AMOUNT=10000
VITE_RATE_LIMIT_REQUESTS=60

# Logging & Monitoring (Minimal)
VITE_LOG_LEVEL="warn"
VITE_ENABLE_DEBUG_LOGS=false
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ERROR_REPORTING_ENABLED=true

# External Services (Production)
VITE_SENTRY_DSN="https://production-key@sentry.io/project"
VITE_ANALYTICS_ID="G-PRODUCTION123"
VITE_HOTJAR_ID="3123456"
VITE_SUPPORT_EMAIL="help@lunchpay.app"

# Security Headers
VITE_CSP_ENABLED=true
VITE_HTTPS_ONLY=true
```

---

## Security & Secrets Management

### 🔐 Secret Rotation Guidelines

#### High Priority (Rotate Quarterly)
- `VITE_JWT_SECRET_KEY` - JWT signing keys
- Database connection strings (backend)
- API keys for external services

#### Medium Priority (Rotate Bi-annually)
- `VITE_SENTRY_DSN` - Error tracking keys
- `VITE_ANALYTICS_ID` - Analytics tracking IDs
- Service-to-service authentication tokens

#### Low Priority (Rotate Annually)
- `VITE_HOTJAR_ID` - User behavior tracking
- Support email addresses
- Feature toggle configurations

### 🛡️ Secret Storage Best Practices

#### Development
- **Local**: Use `.env.local` files (gitignored)
- **Sharing**: Use environment variable management tools
- **Security**: Acceptable to use placeholder values

#### Staging
- **Storage**: Platform environment variables (Vercel, Netlify)
- **Access**: Limited to staging team members
- **Rotation**: Monthly rotation schedule

#### Production
- **Storage**: Secure cloud key management (AWS Secrets Manager, Azure Key Vault)
- **Access**: Principle of least privilege
- **Rotation**: Automated rotation where possible
- **Audit**: Log all secret access and changes

---

## Platform-Specific Configuration

### ☁️ Vercel Deployment

#### Environment Variable Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Set production environment variables
vercel env add VITE_API_BASE_URL production
vercel env add VITE_SENTRY_DSN production

# Set staging environment variables
vercel env add VITE_API_BASE_URL preview
vercel env add VITE_LOG_LEVEL preview

# Deploy with environment
vercel --prod
```

#### Vercel-Specific Variables
```bash
# Vercel Platform
VERCEL_URL="auto-generated-url.vercel.app"
VERCEL_ENV="production"

# Custom Domain
VITE_APP_DOMAIN="lunchpay.app"
VITE_APP_URL="https://lunchpay.app"
```

### 🌐 Netlify Deployment

#### Environment Variable Setup
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Set environment variables
netlify env:set VITE_API_BASE_URL "https://api.lunchpay.app"
netlify env:set VITE_SENTRY_DSN "your-sentry-dsn"

# Deploy
netlify deploy --prod
```

#### Netlify-Specific Variables
```bash
# Netlify Platform
NETLIFY_SITE_URL="https://lunchpay.netlify.app"
NETLIFY_DEPLOY_URL="auto-generated-deploy-url"

# Build Configuration
VITE_BUILD_COMMAND="npm run build"
VITE_PUBLISH_DIRECTORY="dist"
```

### 🐳 Docker Configuration

#### Dockerfile Environment Setup
```dockerfile
# Build-time arguments
ARG VITE_API_BASE_URL
ARG VITE_APP_ENVIRONMENT

# Set environment variables
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_APP_ENVIRONMENT=${VITE_APP_ENVIRONMENT}

# Build application
RUN npm run build
```

#### Docker Compose
```yaml
# docker-compose.yml
services:
  lunchpay-frontend:
    build: .
    environment:
      - VITE_API_BASE_URL=http://backend:3001/api
      - VITE_APP_ENVIRONMENT=development
    ports:
      - "3000:3000"
```

---

## Local Development Setup

### 🛠️ Development Environment Setup

#### 1. Clone and Install
```bash
# Clone repository
git clone https://github.com/yourorg/lunch-pay-app.git
cd lunch-pay-app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

#### 2. Local Environment File
Create `.env.local`:
```bash
# Local Development Configuration
# Copy from .env.example and modify as needed

# API Configuration
VITE_API_BASE_URL="http://localhost:3001/api"

# Development Features
VITE_ENABLE_DEBUG_LOGS=true
VITE_LOG_LEVEL="debug"

# Local Testing
VITE_ENABLE_API_MOCKING=true
VITE_MOCK_DELAY=1000
```

#### 3. Start Development
```bash
# Start development server
npm run dev

# Start with specific environment
npm run dev:staging
```

### 📝 Environment File Structure
```
project-root/
├── .env.example          # Template with all variables
├── .env.local           # Local development (gitignored)
├── .env.development     # Development defaults
├── .env.staging        # Staging configuration
├── .env.production     # Production configuration
└── .gitignore          # Ignore .env.local and secrets
```

---

## Monitoring & Logging Configuration

### 📊 Logging Levels

| Level | Purpose | Environments | Example Usage |
|-------|---------|--------------|---------------|
| `debug` | Detailed debugging info | Development | Function entry/exit, variable values |
| `info` | General information | Development, Staging | User actions, API calls |
| `warn` | Warning conditions | All | Deprecated features, non-critical errors |
| `error` | Error conditions | All | API failures, authentication errors |
| `fatal` | System failures | Production | Application crashes, critical failures |

### 🔍 Performance Monitoring Variables

```bash
# Performance Monitoring
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_PERFORMANCE_SAMPLE_RATE=0.1
VITE_CORE_WEB_VITALS_TRACKING=true

# Error Tracking
VITE_ERROR_SAMPLE_RATE=1.0
VITE_ERROR_IGNORE_PATTERNS="ResizeObserver,Non-Error"

# User Session Tracking
VITE_SESSION_REPLAY_ENABLED=false
VITE_USER_INTERACTION_TRACKING=true
```

### 📈 Analytics Configuration

```bash
# Google Analytics
VITE_ANALYTICS_ID="G-XXXXXXXXXX"
VITE_ANALYTICS_DEBUG=false
VITE_ANALYTICS_TRACK_PAGEVIEWS=true
VITE_ANALYTICS_TRACK_EVENTS=true

# Custom Analytics
VITE_TRACK_USER_JOURNEY=true
VITE_TRACK_FEATURE_USAGE=true
VITE_ANONYMIZE_USER_DATA=true
```

---

## Rate Limiting & Feature Toggles

### ⚡ Rate Limiting Configuration

```bash
# API Rate Limits
VITE_RATE_LIMIT_REQUESTS=60          # Requests per minute
VITE_RATE_LIMIT_WINDOW=60000         # Window in milliseconds
VITE_RATE_LIMIT_BURST=10             # Burst allowance

# Feature-Specific Limits
VITE_EXPENSE_CREATION_LIMIT=20       # Expenses per hour
VITE_GROUP_CREATION_LIMIT=5          # Groups per day
VITE_INVITATION_LIMIT=50             # Invitations per day

# UI Rate Limiting
VITE_BUTTON_DEBOUNCE_MS=1000         # Prevent double-clicks
VITE_SEARCH_DEBOUNCE_MS=500          # Search input delay
```

### 🚩 Feature Toggle Configuration

```bash
# Core Features
VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_PASSWORD_RESET=true
VITE_ENABLE_EMAIL_VERIFICATION=true

# Group Features
VITE_ENABLE_GROUP_CREATION=true
VITE_ENABLE_GROUP_INVITATIONS=true
VITE_ENABLE_GROUP_DELETION=true

# Expense Features
VITE_ENABLE_EXPENSE_CREATION=true
VITE_ENABLE_EXPENSE_EDITING=true
VITE_ENABLE_EXPENSE_DELETION=true
VITE_ENABLE_UNEQUAL_SPLITTING=true

# Advanced Features
VITE_ENABLE_EXPENSE_CATEGORIES=true
VITE_ENABLE_EXPENSE_SEARCH=true
VITE_ENABLE_SETTLEMENT_TRACKING=true
VITE_ENABLE_BALANCE_HISTORY=true

# Experimental Features
VITE_ENABLE_RECURRING_EXPENSES=false
VITE_ENABLE_EXPENSE_PHOTOS=false
VITE_ENABLE_CURRENCY_CONVERSION=false
```

---

## Security Headers & CSP

### 🛡️ Content Security Policy

```bash
# CSP Configuration
VITE_CSP_ENABLED=true
VITE_CSP_REPORT_ONLY=false

# CSP Directives
VITE_CSP_DEFAULT_SRC="'self'"
VITE_CSP_SCRIPT_SRC="'self' 'unsafe-inline'"
VITE_CSP_STYLE_SRC="'self' 'unsafe-inline'"
VITE_CSP_IMG_SRC="'self' data: https:"
VITE_CSP_CONNECT_SRC="'self' https://api.lunchpay.app"
```

### 🔒 Security Headers

```bash
# Security Headers
VITE_HTTPS_ONLY=true
VITE_HSTS_MAX_AGE=31536000
VITE_FRAME_OPTIONS="DENY"
VITE_CONTENT_TYPE_OPTIONS="nosniff"
VITE_REFERRER_POLICY="strict-origin-when-cross-origin"
```

---

## Validation & Testing

### ✅ Environment Validation

Create a validation script to check required variables:

```bash
# scripts/validate-env.js
const requiredVars = [
  'VITE_APP_ENVIRONMENT',
  'VITE_API_BASE_URL',
  'VITE_APP_NAME'
];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

console.log('✅ All required environment variables are set');
```

### 🧪 Environment Testing

```bash
# Test environment configuration
npm run test:env

# Test API connectivity
npm run test:api

# Validate build with environment
npm run build:validate
```

---

## Backup & Recovery

### 💾 Environment Backup Strategy

#### Weekly Backups
- Export all environment variables to encrypted files
- Store in secure cloud storage
- Version control environment templates

#### Recovery Procedures
1. **Lost Environment Variables**: Restore from backup
2. **Compromised Secrets**: Immediate rotation
3. **Platform Migration**: Import/export procedures

#### Backup Script
```bash
#!/bin/bash
# backup-env.sh

BACKUP_DATE=$(date +%Y%m%d)
BACKUP_FILE="env-backup-${BACKUP_DATE}.json"

# Export current environment (excluding secrets)
vercel env ls --scope production > "${BACKUP_FILE}"

# Encrypt backup
gpg --encrypt --recipient admin@lunchpay.app "${BACKUP_FILE}"

# Upload to secure storage
aws s3 cp "${BACKUP_FILE}.gpg" s3://lunchpay-backups/environments/
```

---

## Troubleshooting

### 🚨 Common Issues

#### Issue: Environment Variables Not Loading
**Symptoms**: Default values used instead of configured values
**Solutions**:
1. Check file naming (`.env.local` vs `.env`)
2. Verify `VITE_` prefix for client-side variables
3. Restart development server
4. Check for syntax errors in .env file

#### Issue: API Connection Failures
**Symptoms**: Network errors, timeouts
**Solutions**:
1. Verify `VITE_API_BASE_URL` is correct
2. Check API server status
3. Validate CORS configuration
4. Test with curl/Postman

#### Issue: Feature Toggles Not Working
**Symptoms**: Features enabled/disabled incorrectly
**Solutions**:
1. Check boolean string values ("true" vs true)
2. Verify variable names match code
3. Clear browser cache
4. Check build-time vs runtime variables

### 🔧 Debug Commands

```bash
# Print all environment variables
npm run env:debug

# Test API connectivity
npm run api:test

# Validate environment configuration
npm run env:validate

# Check build-time variables
npm run build:debug
```

---

This comprehensive environment configuration guide ensures secure, scalable, and maintainable deployment of the LunchPay application across all environments while following DevOps best practices for secret management and configuration.
