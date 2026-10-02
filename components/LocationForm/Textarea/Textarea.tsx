import { ErrorMessage, Field, useField } from 'formik';
import css from './Textarea.module.css';
import clsx from 'clsx';

interface TextareaProps {
  id: string;
  placeholder: string;
  name: string;
  label?: string;
}

function Textarea({ id, placeholder, name, label }: TextareaProps) {
  const [, meta] = useField<string>(name);

  const hasError = Boolean(meta.touched && meta.error);

  return (
    <>
      {label && (
        <label htmlFor={id} className={css.label}>
          {label}
        </label>
      )}
      <Field
        as="textarea"
        name={name}
        id={id}
        placeholder={placeholder}
        className={clsx(css.textarea, hasError && css.errorTextarea)}
        aria-invalid={hasError}
      />
      <ErrorMessage component="span" className={css.error} name={name} />
    </>
  );
}

export default Textarea;
