import type { InputFieldProps } from '../../../interfacesAndTypes';
import type { FieldValues } from 'react-hook-form';

const TextArea = <T extends FieldValues>({
  field,
  inputId,
  placeholder,
  error,
  rows = 4,
}: InputFieldProps<T>) => (
  <textarea
    id={inputId}
    rows={rows}
    className={`textarea w-full ${error ? 'textarea-error' : ''}`}
    placeholder={placeholder}
    aria-invalid={Boolean(error)}
    aria-describedby={error ? `${inputId}-error` : undefined}
    {...field}
  />
);

export default TextArea;
