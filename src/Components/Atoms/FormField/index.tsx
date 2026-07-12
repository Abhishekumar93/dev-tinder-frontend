import type {
  FormFieldProps,
  InputFieldProps,
} from '../../../interfacesAndTypes';
import { Controller, type FieldValues } from 'react-hook-form';
import SingleSelect from '../SingleSelect';
import TextArea from '../TextArea';
import InputField from '../InputField';

const FormField = <T extends FieldValues>({
  fieldType = 'input',
  label,
  name,
  control,
  error,
  icon,
  iconPosition = 'start',
  required,
  rules,
  ...controlProps
}: FormFieldProps<T>) => {
  const inputId = name ?? label.toLowerCase().replace(/\s+/g, '-');
  const hasIcon = Boolean(icon);

  const getFieldBasedOnType = (sharedProps: InputFieldProps<T>) => {
    if (fieldType === 'select') {
      return <SingleSelect {...sharedProps} />;
    }
    if (fieldType === 'textarea') {
      return <TextArea {...sharedProps} />;
    }

    return <InputField {...sharedProps} />;
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        const sharedProps = {
          field,
          inputId,
          label,
          name,
          control,
          error,
          ...controlProps,
        };

        return (
          <div className="fieldset">
            <label className="fieldset-legend justify-start" htmlFor={inputId}>
              {label}{' '}
              {required ? (
                <span className="text-red-600 text-xl">*</span>
              ) : null}
            </label>
            <div className="relative flex items-center">
              {hasIcon && iconPosition === 'start' && (
                <div className="absolute left-2 z-10">{icon}</div>
              )}
              {getFieldBasedOnType(sharedProps)}
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
        );
      }}
    />
  );
};

export default FormField;
