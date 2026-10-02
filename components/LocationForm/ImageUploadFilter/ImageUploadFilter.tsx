'use client';

import { ErrorMessage, useField } from 'formik';
import css from './ImageUploadField.module.css';
import Image from 'next/image';
import placeholder from '../../types/placeholder.png';
import { useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import clsx from 'clsx';

interface ImageUploadFieldProps {
  id: string;
  name: string;
  label?: string;
}

function ImageUploadField({ id, name, label }: ImageUploadFieldProps) {
  const [field, meta, helpers] = useField<File | string | null>(name);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<null | string>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] || null;

    if (!file) return;

    helpers.setValue(file);
    helpers.setTouched(true, false);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const imageSrc =
    typeof field.value === 'string'
      ? field.value
      : preview && field.value
        ? preview
        : placeholder;
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <>
      {label && (
        <label htmlFor={id} className={css.label}>
          {label}
        </label>
      )}
      <input
        ref={fileInputRef}
        className={css.input}
        id={id}
        name={name}
        type="file"
        accept="image/png,image/jpeg"
        hidden
        onChange={handleChange}
      />
      <label
        htmlFor={id}
        className={clsx(css.uploadArea, hasError && css.errorBorder)}
      >
        <Image
          className={css.image}
          src={imageSrc}
          width={1000}
          height={700}
          alt="Попередній перегляд зображення"
        />
      </label>
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        secondary
        short
        className={clsx(hasError && css.errorBorder)}
      >
        Завантажити фото
      </Button>
      <ErrorMessage name={name} component="span" className={css.error} />
    </>
  );
}

export default ImageUploadField;
