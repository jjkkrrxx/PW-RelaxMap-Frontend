import type { ChangeEvent, FocusEvent } from "react";

import styles from "./InputField.module.css";

type InputFieldProps = {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  touched?: boolean;
  autoComplete?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
};

export default function InputField({
  label,
  id,
  name,
  type,
  placeholder,
  value,
  error,
  touched,
  autoComplete,
  onChange,
  onBlur,
}: InputFieldProps) {
  const hasError = Boolean(touched && error);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <input
        className={`${styles.input} ${hasError ? styles.inputError : ""}`}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />

      {hasError && (
        <p className={styles.error} id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}