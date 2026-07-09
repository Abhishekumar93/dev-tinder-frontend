import type { InputFieldProps } from '../../../interfacesAndTypes';
import { Controller, type FieldValues } from 'react-hook-form';

const InputFields = <T extends FieldValues>({
  type,
  label,
  placeholder,
  name,
  control,
  error,
  icon,
  iconPosition = 'start',
}: InputFieldProps<T>) => {
  const inputId = name ?? label.toLowerCase().replace(/\s+/g, '-');
  const hasIcon = Boolean(icon);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="fieldset">
          <label className="fieldset-legend">{label}</label>
          <div className="relative flex items-center">
            {hasIcon && iconPosition === 'start' && (
              <div className="absolute left-2">{icon}</div>
            )}
            <input
              id={inputId}
              type={type || 'text'}
              className={`input w-full ${error ? 'input-error' : ''}`}
              placeholder={placeholder}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${inputId}-error` : undefined}
              {...field}
            />
            {hasIcon && iconPosition === 'end' && (
              <div className="absolute right-2">{icon}</div>
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

export default InputFields;
