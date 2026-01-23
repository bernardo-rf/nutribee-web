import { UseFormReturn } from 'react-hook-form';

// Base types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User types
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'nutritionist' | 'client';

// Client types
export interface Client extends BaseEntity {
  // Basic Information
  name: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: Gender;

  // Health & Body Metrics
  height: MeasurementValue;
  weight: MeasurementValue;
  bodyFatPercentage?: number;
  bmi?: number;

  // Lifestyle & Activity
  activityLevel: ActivityLevel;
  exerciseRoutine?: ExerciseRoutine;
  occupationType: OccupationType;

  // Dietary Preferences
  dietType: DietType;
  foodAllergies?: string[];
  favoriteFoods?: string[];
  foodsToAvoid?: string[];

  // Health Goals
  primaryGoal: HealthGoal;
  targetWeight?: MeasurementValue;
  healthConcerns?: string[];

  // Lifestyle Habits
  hydration: HydrationInfo;
  sleep: SleepInfo;
  supplements?: string[];

  // System Fields
  status: ClientStatus;
  nutritionistId: string;
  measurements: Measurement[];
  goals: NutritionGoal[];
}

// Enums and Types
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
export type OccupationType = 'sedentary' | 'standing' | 'physical_labor';
export type DietType = 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'other';
export type HealthGoal = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'improve_energy' | 'other';
export type ClientStatus = 'active' | 'inactive' | 'pending';

// Measurement types
export interface Measurement extends BaseEntity {
  clientId: string;
  type: MeasurementType;
  value: number;
  unit: string;
  notes?: string;
}

export type MeasurementType = 'weight' | 'height' | 'bodyFat' | 'muscleMass' | 'bmi';

export interface MeasurementValue {
  value: number;
  unit: 'cm' | 'in' | 'kg' | 'lbs';
}

// Goal types
export interface NutritionGoal extends BaseEntity {
  clientId: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: GoalStatus;
}

export type GoalType = 'weightLoss' | 'weightGain' | 'muscleGain' | 'maintenance';

export type GoalStatus = 'notStarted' | 'inProgress' | 'achieved' | 'failed';

// Supporting interfaces
export interface ExerciseRoutine {
  type: string;
  frequency: string;
  duration: string;
}

export interface HydrationInfo {
  dailyWaterIntake: number; // in liters
}

export interface SleepInfo {
  averageDuration: number; // in hours
}

// Operation states
export type OperationStatus =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: unknown }
  | { status: 'error'; error: Error };

// src/types/domain.ts
// Add these new types to your existing file

// Form-specific types
export interface ClientFormData extends Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
  // Additional form-specific fields
  appointmentReason: string;
  expectations: string;
  clinicalObjective: string;
  intestinalFunction: string;
  physicalActivity: string;
  wakeUpTime: string;
  bedTime: string;
  foodIntolerances: string[];
  waterIntake: number;

  // Health metrics specific to the form
  visceralFat?: number;
  muscleMass?: number;
  muscleMassPercentage?: number;
  bodyWaterPercentage?: number;

  // Blood work
  hdlCholesterol?: number;
  ldlCholesterol?: number;
  totalCholesterol?: number;
  triglycerides?: number;
}

// Form section configuration
export interface FormSection {
  id: string;
  title: string;
  description: string;
  fields: Array<keyof ClientFormData>;
}

// Form component props
export interface FormSectionProps {
  form: UseFormReturn<ClientFormData>;
  isExpanded: boolean;
  onToggle: () => void;
  section: FormSection;
}

export interface ExpandableSectionProps {
  title: string;
  number: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
