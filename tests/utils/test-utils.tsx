import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { createMockQueryClient } from '../mocks/react-query.mock';

// Create a test wrapper that includes all necessary providers
interface AllTheProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

const AllTheProviders = ({ children, queryClient }: AllTheProvidersProps) => {
  const testQueryClient = queryClient || createMockQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: (props) => <AllTheProviders {...props} queryClient={queryClient} />,
    ...renderOptions,
  });
};

// Helper to render with only React Query provider (no auth)
const renderWithQueryClient = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient, ...renderOptions } = options;
  const testQueryClient = queryClient || createMockQueryClient();

  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>
        {children}
      </QueryClientProvider>
    ),
    ...renderOptions,
  });
};

// Helper to render with Router only
const renderWithRouter = (ui: ReactElement, options?: RenderOptions) => {
  return render(ui, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    ...options,
  });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, renderWithQueryClient, renderWithRouter };
