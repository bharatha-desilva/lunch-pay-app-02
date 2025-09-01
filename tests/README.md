# LunchPay Testing Suite

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Run all tests with coverage
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## Test Structure

- **`/unit`** - Unit tests for individual components, services, hooks
- **`/integration`** - Integration tests for component interactions
- **`/fixtures`** - Mock data and test fixtures
- **`/mocks`** - Mock implementations for external services
- **`/utils`** - Test utilities and custom render functions

## Writing Tests

### Component Tests

```typescript
import { render, screen, userEvent } from '../utils/test-utils';
import { MyComponent } from '../../src/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Hook Tests

```typescript
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '../../src/hooks/useMyHook';

describe('useMyHook', () => {
  it('should return expected values', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(expected);
  });
});
```

### Service Tests

```typescript
import { myService } from '../../src/services/myService';
import { mockApiService } from '../mocks/api.mock';

describe('MyService', () => {
  it('should call API correctly', async () => {
    mockApiService.get.mockResolvedValue(mockData);
    const result = await myService.getData();
    expect(result).toEqual(mockData);
  });
});
```

## Test Utilities

### Custom Render

Use `render` from `test-utils.tsx` instead of directly from `@testing-library/react`. This provides all necessary providers (React Query, Router, Auth).

```typescript
import { render, screen } from '../utils/test-utils';
```

### Fixtures

Import mock data from fixtures:

```typescript
import { mockUsers, mockGroups } from '../fixtures';
```

### Mocks

Use provided mocks for external dependencies:

```typescript
import { mockApiService, mockLocalStorage } from '../mocks';
```

## Coverage Requirements

- **Overall**: ≥70%
- **Components**: ≥80%
- **Services**: ≥90%
- **Hooks**: ≥85%

## CI Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main`

Coverage reports are generated and must meet minimum thresholds for builds to pass.
