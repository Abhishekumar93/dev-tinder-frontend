import type { InputFieldProps } from '../../../interfacesAndTypes';
import type { FieldValues } from 'react-hook-form';

const SingleSelect = <T extends FieldValues>({
  field,
  inputId,
  error,
  placeholder,
  options = [],
}: InputFieldProps<T>) => (
  <select
    id={inputId}
    className={`select w-full cursor-pointer ${error ? 'select-error' : ''}`}
    aria-invalid={Boolean(error)}
    aria-describedby={error ? `${inputId}-error` : undefined}
    {...field}
  >
    <option value="">{placeholder || 'Select an option'}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default SingleSelect;
