import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '@/components/common/Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('should render with different variants', () => {
      const { rerender } = render(<Button variant="default">Default</Button>);
      let button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary-600');

      rerender(<Button variant="secondary">Secondary</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-100');

      rerender(<Button variant="outline">Outline</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('border');

      rerender(<Button variant="ghost">Ghost</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-gray-100');

      rerender(<Button variant="link">Link</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary-600');
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<Button size="default">Default</Button>);
      let button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');

      rerender(<Button size="sm">Small</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('h-8');

      rerender(<Button size="lg">Large</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('h-12');

      rerender(<Button size="icon">Icon</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'w-10');
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe('Ref Button');
    });
  });

  describe('Loading State', () => {
    it('should show loading state with spinner', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
      const spinner = button.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should show loading text when provided', () => {
      render(
        <Button isLoading loadingText="Saving...">
          Submit
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Saving...');
      expect(button).not.toHaveTextContent('Submit');
    });

    it('should show original children when loading text is not provided', () => {
      render(<Button isLoading>Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Submit');
    });

    it('should disable button when loading', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Disabled State', () => {
    it('should disable button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should disable button when both loading and disabled are true', () => {
      render(
        <Button isLoading disabled>
          Button
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should handle click events', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>,
      );
      const button = screen.getByRole('button');
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(
        <Button isLoading onClick={handleClick}>
          Loading
        </Button>,
      );
      const button = screen.getByRole('button');
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should set aria-busy when loading', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should not set aria-busy when not loading', () => {
      render(<Button>Not Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-busy');
    });

    it('should set aria-label from prop when provided', () => {
      render(<Button aria-label="Custom label">Button</Button>);
      const button = screen.getByRole('button', { name: 'Custom label' });
      expect(button).toBeInTheDocument();
    });

    it('should set aria-label from children when children is a string', () => {
      render(<Button>Submit Form</Button>);
      const button = screen.getByRole('button', { name: 'Submit Form' });
      expect(button).toBeInTheDocument();
    });

    it('should use semantic button element', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Props Forwarding', () => {
    it('should forward HTML button attributes', () => {
      render(
        <Button type="submit" form="test-form" data-testid="test-button">
          Submit
        </Button>,
      );
      const button = screen.getByTestId('test-button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('form', 'test-form');
    });
  });
});
