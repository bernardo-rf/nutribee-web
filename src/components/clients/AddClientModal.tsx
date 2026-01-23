import React, { useState, useEffect } from 'react';

import { XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { clientFormSchema, type ClientFormData } from '../../schemas/clientForm';
import { clientsService } from '../../services/clientsService';
import ArrayInput from '../common/ArrayInput';
import { DatePicker } from '../common/DatePicker';
import MeasurementInput from '../common/MeasurementInput';
import RequiredFieldIndicator from '../common/RequiredFieldIndicator';
import './../../styles/AddClientModal.css';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [currentSection, setCurrentSection] = useState<string>('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    '0': true,
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
    '6': true,
    '7': true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      gender: 'male',
      height: { value: 0, unit: 'cm' },
      weight: { value: 0, unit: 'kg' },
      activityLevel: 'moderately_active',
      dietType: 'standard',
      primaryGoal: 'maintenance',
      hydration: { dailyWaterIntake: 2 },
      sleep: { averageDuration: 8 },
      nutritionistId: 'n1', // TODO: Get from auth context
      sleepQuality: 'good',
      smokingStatus: 'never',
      alcoholConsumption: 'none',
      maritalStatus: 'single',
      bmi: 0,
    },
  });

  const sections = ['General Information', 'Health & Body Metrics', 'Health Goals'];

  const TOTAL_SECTIONS = sections.length;

  const toggleSection = (section: string | number) => {
    const sectionKey = section.toString();
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const isSectionExpanded = (section: string | number): boolean => {
    const sectionKey = section.toString();
    return expandedSections[sectionKey] ?? false;
  };

  useEffect(() => {
    const sectionKey = currentSection;
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: true,
    }));
  }, [currentSection]);

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      await clientsService.create(data);
      onSuccess();
      onClose();
    } catch (error) {
      // TODO: Error handling without console.error
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSectionFields = (section: string | number): string[] => {
    const sectionNumber = typeof section === 'string' ? Number.parseInt(section) : section;
    switch (sectionNumber) {
      case 0:
        return [
          'name',
          'email',
          'phone',
          'dateOfBirth',
          'gender',
          'occupation',
          'appointmentReason',
          'expectations',
          'clinicalObjective',
          'intestinalFunction',
          'sleepQuality',
          'smokingStatus',
          'alcoholConsumption',
          'maritalStatus',
          'physicalActivity',
          'wakeUpTime',
          'bedTime',
          'foodPreferences',
          'foodAllergies',
          'foodIntolerances',
          'waterIntake',
        ];
      case 1:
        return ['height.value', 'weight.value', 'bmi'];
      case 2:
        return ['activityLevel', 'occupationType'];
      case 3:
        return ['dietType'];
      case 4:
        return ['primaryGoal'];
      case 5:
        return ['hydration.dailyWaterIntake', 'sleep.averageDuration'];
      default:
        return [];
    }
  };

  const hasSectionErrors = (section: string | number): boolean => {
    const fields = getSectionFields(section);
    return fields.some((field) => {
      const fieldPath = field.split('.');
      let currentErrors: Record<string, unknown> | undefined = errors as Record<string, unknown>;
      for (const path of fieldPath) {
        if (currentErrors && path in currentErrors) {
          currentErrors = currentErrors[path] as Record<string, unknown>;
        } else {
          return false;
        }
      }
      return currentErrors !== undefined;
    });
  };

  const handleNext = () => {
    const nextSection = (Number.parseInt(currentSection) + 1).toString();
    if (!hasSectionErrors(Number.parseInt(currentSection))) {
      setCurrentSection(nextSection);
    }
  };

  const handlePrevious = () => {
    const prevSection = (Number.parseInt(currentSection) - 1).toString();
    setCurrentSection(prevSection);
  };

  const handleSectionClick = (index: number) => {
    setCurrentSection(index.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="modal-overlay" />

      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-panel">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button type="button" className="modal-close-button" onClick={onClose}>
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="modal-body">
              <h3 className="modal-title">Add New Client</h3>

              {/* Progress Steps */}
              <div className="progress-steps">
                <div className="progress-steps-container">
                  {sections.map((section, index) => {
                    let buttonClass = 'progress-step-button ';
                    if (index === Number.parseInt(currentSection)) {
                      buttonClass += 'progress-step-button-active';
                    } else if (index < Number.parseInt(currentSection)) {
                      buttonClass += 'progress-step-button-completed';
                    } else {
                      buttonClass += 'progress-step-button-upcoming';
                    }

                    return (
                      <div key={section} className="progress-step">
                        <button onClick={() => handleSectionClick(index)} className={buttonClass}>
                          {index + 1}
                        </button>
                        <div className="progress-step-label">{section}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* General Information Section */}
                {Number.parseInt(currentSection) === 0 && (
                  <div className="form-section">
                    <div className="form-header">
                      <h3 className="form-header-title">General Information</h3>
                      <p className="form-header-description">
                        Enter the client&apos;s basic personal and appointment information
                      </p>
                    </div>

                    {/* Personal Information */}
                    <div className="client-form-section">
                      <button
                        type="button"
                        className="client-form-section-header"
                        onClick={() => toggleSection('0')}
                        aria-expanded={isSectionExpanded('0')}
                      >
                        <div className="client-form-section-title-container">
                          <div className="client-form-section-number">
                            <span className="client-form-section-number-text">1</span>
                          </div>
                          <h4 className="client-form-section-title">Personal Information</h4>
                        </div>
                        <div className="client-form-section-toggle">
                          {isSectionExpanded('0') ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </div>
                      </button>

                      {isSectionExpanded('0') && (
                        <div className="client-form-section-content">
                          <div className="form-field">
                            <div className="flex items-center mb-1">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Name
                                <RequiredFieldIndicator />
                              </label>
                            </div>
                            <input
                              type="text"
                              id="name"
                              {...register('name')}
                              className="client-form-input"
                              placeholder="Add the full name of the person"
                            />
                            {errors.name && (
                              <p className="client-form-error">{errors.name.message}</p>
                            )}
                          </div>
                          <div className="client-form-grid">
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="phone"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Phone
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <input
                                type="tel"
                                id="phone"
                                {...register('phone')}
                                className="client-form-input"
                                placeholder="Enter contact phone number"
                              />
                              {errors.phone && (
                                <p className="client-form-error">{errors.phone.message}</p>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="email"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Email
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <input
                                type="email"
                                id="email"
                                {...register('email')}
                                className="client-form-input"
                                placeholder="Enter email address for communications"
                              />
                              {errors.email && (
                                <p className="client-form-error">{errors.email.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="client-form-grid">
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="gender"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Gender
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <select
                                id="gender"
                                {...register('gender')}
                                className="client-form-input"
                              >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                              {errors.gender && (
                                <p className="client-form-error">{errors.gender.message}</p>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="dateOfBirth"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Date of Birth
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <DatePicker
                                value={watch('dateOfBirth')}
                                onChange={(date: string) => setValue('dateOfBirth', date)}
                                error={errors.dateOfBirth?.message}
                              />
                            </div>
                          </div>
                          <div className="form-field">
                            <div className="flex items-center mb-1">
                              <label
                                htmlFor="occupation"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Occupation
                                <RequiredFieldIndicator />
                              </label>
                            </div>
                            <input
                              type="text"
                              id="occupation"
                              {...register('occupation')}
                              className="client-form-input"
                              placeholder="Enter client's occupation"
                            />
                            {errors.occupation && (
                              <p className="client-form-error">{errors.occupation.message}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Appointment Information */}
                    <div className="client-form-section">
                      <button
                        type="button"
                        className="client-form-section-header"
                        onClick={() => toggleSection('1')}
                        aria-expanded={isSectionExpanded('1')}
                      >
                        <div className="client-form-section-title-container">
                          <div className="client-form-section-number">
                            <span className="client-form-section-number-text">2</span>
                          </div>
                          <h4 className="client-form-section-title">Appointment Information</h4>
                        </div>
                        <div className="client-form-section-toggle">
                          {isSectionExpanded('1') ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </div>
                      </button>

                      {isSectionExpanded('1') && (
                        <div className="client-form-section-content">
                          <div className="form-field">
                            <div className="flex items-center mb-1">
                              <label
                                htmlFor="appointmentReason"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Reason for Appointment
                                <RequiredFieldIndicator />
                              </label>
                            </div>
                            <textarea
                              id="appointmentReason"
                              {...register('appointmentReason')}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              placeholder="Please describe why the client is seeking nutrition consultation"
                              rows={4}
                            />
                            {errors.appointmentReason && (
                              <p className="client-form-error">
                                {errors.appointmentReason.message}
                              </p>
                            )}
                          </div>
                          <div className="form-field">
                            <div className="flex items-center mb-1">
                              <label
                                htmlFor="expectations"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Expectations
                                <RequiredFieldIndicator />
                              </label>
                            </div>
                            <textarea
                              id="expectations"
                              {...register('expectations')}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              placeholder="What does the client expect to achieve from this consultation?"
                              rows={4}
                            />
                            {errors.expectations && (
                              <p className="client-form-error">{errors.expectations.message}</p>
                            )}
                          </div>
                          <div className="form-field">
                            <div className="flex items-center mb-1">
                              <label
                                htmlFor="clinicalObjective"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Clinical Objective
                                <RequiredFieldIndicator />
                              </label>
                            </div>
                            <textarea
                              id="clinicalObjective"
                              {...register('clinicalObjective')}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              placeholder="What are the specific clinical objectives for this client?"
                              rows={4}
                            />
                            {errors.clinicalObjective && (
                              <p className="client-form-error">
                                {errors.clinicalObjective.message}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Personal & Social History */}
                    <div className="client-form-section">
                      <button
                        type="button"
                        className="client-form-section-header"
                        onClick={() => toggleSection('2')}
                        aria-expanded={isSectionExpanded('2')}
                      >
                        <div className="client-form-section-title-container">
                          <div className="client-form-section-number">
                            <span className="client-form-section-number-text">3</span>
                          </div>
                          <h4 className="client-form-section-title">Personal & Social History</h4>
                        </div>
                        <div className="client-form-section-toggle">
                          {isSectionExpanded('2') ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </div>
                      </button>

                      {isSectionExpanded('2') && (
                        <div className="client-form-section-content">
                          <div className="client-form-grid">
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="sleepQuality"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Sleep Quality
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <select
                                id="sleepQuality"
                                {...register('sleepQuality')}
                                className="client-form-input"
                              >
                                <option value="">Select sleep quality</option>
                                <option value="poor">Poor</option>
                                <option value="fair">Fair</option>
                                <option value="good">Good</option>
                                <option value="excellent">Excellent</option>
                              </select>
                              {errors.sleepQuality && (
                                <p className="client-form-error">{errors.sleepQuality.message}</p>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="smokingStatus"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Smoking Status
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <select
                                id="smokingStatus"
                                {...register('smokingStatus')}
                                className="client-form-input"
                              >
                                <option value="">Select smoking status</option>
                                <option value="never">Never</option>
                                <option value="former">Former</option>
                                <option value="current">Current</option>
                              </select>
                              {errors.smokingStatus && (
                                <p className="client-form-error">{errors.smokingStatus.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="client-form-grid">
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="alcoholConsumption"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Alcohol Consumption
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <select
                                id="alcoholConsumption"
                                {...register('alcoholConsumption')}
                                className="client-form-input"
                              >
                                <option value="">Select alcohol consumption</option>
                                <option value="none">None</option>
                                <option value="occasional">Occasional</option>
                                <option value="regular">Regular</option>
                              </select>
                              {errors.alcoholConsumption && (
                                <p className="client-form-error">
                                  {errors.alcoholConsumption.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Marital Status
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <select
                                id="maritalStatus"
                                {...register('maritalStatus')}
                                className="client-form-input"
                              >
                                <option value="">Select marital status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                                <option value="widowed">Widowed</option>
                              </select>
                              {errors.maritalStatus && (
                                <p className="client-form-error">{errors.maritalStatus.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="form-field">
                            <div className="flex items-center mb-1">
                              <label
                                htmlFor="intestinalFunction"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Intestinal Function
                                <RequiredFieldIndicator />
                              </label>
                            </div>
                            <textarea
                              id="intestinalFunction"
                              {...register('intestinalFunction')}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              placeholder="Describe the client's intestinal function and any issues"
                              rows={4}
                            />
                            {errors.intestinalFunction && (
                              <p className="client-form-error">
                                {errors.intestinalFunction.message}
                              </p>
                            )}
                          </div>
                          <div className="form-field">
                            <div className="flex items-center mb-1">
                              <label
                                htmlFor="physicalActivity"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Physical Activity
                                <RequiredFieldIndicator />
                              </label>
                            </div>
                            <textarea
                              id="physicalActivity"
                              {...register('physicalActivity')}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              placeholder="Describe the client's physical activity routine"
                              rows={4}
                            />
                            {errors.physicalActivity && (
                              <p className="client-form-error">{errors.physicalActivity.message}</p>
                            )}
                          </div>

                          {/* Lifestyle & Activity Options */}
                          <div className="client-form-grid-3">
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="activityLevel"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Activity Level
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <select
                                id="activityLevel"
                                {...register('activityLevel')}
                                className="client-form-input"
                              >
                                <option value="">Select activity level</option>
                                <option value="sedentary">Sedentary</option>
                                <option value="lightly_active">Lightly Active</option>
                                <option value="moderately_active">Moderately Active</option>
                                <option value="very_active">Very Active</option>
                              </select>
                              {errors.activityLevel && (
                                <p className="client-form-error">{errors.activityLevel.message}</p>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="occupationType"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Occupation Type
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <select
                                id="occupationType"
                                {...register('occupationType')}
                                className="client-form-input"
                              >
                                <option value="">Select occupation type</option>
                                <option value="sedentary">Sedentary</option>
                                <option value="standing">Standing</option>
                                <option value="physical_labor">Physical Labor</option>
                              </select>
                              {errors.occupationType && (
                                <p className="client-form-error">{errors.occupationType.message}</p>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="exerciseRoutine"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Exercise Routine
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <select
                                id="exerciseRoutine"
                                {...register('exerciseRoutine')}
                                className="client-form-input"
                              >
                                <option value="">Select exercise routine</option>
                                <option value="none">None</option>
                                <option value="light">Light</option>
                                <option value="moderate">Moderate</option>
                                <option value="intense">Intense</option>
                              </select>
                              {errors.exerciseRoutine && (
                                <p className="client-form-error">
                                  {errors.exerciseRoutine.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="client-form-grid">
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="wakeUpTime"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Wake Up Time
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <input
                                type="time"
                                id="wakeUpTime"
                                {...register('wakeUpTime')}
                                className="client-form-input"
                              />
                              {errors.wakeUpTime && (
                                <p className="client-form-error">{errors.wakeUpTime.message}</p>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="bedTime"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Bed Time
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <input
                                type="time"
                                id="bedTime"
                                {...register('bedTime')}
                                className="client-form-input"
                              />
                              {errors.bedTime && (
                                <p className="client-form-error">{errors.bedTime.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dietary Information */}
                    <div className="client-form-section">
                      <button
                        type="button"
                        className="client-form-section-header"
                        onClick={() => toggleSection('3')}
                        aria-expanded={isSectionExpanded('3')}
                      >
                        <div className="client-form-section-title-container">
                          <div className="client-form-section-number">
                            <span className="client-form-section-number-text">4</span>
                          </div>
                          <h4 className="client-form-section-title">Dietary Information</h4>
                        </div>
                        <div className="client-form-section-toggle">
                          {isSectionExpanded('3') ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </div>
                      </button>

                      {isSectionExpanded('3') && (
                        <div className="client-form-section-content">
                          <div className="form-field">
                            <ArrayInput<ClientFormData>
                              label="Food Preferences"
                              name="foodPreferences"
                              setValue={setValue}
                              error={errors.foodPreferences}
                              placeholder="Add food preferences"
                            />
                          </div>
                          <div className="form-field">
                            <ArrayInput<ClientFormData>
                              label="Food Allergies"
                              name="foodAllergies"
                              setValue={setValue}
                              error={errors.foodAllergies}
                              placeholder="Add food allergies"
                            />
                          </div>
                          <div className="form-field">
                            <ArrayInput<ClientFormData>
                              label="Food Intolerances"
                              name="foodIntolerances"
                              setValue={setValue}
                              error={errors.foodIntolerances}
                              placeholder="Add food intolerances"
                            />
                          </div>
                          <div className="form-field">
                            <div className="flex items-center mb-1">
                              <label
                                htmlFor="waterIntake"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Daily Water Intake (Liters)
                                <RequiredFieldIndicator />
                              </label>
                            </div>
                            <input
                              type="number"
                              id="waterIntake"
                              {...register('hydration.dailyWaterIntake')}
                              className="client-form-input"
                              step="0.1"
                            />
                            {errors.hydration?.dailyWaterIntake && (
                              <p className="client-form-error">
                                {errors.hydration.dailyWaterIntake.message}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Health & Body Metrics Section */}
                {Number.parseInt(currentSection) === 1 && (
                  <div className="form-section">
                    <div className="form-header">
                      <h3 className="form-header-title">Health & Body Metrics</h3>
                      <p className="form-header-description">
                        Enter the client&apos;s body measurements and health metrics
                      </p>
                    </div>

                    {/* Anthropometric Measurements */}
                    <div className="client-form-section">
                      <button
                        type="button"
                        className="client-form-section-header"
                        onClick={() => toggleSection('4')}
                        aria-expanded={isSectionExpanded('4')}
                      >
                        <div className="client-form-section-title-container">
                          <div className="client-form-section-number">
                            <span className="client-form-section-number-text">1</span>
                          </div>
                          <h4 className="client-form-section-title">Anthropometric Measurements</h4>
                        </div>
                        <div className="client-form-section-toggle">
                          {isSectionExpanded('4') ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </div>
                      </button>

                      {isSectionExpanded('4') && (
                        <div className="client-form-section-content">
                          <div className="client-form-grid">
                            <div>
                              <MeasurementInput
                                label="Height"
                                name="height"
                                register={register}
                                error={errors.height}
                                required
                                placeholder="Enter client's standing height"
                                units={[
                                  { value: 'cm', label: 'cm' },
                                  { value: 'in', label: 'in' },
                                ]}
                              />
                            </div>
                            <div>
                              <MeasurementInput
                                label="Weight"
                                name="weight"
                                register={register}
                                error={errors.weight}
                                required
                                placeholder="Enter client's current weight"
                                units={[
                                  { value: 'kg', label: 'kg' },
                                  { value: 'lbs', label: 'lbs' },
                                ]}
                              />
                            </div>
                          </div>
                          <div className="client-form-grid">
                            <div>
                              <MeasurementInput
                                label="Abdominal Circumference"
                                name="abdominalCircumference"
                                register={register}
                                error={errors.abdominalCircumference}
                                placeholder="Measure around the belly button"
                                units={[
                                  { value: 'cm', label: 'cm' },
                                  { value: 'in', label: 'in' },
                                ]}
                              />
                            </div>
                            <div>
                              <MeasurementInput
                                label="Waist Circumference"
                                name="waistCircumference"
                                register={register}
                                error={errors.waistCircumference}
                                placeholder="Measure at the narrowest part"
                                units={[
                                  { value: 'cm', label: 'cm' },
                                  { value: 'in', label: 'in' },
                                ]}
                              />
                            </div>
                          </div>
                          <div className="client-form-grid">
                            <div>
                              <MeasurementInput
                                label="Chest Circumference"
                                name="chestCircumference"
                                register={register}
                                error={errors.chestCircumference}
                                placeholder="Measure at nipple level"
                                units={[
                                  { value: 'cm', label: 'cm' },
                                  { value: 'in', label: 'in' },
                                ]}
                              />
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="bmi"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  BMI
                                </label>
                              </div>
                              <input
                                type="number"
                                id="bmi"
                                {...register('bmi')}
                                className="client-form-input"
                                placeholder="Body Mass Index"
                                step="0.1"
                                min="10"
                                max="50"
                              />
                              {errors.bmi && (
                                <p className="client-form-error">{errors.bmi.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Analytical Data */}
                    <div className="client-form-section">
                      <button
                        type="button"
                        className="client-form-section-header"
                        onClick={() => toggleSection('5')}
                        aria-expanded={isSectionExpanded('5')}
                      >
                        <div className="client-form-section-title-container">
                          <div className="client-form-section-number">
                            <span className="client-form-section-number-text">2</span>
                          </div>
                          <h4 className="client-form-section-title">Analytical Data</h4>
                        </div>
                        <div className="client-form-section-toggle">
                          {isSectionExpanded('5') ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </div>
                      </button>

                      {isSectionExpanded('5') && (
                        <div className="client-form-section-content">
                          <div className="client-form-grid">
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="hdlCholesterol"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  HDL Cholesterol (mg/dL)
                                </label>
                              </div>
                              <input
                                type="number"
                                id="hdlCholesterol"
                                {...register('hdlCholesterol')}
                                className="client-form-input"
                                step="0.1"
                              />
                              {errors.hdlCholesterol && (
                                <p className="client-form-error">{errors.hdlCholesterol.message}</p>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="ldlCholesterol"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  LDL Cholesterol (mg/dL)
                                </label>
                              </div>
                              <input
                                type="number"
                                id="ldlCholesterol"
                                {...register('ldlCholesterol')}
                                className="client-form-input"
                                step="0.1"
                              />
                              {errors.ldlCholesterol && (
                                <p className="client-form-error">{errors.ldlCholesterol.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="client-form-grid">
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="totalCholesterol"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Total Cholesterol (mg/dL)
                                </label>
                              </div>
                              <input
                                type="number"
                                id="totalCholesterol"
                                {...register('totalCholesterol')}
                                className="client-form-input"
                                step="0.1"
                              />
                              {errors.totalCholesterol && (
                                <p className="client-form-error">
                                  {errors.totalCholesterol.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="triglycerides"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Triglycerides (mg/dL)
                                </label>
                              </div>
                              <input
                                type="number"
                                id="triglycerides"
                                {...register('triglycerides')}
                                className="client-form-input"
                                step="0.1"
                              />
                              {errors.triglycerides && (
                                <p className="client-form-error">{errors.triglycerides.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Body Composition */}
                    <div className="client-form-section">
                      <button
                        type="button"
                        className="client-form-section-header"
                        onClick={() => toggleSection('6')}
                        aria-expanded={isSectionExpanded('6')}
                      >
                        <div className="client-form-section-title-container">
                          <div className="client-form-section-number">
                            <span className="client-form-section-number-text">3</span>
                          </div>
                          <h4 className="client-form-section-title">Body Composition</h4>
                        </div>
                        <div className="client-form-section-toggle">
                          {isSectionExpanded('6') ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </div>
                      </button>

                      {isSectionExpanded('6') && (
                        <div className="client-form-section-content">
                          <div className="client-form-grid">
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="visceralFat"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Visceral Fat
                                </label>
                              </div>
                              <input
                                type="number"
                                id="visceralFat"
                                {...register('visceralFat')}
                                className="client-form-input"
                                step="0.1"
                              />
                              {errors.visceralFat && (
                                <p className="client-form-error">{errors.visceralFat.message}</p>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="muscleMass"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Muscle Mass (kg)
                                </label>
                              </div>
                              <input
                                type="number"
                                id="muscleMass"
                                {...register('muscleMass')}
                                className="client-form-input"
                                step="0.1"
                              />
                              {errors.muscleMass && (
                                <p className="client-form-error">{errors.muscleMass.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="client-form-grid">
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="bodyFatPercentage"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Body Fat Percentage (%)
                                </label>
                              </div>
                              <input
                                type="number"
                                id="bodyFatPercentage"
                                {...register('bodyFatPercentage')}
                                className="client-form-input"
                                step="0.1"
                                min="0"
                                max="100"
                              />
                              {errors.bodyFatPercentage && (
                                <p className="client-form-error">
                                  {errors.bodyFatPercentage.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="muscleMassPercentage"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Muscle Mass Percentage (%)
                                </label>
                              </div>
                              <input
                                type="number"
                                id="muscleMassPercentage"
                                {...register('muscleMassPercentage')}
                                className="client-form-input"
                                step="0.1"
                                min="0"
                                max="100"
                              />
                              {errors.muscleMassPercentage && (
                                <p className="client-form-error">
                                  {errors.muscleMassPercentage.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="client-form-grid">
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="bodyWaterPercentage"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Body Water Percentage (%)
                                </label>
                              </div>
                              <input
                                type="number"
                                id="bodyWaterPercentage"
                                {...register('bodyWaterPercentage')}
                                className="client-form-input"
                                step="0.1"
                                min="0"
                                max="100"
                              />
                              {errors.bodyWaterPercentage && (
                                <p className="client-form-error">
                                  {errors.bodyWaterPercentage.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Health Goals Section */}
                {Number.parseInt(currentSection) === 2 && (
                  <div className="form-section">
                    <div className="form-header">
                      <h3 className="form-header-title">Health Goals</h3>
                      <p className="form-header-description">
                        Define the client&apos;s health and nutrition objectives
                      </p>
                    </div>

                    {/* Goals & Objectives */}
                    <div className="client-form-section">
                      <button
                        type="button"
                        className="client-form-section-header"
                        onClick={() => toggleSection('7')}
                        aria-expanded={isSectionExpanded('7')}
                      >
                        <div className="client-form-section-title-container">
                          <div className="client-form-section-number">
                            <span className="client-form-section-number-text">1</span>
                          </div>
                          <h4 className="client-form-section-title">Goals & Objectives</h4>
                        </div>
                        <div className="client-form-section-toggle">
                          {isSectionExpanded('7') ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </div>
                      </button>

                      {isSectionExpanded('7') && (
                        <div className="client-form-section-content">
                          <div className="client-form-grid">
                            <div>
                              <div className="flex items-center mb-1">
                                <label
                                  htmlFor="primaryGoal"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Primary Goal
                                  <RequiredFieldIndicator />
                                </label>
                              </div>
                              <select
                                id="primaryGoal"
                                {...register('primaryGoal')}
                                className="client-form-input"
                              >
                                <option value="">Select primary goal</option>
                                <option value="weight_loss">Weight Loss</option>
                                <option value="muscle_gain">Muscle Gain</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="health_improvement">Health Improvement</option>
                              </select>
                              {errors.primaryGoal && (
                                <p className="client-form-error">{errors.primaryGoal.message}</p>
                              )}
                            </div>
                            <div>
                              <MeasurementInput
                                label="Target Weight"
                                name="targetWeight"
                                register={register}
                                error={errors.targetWeight}
                                required
                                placeholder="Enter target weight goal"
                                units={[
                                  { value: 'kg', label: 'kg' },
                                  { value: 'lbs', label: 'lbs' },
                                ]}
                              />
                            </div>
                          </div>

                          <div className="form-field">
                            <div className="flex items-center mb-1">
                              <label
                                htmlFor="healthConcerns"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Health Concerns
                                <RequiredFieldIndicator />
                              </label>
                            </div>
                            <textarea
                              id="healthConcerns"
                              {...register('healthConcerns')}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              placeholder="List any health concerns or conditions that may affect the client's nutrition plan"
                              rows={4}
                            />
                            {errors.healthConcerns && (
                              <p className="client-form-error">{errors.healthConcerns.message}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="modal-footer">
              <div className="button-container">
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>

                {Number.parseInt(currentSection) > 0 && (
                  <button type="button" onClick={handlePrevious} className="btn-secondary">
                    Previous
                  </button>
                )}

                {Number.parseInt(currentSection) === TOTAL_SECTIONS - 1 ? (
                  <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? 'Adding...' : 'Add Client'}
                  </button>
                ) : (
                  <button type="button" onClick={handleNext} className="btn-primary">
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
