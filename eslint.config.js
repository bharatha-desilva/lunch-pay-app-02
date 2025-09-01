import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Allow utility functions and constants in component files
      'react-refresh/only-export-components': [
        'warn',
        { 
          allowConstantExport: true,
        },
      ],
      // Make useless catch a warning instead of error for service files
      'no-useless-catch': 'warn',
      // Allow any types in specific performance utility contexts
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          'ignoreRestArgs': false
        }
      ],
    },
  },
  // Special rules for utility and helper files
  {
    files: ['**/utils/**/*.{ts,tsx}', '**/optimized/**/*.{ts,tsx}', '**/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
])
