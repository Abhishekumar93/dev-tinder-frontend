import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
export interface FormFieldProps<T extends FieldValues> {
  type?: HTMLInputTypeAttribute;
  label: string;
  placeholder?: string;
  name: Path<T>;
  control: Control<T>;
  error?: string;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  fieldType?: 'input' | 'select' | 'textarea';
  options?: Array<{ label: string; value: string }>;
  rows?: number;
  required?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  min?: number;
}
export interface InputFieldProps<
  T extends FieldValues,
> extends FormFieldProps<T> {
  field: ControllerRenderProps<T>;
  inputId: string;
}
