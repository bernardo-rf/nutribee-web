import { z } from 'zod';

const heightSchema = z.object({
  value: z.number().min(0, 'Value must be positive'),
  unit: z.enum(['cm', 'in']),
});

const weightSchema = z.object({
  value: z.number().min(0, 'Value must be positive'),
  unit: z.enum(['kg', 'lbs']),
});

const measurementSchema = z.object({
  value: z.number().min(0, 'Value must be positive'),
  unit: z.enum(['cm', 'in']),
});

const exerciseRoutineSchema = z
  .object({
    type: z.string(),
    frequency: z.string(),
    duration: z.string(),
  })
  .optional();

const hydrationSchema = z.object({
  dailyWaterIntake: z
    .number()
    .min(0, 'Daily water intake must be positive')
    .max(20, 'Daily water intake is too high')
    .refine((val) => Number(val.toFixed(1)) === val, {
      message: 'Daily water intake must have at most one decimal place',
    }),
});

const sleepSchema = z.object({
  averageDuration: z
    .number()
    .min(0, 'Average sleep duration must be positive')
    .max(24, 'Average sleep duration cannot exceed 24 hours')
    .refine((val) => Number(val.toFixed(1)) === val, {
      message: 'Average sleep duration must have at most one decimal place',
    }),
});

export const clientFormSchema = z.object({
  // General Information
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female']),
  occupation: z.string().min(1, 'Occupation is required'),
  appointmentReason: z.string().min(1, 'Appointment reason is required'),
  expectations: z.string().min(1, 'Expectations are required'),
  clinicalObjective: z.string().min(1, 'Clinical objective is required'),

  // Personal & Social History
  intestinalFunction: z.string().min(1, 'Intestinal function information is required'),
  sleepQuality: z.enum(['poor', 'fair', 'good', 'excellent']),
  smokingStatus: z.enum(['never', 'former', 'current']),
  alcoholConsumption: z.enum(['none', 'occasional', 'regular']),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']),
  physicalActivity: z.string().min(1, 'Physical activity information is required'),
  wakeUpTime: z.string().min(1, 'Wake up time is required'),
  bedTime: z.string().min(1, 'Bed time is required'),
  foodPreferences: z.array(z.string()).optional(),
  foodAllergies: z.array(z.string()).optional(),
  foodIntolerances: z.array(z.string()).optional(),
  waterIntake: z.number().min(0, 'Water intake must be positive'),

  // Health & Body Metrics
  height: heightSchema,
  weight: weightSchema,
  abdominalCircumference: measurementSchema.optional(),
  waistCircumference: measurementSchema.optional(),
  chestCircumference: measurementSchema.optional(),

  // Analytical Data
  hdlCholesterol: z.number().min(0, 'HDL cholesterol must be positive').optional(),
  ldlCholesterol: z.number().min(0, 'LDL cholesterol must be positive').optional(),
  totalCholesterol: z.number().min(0, 'Total cholesterol must be positive').optional(),
  triglycerides: z.number().min(0, 'Triglycerides must be positive').optional(),

  // Body Composition
  visceralFat: z.number().min(0, 'Visceral fat must be positive').optional(),
  muscleMass: z.number().min(0, 'Muscle mass must be positive').optional(),
  bodyFatPercentage: z.number().min(0).max(100).optional(),
  muscleMassPercentage: z.number().min(0).max(100).optional(),
  bodyWaterPercentage: z.number().min(0).max(100).optional(),
  bmi: z.number().min(10, 'BMI must be at least 10').max(50, 'BMI cannot exceed 50').optional(),

  // Lifestyle & Activity
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active']),
  exerciseRoutine: exerciseRoutineSchema,
  occupationType: z.enum(['sedentary', 'standing', 'physical_labor']),

  // Dietary Preferences
  dietType: z.enum(['standard', 'vegetarian', 'vegan', 'keto', 'paleo', 'other']),
  favoriteFoods: z.array(z.string()).optional(),
  foodsToAvoid: z.array(z.string()).optional(),

  // Health Goals
  primaryGoal: z.enum(['weight_loss', 'muscle_gain', 'maintenance', 'improve_energy', 'other']),
  targetWeight: weightSchema.optional(),
  healthConcerns: z.array(z.string()).optional(),

  // Lifestyle Habits
  hydration: hydrationSchema,
  sleep: sleepSchema,
  supplements: z.array(z.string()).optional(),

  // System Fields
  nutritionistId: z.string(),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;
