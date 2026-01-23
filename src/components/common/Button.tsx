import { ButtonHTMLAttributes, forwardRef } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
        outline: 'border border-gray-300 bg-white hover:bg-gray-100 focus-visible:ring-gray-500',
        ghost: 'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
        link: 'text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      loadingText,
      children,
      disabled,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const buttonContent = isLoading ? (
      <>
        <div
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
        {loadingText ?? children}
      </>
    ) : (
      children
    );

    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        aria-label={ariaLabel ?? (typeof children === 'string' ? children : undefined)}
        {...props}
      >
        {buttonContent}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
