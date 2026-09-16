import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import FormField from '../../Components/Atoms/FormField';

// ---------------------------------------------------------------------------
// Minimal test harnesses that let us mount FormField inside a real form context
// ---------------------------------------------------------------------------

type SimpleForm = { name: string; gender: string; bio: string };

function InputHarness({
  error,
  required,
  iconPosition,
  icon,
}: {
  error?: string;
  required?: boolean;
  iconPosition?: 'start' | 'end';
  icon?: React.ReactNode;
}) {
  const { control } = useForm<SimpleForm>({ defaultValues: { name: '' } });
  return (
    <FormField
      label="Full Name"
      name="name"
      control={control}
      error={error}
      required={required}
      iconPosition={iconPosition}
      icon={icon}
    />
  );
}

function SelectHarness() {
  const { control } = useForm<SimpleForm>({ defaultValues: { gender: '' } });
  return (
    <FormField
      label="Gender"
      name="gender"
      control={control}
      fieldType="select"
      options={[
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ]}
      placeholder="Pick gender"
    />
  );
}

function TextAreaHarness({ error }: { error?: string }) {
  const { control } = useForm<SimpleForm>({ defaultValues: { bio: '' } });
  return (
    <FormField
      label="Bio"
      name="bio"
      control={control}
      fieldType="textarea"
      error={error}
      rows={3}
    />
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('FormField – InputField variant', () => {
  it('renders an input with an accessible label', () => {
    render(<InputHarness />);
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  });

  it('shows a required asterisk when required prop is true', () => {
    render(<InputHarness required />);
    // The asterisk span is inside the label
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message associated with the input', () => {
    render(<InputHarness error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    // aria-invalid should be set on the input
    expect(screen.getByLabelText('Full Name')).toHaveAttribute('aria-invalid', 'true');
  });

  it('accepts user input', async () => {
    render(<InputHarness />);
    const input = screen.getByLabelText('Full Name');
    await userEvent.type(input, 'Alice Dev');
    expect(input).toHaveValue('Alice Dev');
  });

  it('renders a start icon when iconPosition is start', () => {
    render(<InputHarness icon={<span>🔍</span>} iconPosition="start" />);
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('renders an end icon when iconPosition is end', () => {
    render(<InputHarness icon={<span>👁</span>} iconPosition="end" />);
    expect(screen.getByText('👁')).toBeInTheDocument();
  });
});

describe('FormField – SingleSelect variant', () => {
  it('renders a select with accessible label and placeholder', () => {
    render(<SelectHarness />);
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Pick gender')).toBeInTheDocument();
  });

  it('changes value when user selects an option', async () => {
    render(<SelectHarness />);
    await userEvent.selectOptions(screen.getByRole('combobox'), 'male');
    expect(screen.getByRole<HTMLSelectElement>('combobox').value).toBe('male');
  });
});

describe('FormField – TextArea variant', () => {
  it('renders a textarea with accessible label', () => {
    render(<TextAreaHarness />);
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('accepts multi-line input', async () => {
    render(<TextAreaHarness />);
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'Line one');
    expect(textarea).toHaveValue('Line one');
  });

  it('displays error and sets aria-invalid on textarea', () => {
    render(<TextAreaHarness error="Bio is required" />);
    expect(screen.getByText('Bio is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});
