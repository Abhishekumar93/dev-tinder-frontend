import type { InputFieldProps } from '../../../interfacesAndTypes';
import { Controller, type FieldValues } from 'react-hook-form';

const SingleSelect = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  icon,
  iconPosition = 'start',
  options = [],
}: InputFieldProps<T>) => {
  const inputId = name ?? label.toLowerCase().replace(/\s+/g, '-');
  const hasIcon = Boolean(icon);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="fieldset">
          <label className="fieldset-legend" htmlFor={inputId}>
            {label}
          </label>
          <div className="relative flex items-center">
            {hasIcon && iconPosition === 'start' && (
              <div className="absolute left-2 z-10">{icon}</div>
            )}
            <select
              id={inputId}
              className={`select w-full ${error ? 'select-error' : ''}`}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${inputId}-error` : undefined}
              {...field}
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasIcon && iconPosition === 'end' && (
              <div className="absolute right-2 z-10">{icon}</div>
            )}
          </div>
          {error ? (
            <p id={`${inputId}-error`} className="label text-error">
              {error}
            </p>
          ) : null}
        </div>
      )}
    />
  );
};

export default SingleSelect;
