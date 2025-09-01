#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * =====================================
 * 
 * Validates environment variables for the LunchPay application
 * across different environments (development, staging, production).
 * 
 * Usage:
 *   node scripts/validate-environment.js [environment]
 *   npm run env:validate [environment]
 * 
 * Examples:
 *   node scripts/validate-environment.js development
 *   node scripts/validate-environment.js production
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

/**
 * Log with colors
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Environment validation rules
 */
const validationRules = {
  development: {
    required: [
      'VITE_APP_NAME',
      'VITE_APP_ENVIRONMENT',
      'VITE_API_BASE_URL',
    ],
    optional: [
      'VITE_API_TIMEOUT',
      'VITE_LOG_LEVEL',
      'VITE_ENABLE_DEBUG_LOGS',
    ],
    mustBeHttps: [],
    mustBeBoolean: [
      'VITE_ENABLE_DEBUG_LOGS',
      'VITE_ENABLE_REGISTRATION',
      'VITE_ENABLE_API_MOCKING',
    ],
    mustBeNumeric: [
      'VITE_API_TIMEOUT',
      'VITE_SESSION_TIMEOUT',
      'VITE_MAX_GROUP_MEMBERS',
    ],
  },

  staging: {
    required: [
      'VITE_APP_NAME',
      'VITE_APP_ENVIRONMENT',
      'VITE_API_BASE_URL',
      'VITE_APP_VERSION',
    ],
    optional: [
      'VITE_SENTRY_DSN',
      'VITE_ANALYTICS_ID',
    ],
    mustBeHttps: [
      'VITE_API_BASE_URL',
    ],
    mustBeBoolean: [
      'VITE_ENABLE_DEBUG_LOGS',
      'VITE_ERROR_REPORTING_ENABLED',
      'VITE_ENABLE_REGISTRATION',
    ],
    mustBeNumeric: [
      'VITE_API_TIMEOUT',
      'VITE_SESSION_TIMEOUT',
      'VITE_RATE_LIMIT_REQUESTS',
    ],
  },

  production: {
    required: [
      'VITE_APP_NAME',
      'VITE_APP_ENVIRONMENT',
      'VITE_API_BASE_URL',
      'VITE_APP_VERSION',
      'VITE_SUPPORT_EMAIL',
    ],
    optional: [
      'VITE_SENTRY_DSN',
      'VITE_ANALYTICS_ID',
      'VITE_HOTJAR_ID',
    ],
    mustBeHttps: [
      'VITE_API_BASE_URL',
      'VITE_APP_URL',
      'VITE_CDN_URL',
    ],
    mustBeBoolean: [
      'VITE_ENABLE_DEBUG_LOGS',
      'VITE_ERROR_REPORTING_ENABLED',
      'VITE_CSP_ENABLED',
      'VITE_HTTPS_ONLY',
    ],
    mustBeNumeric: [
      'VITE_API_TIMEOUT',
      'VITE_SESSION_TIMEOUT',
      'VITE_RATE_LIMIT_REQUESTS',
      'VITE_MAX_GROUP_MEMBERS',
    ],
    security: {
      'VITE_ENABLE_DEBUG_LOGS': 'false',
      'VITE_LOG_LEVEL': ['warn', 'error'],
      'VITE_CSP_ENABLED': 'true',
      'VITE_HTTPS_ONLY': 'true',
    },
  },
};

/**
 * Load environment variables from process.env
 */
function loadEnvironmentVariables() {
  const env = {};
  
  // Load all VITE_ prefixed variables
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('VITE_')) {
      env[key] = process.env[key];
    }
  });

  return env;
}

/**
 * Validate required variables
 */
function validateRequired(env, required) {
  const errors = [];
  const warnings = [];

  required.forEach(varName => {
    if (!env[varName]) {
      errors.push(`Missing required variable: ${varName}`);
    } else if (!env[varName].trim()) {
      warnings.push(`Empty required variable: ${varName}`);
    }
  });

  return { errors, warnings };
}

/**
 * Validate boolean variables
 */
function validateBooleans(env, booleanVars) {
  const errors = [];

  booleanVars.forEach(varName => {
    if (env[varName] && !['true', 'false'].includes(env[varName].toLowerCase())) {
      errors.push(`${varName} must be "true" or "false", got: ${env[varName]}`);
    }
  });

  return errors;
}

/**
 * Validate numeric variables
 */
function validateNumeric(env, numericVars) {
  const errors = [];

  numericVars.forEach(varName => {
    if (env[varName] && isNaN(Number(env[varName]))) {
      errors.push(`${varName} must be numeric, got: ${env[varName]}`);
    }
  });

  return errors;
}

/**
 * Validate HTTPS URLs
 */
function validateHttps(env, httpsVars) {
  const errors = [];

  httpsVars.forEach(varName => {
    if (env[varName] && !env[varName].startsWith('https://')) {
      errors.push(`${varName} must use HTTPS in production, got: ${env[varName]}`);
    }
  });

  return errors;
}

/**
 * Validate security settings for production
 */
function validateSecurity(env, securityRules) {
  const errors = [];
  const warnings = [];

  Object.entries(securityRules).forEach(([varName, expectedValue]) => {
    const actualValue = env[varName];

    if (Array.isArray(expectedValue)) {
      if (actualValue && !expectedValue.includes(actualValue)) {
        warnings.push(`${varName} should be one of [${expectedValue.join(', ')}], got: ${actualValue}`);
      }
    } else {
      if (actualValue !== expectedValue) {
        if (varName.includes('DEBUG') || varName.includes('CSP') || varName.includes('HTTPS')) {
          errors.push(`${varName} must be "${expectedValue}" in production, got: ${actualValue}`);
        } else {
          warnings.push(`${varName} should be "${expectedValue}" in production, got: ${actualValue}`);
        }
      }
    }
  });

  return { errors, warnings };
}

/**
 * Check for potential security issues
 */
function checkSecurity(env, environment) {
  const issues = [];

  // Check for debug features in production
  if (environment === 'production') {
    if (env.VITE_ENABLE_DEBUG_LOGS === 'true') {
      issues.push('🚨 Debug logs are enabled in production');
    }
    
    if (env.VITE_SHOW_DEV_TOOLS === 'true') {
      issues.push('🚨 Development tools are enabled in production');
    }
    
    if (env.VITE_ENABLE_API_MOCKING === 'true') {
      issues.push('🚨 API mocking is enabled in production');
    }
  }

  // Check for insecure URLs
  if (env.VITE_API_BASE_URL && env.VITE_API_BASE_URL.startsWith('http://') && environment !== 'development') {
    issues.push('⚠️ API URL uses HTTP instead of HTTPS');
  }

  // Check for default/example values
  if (env.VITE_SUPPORT_EMAIL === 'help@example.com') {
    issues.push('⚠️ Using example support email');
  }

  return issues;
}

/**
 * Print validation results
 */
function printResults(environment, results) {
  log(`\n${colors.bold}Environment Validation Results: ${environment.toUpperCase()}${colors.reset}`, 'cyan');
  log('='.repeat(50), 'cyan');

  // Print summary
  const totalErrors = results.required.errors.length + 
                     results.booleans.length + 
                     results.numeric.length + 
                     results.https.length + 
                     (results.security?.errors.length || 0);

  const totalWarnings = results.required.warnings.length + 
                       (results.security?.warnings.length || 0) + 
                       results.securityIssues.length;

  if (totalErrors === 0 && totalWarnings === 0) {
    log('✅ All validations passed!', 'green');
  } else {
    if (totalErrors > 0) {
      log(`❌ ${totalErrors} error(s) found`, 'red');
    }
    if (totalWarnings > 0) {
      log(`⚠️ ${totalWarnings} warning(s) found`, 'yellow');
    }
  }

  // Print errors
  if (totalErrors > 0) {
    log('\n🚫 ERRORS:', 'red');
    [...results.required.errors, ...results.booleans, ...results.numeric, ...results.https, ...(results.security?.errors || [])].forEach(error => {
      log(`  • ${error}`, 'red');
    });
  }

  // Print warnings
  if (totalWarnings > 0) {
    log('\n⚠️ WARNINGS:', 'yellow');
    [...results.required.warnings, ...(results.security?.warnings || []), ...results.securityIssues].forEach(warning => {
      log(`  • ${warning}`, 'yellow');
    });
  }

  // Print environment summary
  log('\n📊 ENVIRONMENT SUMMARY:', 'blue');
  log(`  Environment: ${environment}`, 'blue');
  log(`  API URL: ${results.env.VITE_API_BASE_URL || 'Not set'}`, 'blue');
  log(`  App Version: ${results.env.VITE_APP_VERSION || 'Not set'}`, 'blue');
  log(`  Debug Logs: ${results.env.VITE_ENABLE_DEBUG_LOGS || 'Not set'}`, 'blue');
  log(`  Error Reporting: ${results.env.VITE_ERROR_REPORTING_ENABLED || 'Not set'}`, 'blue');

  return totalErrors === 0;
}

/**
 * Main validation function
 */
function validateEnvironment(environment) {
  log(`\n🔍 Validating ${environment} environment...`, 'cyan');

  const rules = validationRules[environment];
  if (!rules) {
    log(`❌ Unknown environment: ${environment}`, 'red');
    log(`Available environments: ${Object.keys(validationRules).join(', ')}`, 'yellow');
    process.exit(1);
  }

  const env = loadEnvironmentVariables();
  
  if (Object.keys(env).length === 0) {
    log('⚠️ No VITE_ environment variables found', 'yellow');
    log('Make sure your .env.local file exists and contains VITE_ prefixed variables', 'yellow');
  }

  const results = {
    env,
    required: validateRequired(env, rules.required),
    booleans: validateBooleans(env, rules.mustBeBoolean || []),
    numeric: validateNumeric(env, rules.mustBeNumeric || []),
    https: validateHttps(env, rules.mustBeHttps || []),
    security: rules.security ? validateSecurity(env, rules.security) : { errors: [], warnings: [] },
    securityIssues: checkSecurity(env, environment),
  };

  return printResults(environment, results);
}

/**
 * CLI interface
 */
function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || process.env.VITE_APP_ENVIRONMENT || 'development';

  log('🔧 LunchPay Environment Validator', 'bold');
  
  const isValid = validateEnvironment(environment);

  if (!isValid) {
    log('\n💡 Tips:', 'blue');
    log('  • Copy env.example to .env.local for development', 'blue');
    log('  • Check the environment-config.md documentation', 'blue');
    log('  • Ensure all required variables are set', 'blue');
    log('  • Use proper boolean and numeric values', 'blue');
    
    process.exit(1);
  } else {
    log('\n🎉 Environment validation successful!', 'green');
    process.exit(0);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('validate-environment.js')) {
  main();
}

export { validateEnvironment, validationRules };
