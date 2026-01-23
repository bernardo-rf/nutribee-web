import { zodResolver } from '@hookform/resolvers/zod';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import FormInput from '@/components/common/FormInput';

const testSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older'),
  bio: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
});

type TestFormData = z.infer<typeof testSchema>;

const TestForm = ({
  name,
  type = 'text',
  error,
  required = false,
  options,
  placeholder,
  min,
  max,
  step,
  pattern,
  'aria-label': ariaLabel,
}: {
  name: keyof TestFormData;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'time' | 'select' | 'textarea';
  error?: { message?: string };
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string;
  pattern?: string;
  'aria-label'?: string;
}) => {
  const {
    register,
    formState: { errors },
  } = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
  });

  // Convert error prop to FieldError format if provided
  const errorToUse = error
    ? { message: error.message || 'This field is required', type: 'validation' as const }
    : errors[name];

  return (
    <FormInput
      label={name.charAt(0).toUpperCase() + name.slice(1)}
      name={name}
      register={register}
      error={errorToUse}
      required={required}
      type={type}
      options={options}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      pattern={pattern}
      aria-label={ariaLabel}
    />
  );
};

describe('FormInput', () => {
  describe('Rendering', () => {
    it('should render text input by default', () => {
      render(<TestForm name="name" />);
      const input = screen.getByLabelText(/name/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render different input types', () => {
      const { rerender } = render(<TestForm name="email" type="email" />);
      let input = screen.getByLabelText(/email/i);
      expect(input).toHaveAttribute('type', 'email');

      rerender(<TestForm name="name" type="tel" />);
      input = screen.getByLabelText(/name/i);
      expect(input).toHaveAttribute('type', 'tel');

      rerender(<TestForm name="age" type="number" />);
      input = screen.getByLabelText(/age/i);
      expect(input).toHaveAttribute('type', 'number');

      rerender(<TestForm name="name" type="date" />);
      input = screen.getByLabelText(/name/i);
      expect(input).toHaveAttribute('type', 'date');

      rerender(<TestForm name="name" type="time" />);
      input = screen.getByLabelText(/name/i);
      expect(input).toHaveAttribute('type', 'time');
    });

    it('should render select dropdown when type is select with options', () => {
      const options = [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
      ];
      render(<TestForm name="country" type="select" options={options} />);
      const select = screen.getByLabelText(/country/i);
      expect(select.tagName).toBe('SELECT');
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    });

    it('should render textarea when type is textarea', () => {
      render(<TestForm name="bio" type="textarea" />);
      const textarea = screen.getByLabelText(/bio/i);
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should show label correctly', () => {
      render(<TestForm name="name" />);
      expect(screen.getByText(/name/i)).toBeInTheDocument();
    });

    it('should show required field indicator when required', () => {
      render(<TestForm name="name" required />);
      const indicator = screen.getByText('*');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass('text-red-500');
    });

    it('should not show required field indicator when not required', () => {
      render(<TestForm name="bio" />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const TestFormWithClassName = () => {
        const {
          register,
          formState: { errors },
        } = useForm<TestFormData>({
          resolver: zodResolver(testSchema),
        });

        return (
          <FormInput
            label="Name"
            name="name"
            register={register}
            error={errors.name}
            className="custom-class"
          />
        );
      };

      render(<TestFormWithClassName />);
      const input = screen.getByLabelText(/name/i);
      expect(input).toHaveClass('custom-class');
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error prop is provided', () => {
      render(<TestForm name="name" error={{ message: 'Name is required' }} />);
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Name is required')).toHaveClass('text-red-600');
    });

    it('should display default error message when error object has no message', () => {
      render(<TestForm name="name" error={{ message: undefined }} />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should not display error message when error is undefined', () => {
      render(<TestForm name="bio" />);
      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });
  });

  describe('React Hook Form Integration', () => {
    it('should register with react-hook-form correctly', async () => {
      const user = userEvent.setup();
      const TestFormWithSubmit = () => {
        const {
          register,
          handleSubmit,
          formState: { errors },
        } = useForm<TestFormData>({
          resolver: zodResolver(testSchema),
        });

        const onSubmit = jest.fn();

        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput label="Name" name="name" register={register} error={errors.name} required />
            <button type="submit">Submit</button>
          </form>
        );
      };

      render(<TestFormWithSubmit />);
      const input = screen.getByLabelText(/name/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await user.type(input, 'John Doe');
      await user.click(submitButton);

      const form = input.closest('form');
      expect(form).toBeInTheDocument();
    });

    it('should handle form validation errors', async () => {
      const TestFormWithValidation = () => {
        const {
          register,
          handleSubmit,
          formState: { errors },
        } = useForm<TestFormData>({
          resolver: zodResolver(testSchema),
        });

        const onSubmit = jest.fn();

        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput label="Email" name="email" register={register} error={errors.email} />
            <button type="submit">Submit</button>
          </form>
        );
      };

      render(<TestFormWithValidation />);
      const input = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await userEvent.type(input, 'invalid-email');
      await userEvent.click(submitButton);

      expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  describe('Input Attributes', () => {
    it('should handle placeholder prop', () => {
      render(<TestForm name="name" placeholder="Enter your name" />);
      const input = screen.getByPlaceholderText('Enter your name');
      expect(input).toBeInTheDocument();
    });

    it('should handle min prop for number input', () => {
      render(<TestForm name="age" type="number" min={18} />);
      const input = screen.getByLabelText(/age/i);
      expect(input).toHaveAttribute('min', '18');
    });

    it('should handle max prop for number input', () => {
      render(<TestForm name="age" type="number" max={100} />);
      const input = screen.getByLabelText(/age/i);
      expect(input).toHaveAttribute('max', '100');
    });

    it('should handle step prop for number input', () => {
      render(<TestForm name="age" type="number" step="0.1" />);
      const input = screen.getByLabelText(/age/i);
      expect(input).toHaveAttribute('step', '0.1');
    });

    it('should handle pattern prop', () => {
      render(<TestForm name="name" pattern="[A-Za-z]+" />);
      const input = screen.getByLabelText(/name/i);
      expect(input).toHaveAttribute('pattern', '[A-Za-z]+');
    });
  });

  describe('Select Options', () => {
    it('should render all options in select', () => {
      const options = [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'uk', label: 'United Kingdom' },
      ];
      render(<TestForm name="country" type="select" options={options} />);
      options.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('should set correct value attribute for options', () => {
      const options = [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
      ];
      render(<TestForm name="country" type="select" options={options} />);
      const select = screen.getByLabelText(/country/i);
      const usOption = Array.from((select as HTMLSelectElement).options).find((opt) => opt.value === 'us');
      expect(usOption).toBeDefined();
      expect(usOption?.textContent).toBe('United States');
    });
  });

  describe('Textarea', () => {
    it('should render textarea with correct attributes', () => {
      render(<TestForm name="bio" type="textarea" placeholder="Tell us about yourself" />);
      const textarea = screen.getByLabelText(/bio/i);
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveAttribute('placeholder', 'Tell us about yourself');
      expect(textarea).toHaveAttribute('rows', '4');
    });
  });

  describe('Accessibility', () => {
    it('should set aria-label from prop when provided', () => {
      render(<TestForm name="name" aria-label="Full name input" />);
      const input = screen.getByLabelText('Full name input');
      expect(input).toBeInTheDocument();
    });

    it('should set aria-label from label when aria-label is not provided', () => {
      render(<TestForm name="name" />);
      const input = screen.getByLabelText(/name/i);
      expect(input).toBeInTheDocument();
    });

    it('should associate label with input using htmlFor and id', () => {
      render(<TestForm name="name" />);
      const label = screen.getByText(/name/i);
      const input = screen.getByLabelText(/name/i);
      expect(label).toHaveAttribute('for', 'name');
      expect(input).toHaveAttribute('id', 'name');
    });
  });
});
