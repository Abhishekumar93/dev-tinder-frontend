import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputFields } from '../Atoms';
import type { IUser, SignupForm } from '../../interfacesAndTypes';
import { signupSchema } from '../../SchemaValidation';
import { useAppStore } from '../../Store';

export const Signup = () => {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema) as never,
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: undefined,
      gender: '',
      bio: '',
      about: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = useWatch({
    control,
    name: 'password',
  });

  const passwordRequirements = [
    { label: 'Minimum 8 characters', valid: (passwordValue?.length ?? 0) >= 8 },
    {
      label: 'At least 1 uppercase letter',
      valid: /[A-Z]/.test(passwordValue ?? ''),
    },
    {
      label: 'At least 1 lowercase letter',
      valid: /[a-z]/.test(passwordValue ?? ''),
    },
    { label: 'At least 1 number', valid: /\d/.test(passwordValue ?? '') },
    {
      label: 'At least 1 symbol',
      valid: /[^A-Za-z0-9]/.test(passwordValue ?? ''),
    },
  ];

  const handleNext = async () => {
    const isStepOneValid = await trigger([
      'firstName',
      'lastName',
      'email',
      'age',
      'gender',
      'bio',
    ]);

    if (isStepOneValid) {
      setCurrentStep(2);
    }
  };

  const onSubmit: SubmitHandler<SignupForm> = (data) => {
    setUser({
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      email: data.email,
      gender: data.gender,
      about: data.about || data.bio,
    } as IUser);
    navigate('/');
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-8">
      <div className="card w-full max-w-3xl bg-base-200 shadow-md dark:bg-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-3xl mb-3">Signup</h2>
            <ul className="steps steps-horizontal gap-4">
              <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>
                Personal Information
              </li>
              <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>
                Password
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {currentStep === 1 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <InputFields
                  label="First Name"
                  placeholder="Enter your first name"
                  name="firstName"
                  control={control}
                  error={errors.firstName?.message}
                />
                <InputFields
                  label="Last Name"
                  placeholder="Enter your last name"
                  name="lastName"
                  control={control}
                  error={errors.lastName?.message}
                />
                <InputFields
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  name="email"
                  control={control}
                  error={errors.email?.message}
                />
                <InputFields
                  type="number"
                  label="Age"
                  placeholder="Enter your age"
                  name="age"
                  control={control}
                  error={errors.age?.message}
                />
                <InputFields
                  label="Gender"
                  name="gender"
                  control={control}
                  error={errors.gender?.message}
                  as="select"
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Non-binary', value: 'non-binary' },
                  ]}
                />
                <InputFields
                  label="Bio"
                  placeholder="A short bio"
                  name="bio"
                  control={control}
                  error={errors.bio?.message}
                />
                <div className="md:col-span-2">
                  <InputFields
                    label="About"
                    placeholder="Tell us a bit more about yourself"
                    name="about"
                    control={control}
                    error={errors.about?.message}
                    as="textarea"
                    rows={4}
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <InputFields
                  type="password"
                  label="Password"
                  placeholder="Create a password"
                  name="password"
                  control={control}
                  error={errors.password?.message}
                />
                <InputFields
                  type="password"
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  name="confirmPassword"
                  control={control}
                  error={errors.confirmPassword?.message}
                />
                <div className="md:col-span-2 rounded-box border border-base-300 p-4">
                  <p className="mb-2 text-sm font-medium">
                    Password requirements
                  </p>
                  <ul className="space-y-2 text-sm">
                    {passwordRequirements.map((requirement) => (
                      <li
                        key={requirement.label}
                        className={`flex items-center gap-2 ${requirement.valid ? 'text-success' : 'text-base-content/70'}`}
                      >
                        <span>{requirement.valid ? '✓' : '•'}</span>
                        <span>{requirement.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              {currentStep === 1 && (
                <button
                  type="button"
                  className={`btn-class`}
                  onClick={handleNext}
                >
                  Next
                </button>
              )}
              {currentStep === 2 && (
                <>
                  <button
                    type="button"
                    className="btn-class"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn-class">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </form>
          <div className="mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400!">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
