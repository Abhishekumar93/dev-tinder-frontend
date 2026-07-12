import type { InputFieldProps } from '../../../interfacesAndTypes';
import { Controller, type FieldValues } from 'react-hook-form';

const TextArea = <T extends FieldValues>({
  label,
  placeholder,
  name,
  control,
  error,
  icon,
  iconPosition = 'start',
  rows = 4,
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
            <textarea
              id={inputId}
              rows={rows}
              className={`textarea w-full ${error ? 'textarea-error' : ''}`}
              placeholder={placeholder}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${inputId}-error` : undefined}
              {...field}
            />
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

export default TextArea;
