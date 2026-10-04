'use client';

import { ErrorMessage, useField } from 'formik';
import css from './ImageUploadField.module.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import { compressImage } from '@/components/utils/compressImage';
import { MAX_FILE_SIZE } from '@/constants/image';

interface ImageUploadFieldProps {
  id: string;
  name: string;
  label?: string;
}

function ImageUploadField({ id, name, label }: ImageUploadFieldProps) {
  const [field, meta, helpers] = useField<File | string | null>(name);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<null | string>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (!file) return;

    try {
      setIsCompressing(true);

      let processedFile = file;

      if (file.size > MAX_FILE_SIZE) {
        processedFile = await compressImage(file);
      }

      helpers.setValue(processedFile);

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setPreview(URL.createObjectURL(processedFile));
    } catch {
      helpers.setError('Не вдалося обробити зображення');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setIsCompressing(false);
    }
  };

  const openFilePicker = () => {
    if (isCompressing) return;

    helpers.setTouched(true, false);
    fileInputRef.current?.click();
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
      : field.value && preview
        ? preview
        : '/placeholder.jpg';
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div>
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
        disabled={isCompressing}
      />
      <div onClick={openFilePicker} className={css.uploadArea}>
        <Image
          className={css.image}
          src={imageSrc}
          width={1000}
          height={700}
          alt="Попередній перегляд зображення"
        />
      </div>
      <Button
        type="button"
        onClick={openFilePicker}
        secondary
        short
        error={hasError}
        disabled={isCompressing}
        className={css.button}
      >
        {isCompressing ? (
          <>
            <span>Оптимізація</span>
            <span className={css.loader} />
          </>
        ) : (
          'Завантажити фото'
        )}
      </Button>
      <ErrorMessage name={name} component="span" className={css.error} />
    </div>
  );
}

export default ImageUploadField;
