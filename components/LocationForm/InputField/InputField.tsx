import type { HTMLInputTypeAttribute } from 'react';
import { ErrorMessage, useField } from 'formik';
import css from './InputField.module.css';
import clsx from 'clsx';

interface InputFieldProps {
  id: string;
  placeholder: string;
  name: string;
  type?: HTMLInputTypeAttribute;
  label?: string;
}

function InputField({
  id,
  placeholder,
  name,
  type = 'text',
  label,
}: InputFieldProps) {
  const [field, meta] = useField<string>(name);

  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div>
      {label && (
        <label htmlFor={id} className={css.label}>
          {label}
        </label>
      )}
      <input
        {...field}
        autoComplete="off"
        className={clsx(css.input, hasError && css.errorInput)}
        id={id}
        placeholder={placeholder}
        type={type}
        aria-invalid={hasError}
      />
      <ErrorMessage name={name} component="span" className={css.error} />
    </div>
  );
}

export default InputField;
