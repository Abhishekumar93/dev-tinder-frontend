import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';

export interface InputFieldProps<T extends FieldValues> {
  type?: HTMLInputTypeAttribute;
  label: string;
  placeholder: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
}
