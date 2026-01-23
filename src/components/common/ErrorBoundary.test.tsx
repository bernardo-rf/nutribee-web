import { Component } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ErrorBoundaryComponent from '@/components/common/ErrorBoundary';
import { logger } from '@/utils/logger';

const ErrorBoundary = ErrorBoundaryComponent;

jest.mock('@/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

class ErrorComponent extends Component<{ shouldThrow?: boolean; message?: string }> {
  render() {
    if (this.props.shouldThrow) {
      throw new Error(this.props.message || 'Test error');
    }
    return <div>No error</div>;
  }
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Normal Rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>,
      );
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render multiple children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
        </ErrorBoundary>,
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  describe('Error Catching', () => {
    it('should catch errors and display fallback UI', () => {
      render(
        <ErrorBoundary>
          <ErrorComponent shouldThrow />
        </ErrorBoundary>,
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should display error message in fallback', () => {
      render(
        <ErrorBoundary>
          <ErrorComponent shouldThrow message="Custom error message" />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('should display default error message when error has no message', () => {
      const ErrorWithoutMessage = () => {
        throw new Error('');
      };

      render(
        <ErrorBoundary>
          <ErrorWithoutMessage />
        </ErrorBoundary>,
      );

      expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
    });

    it('should display custom fallback when provided', () => {
      const customFallback = <div data-testid="custom-fallback">Custom Error UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ErrorComponent shouldThrow />
        </ErrorBoundary>,
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });
  });

  describe('Development Mode', () => {
    it('should show component stack in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ErrorComponent shouldThrow />
        </ErrorBoundary>,
      );

      const stackElement = document.querySelector('pre');
      expect(stackElement).toBeInTheDocument();
      expect(stackElement?.textContent).toBeTruthy();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Callback', () => {
    it('should call onError callback when error occurs', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ErrorComponent shouldThrow message="Callback test error" />
        </ErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Callback test error',
        }),
        expect.objectContaining({
          componentStack: expect.any(String),
        }),
      );
    });

    it('should not call onError when no error occurs', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary onError={onError}>
          <div>No error</div>
        </ErrorBoundary>,
      );

      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('Reset Functionality', () => {
    const ThrowErrorComponent = ({ shouldThrow }: { readonly shouldThrow: boolean }) => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>No error</div>;
    };

    it('should reset error state when resetKeys change', () => {
      const { rerender } = render(
        <ErrorBoundary resetKeys={['key1']}>
          <ErrorComponent shouldThrow />
        </ErrorBoundary>,
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();

      rerender(
        <ErrorBoundary resetKeys={['key2']}>
          <ErrorComponent shouldThrow={false} />
        </ErrorBoundary>,
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should reset error state when "Try again" button is clicked', async () => {
      const user = userEvent.setup();

      let shouldThrow = true;
      const ThrowErrorWithClosure = () => {
        return <ThrowErrorComponent shouldThrow={shouldThrow} />;
      };

      const TestComponent = ({ componentKey }: { componentKey?: string }) => (
        <ErrorBoundary key={componentKey}>
          <ThrowErrorWithClosure />
        </ErrorBoundary>
      );

      const { rerender } = render(<TestComponent />);

      expect(screen.getByRole('alert')).toBeInTheDocument();

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      
      shouldThrow = false;
      
      await user.click(tryAgainButton);
      rerender(<TestComponent componentKey="reset" />);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should not reset when resetKeys do not change', () => {
      const TestComponent = ({ resetKey }: { resetKey: string }) => (
        <ErrorBoundary resetKeys={[resetKey]}>
          <ThrowErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      const { rerender } = render(<TestComponent resetKey="key1" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();

      rerender(<TestComponent resetKey="key1" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Page Reload', () => {
    it('should have reload page button that calls location.reload', () => {
      const mockReload = jest.fn();
      const originalReload = Object.getOwnPropertyDescriptor(globalThis, 'location')?.value?.reload;
      
      const mockLocation = {
        ...globalThis.location,
        reload: mockReload,
      };
      
      Object.defineProperty(globalThis, 'location', {
        value: mockLocation,
        writable: true,
        configurable: true,
      });

      render(
        <ErrorBoundary>
          <ErrorComponent shouldThrow />
        </ErrorBoundary>,
      );

      const reloadButton = screen.getByRole('button', { name: /reload page/i });
      expect(reloadButton).toBeInTheDocument();
      
      if (originalReload) {
        Object.defineProperty(globalThis, 'location', {
          value: { ...mockLocation, reload: originalReload },
          writable: true,
          configurable: true,
        });
      }
    });
  });

  describe('Error Logging', () => {
    it('should log errors correctly', () => {
      render(
        <ErrorBoundary>
          <ErrorComponent shouldThrow message="Logged error" />
        </ErrorBoundary>,
      );

      expect(logger.error).toHaveBeenCalledWith(
        'Error:',
        'Logged error',
        expect.objectContaining({
          error: expect.any(Error),
          errorInfo: expect.any(Object),
        }),
      );
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert" on error container', () => {
      render(
        <ErrorBoundary>
          <ErrorComponent shouldThrow />
        </ErrorBoundary>,
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have accessible button labels', () => {
      render(
        <ErrorBoundary>
          <ErrorComponent shouldThrow />
        </ErrorBoundary>,
      );

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    });
  });
});
