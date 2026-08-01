import type { InputFieldProps } from '../../../interfacesAndTypes';
import type { FieldValues } from 'react-hook-form';

const InputField = <T extends FieldValues>({
  field,
  inputId,
  type = 'text',
  placeholder,
  error,
  min,
}: InputFieldProps<T>) => (
  <input
    id={inputId}
    type={type}
    className={`input w-full ${error ? 'input-error' : ''}`}
    placeholder={placeholder}
    aria-invalid={Boolean(error)}
    aria-describedby={error ? `${inputId}-error` : undefined}
    min={min}
    {...field}
  />
);

export default InputField;
