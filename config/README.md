# Environment Configuration

This directory contains environment-specific configuration files for the LunchPay application.

## Quick Start

### 1. Development Setup
```bash
# Copy the environment template
cp env.example .env.local

# Edit with your local settings
# Set VITE_API_BASE_URL to your local API server

# Validate your configuration
npm run env:validate:dev

# Start development
npm run dev
```

### 2. Production Deployment
```bash
# Validate production environment
npm run env:validate:prod

# Build with environment validation
npm run build:prod
```

## Files

| File | Purpose |
|------|---------|
| `env.example` | Template with all variables and documentation |
| `env.development.js` | Development environment configuration |
| `env.production.js` | Production environment configuration |
| `README.md` | This documentation file |

## Environment Variables Quick Reference

### Required for All Environments
- `VITE_APP_NAME` - Application name
- `VITE_APP_ENVIRONMENT` - Current environment (development/staging/production)
- `VITE_API_BASE_URL` - Backend API endpoint

### Development Only
- `VITE_ENABLE_DEBUG_LOGS=true` - Show debug information
- `VITE_ENABLE_API_MOCKING=true` - Use mock API responses
- `VITE_SHOW_DEV_TOOLS=true` - Enable development tools

### Production Only
- `VITE_SENTRY_DSN` - Error tracking endpoint
- `VITE_ANALYTICS_ID` - Google Analytics tracking ID
- `VITE_CSP_ENABLED=true` - Enable Content Security Policy

## Validation

Run environment validation before deployment:

```bash
# Validate current environment
npm run env:validate

# Validate specific environment
npm run env:validate:prod
```

## Security Notes

⚠️ **Never commit actual .env files to version control**

✅ **Do commit:**
- `env.example` (template with no secrets)
- Configuration files in this directory
- Documentation

❌ **Never commit:**
- `.env.local` (local development)
- `.env.production` (production secrets)
- Any file containing actual API keys or tokens

## Platform Deployment

### Vercel
```bash
# Set environment variables
vercel env add VITE_API_BASE_URL
vercel env add VITE_SENTRY_DSN

# Deploy
vercel --prod
```

### Netlify
```bash
# Set environment variables
netlify env:set VITE_API_BASE_URL "https://api.example.com"

# Deploy
netlify deploy --prod
```

### Docker
```dockerfile
# Build with environment variables
docker build --build-arg VITE_API_BASE_URL=https://api.example.com .

# Run with environment file
docker run --env-file .env.production app
```

## Troubleshooting

### Common Issues

**Environment variables not loading:**
- Check file naming (`.env.local` not `.env`)
- Ensure `VITE_` prefix for client-side variables
- Restart development server

**API connection failures:**
- Verify `VITE_API_BASE_URL` is correct
- Check for trailing slashes in URLs
- Validate CORS configuration

**Build failures:**
- Run `npm run env:validate` to check configuration
- Ensure all required variables are set
- Check for syntax errors in environment files

### Debug Commands
```bash
# Print all VITE_ environment variables
env | grep VITE_

# Test API connectivity
curl $VITE_API_BASE_URL/health

# Validate and build
npm run build:prod
```

For more detailed information, see `docs/environment-config.md`.
