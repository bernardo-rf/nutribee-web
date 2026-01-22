import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1, 'API base URL is required'),
  // Add more environment variables as needed
});

export function validateEnv(): void {
  const parsed = envSchema.safeParse({
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  });

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error);
    throw new Error('Invalid environment variables');
  }
} 