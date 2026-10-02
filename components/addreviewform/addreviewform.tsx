'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import StarRating from '@/components/starrating/starrating';
import { createFeedback } from '@/components/utils/feedbacks';
import styles from './addreviewform.module.css';

interface Props {
  locationId: string;
  userName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// Обмеження — з ТЗ (Validation rules): rate 1–5, description 1–200.
const validationSchema = Yup.object({
  description: Yup.string()
    .trim()
    .min(1, 'Напишіть відгук')
    .max(200, 'Відгук має містити не більше 200 символів')
    .required('Напишіть відгук'),
  rate: Yup.number()
    .min(1, 'Оберіть оцінку')
    .max(5, 'Оцінка — від 1 до 5')
    .required('Оберіть оцінку'),
});

// Форма відгуку (учасник №12): оцінка 1–5 і текст.
export default function AddReviewForm({
  locationId,
  userName,
  onSuccess,
  onCancel,
}: Props) {
  const formik = useFormik({
    initialValues: { description: '', rate: 0 },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await createFeedback({
          locationId,
          userName,
          rate: values.rate,
          description: values.description.trim(),
        });
        toast.success('Відгук відправлено на модерацію');
        onSuccess();
      } catch (error) {
        // модалка лишається відкритою, поля — заповненими
        let message = 'Не вдалося надіслати відгук. Спробуйте ще раз';
        if (axios.isAxiosError(error)) {
          message =
            error.response?.status === 401
              ? 'Щоб залишити відгук, увійдіть в акаунт'
              : error.response?.data?.message || message;
        }
        toast.error(message);
      }
    },
  });

  const { errors, touched, values, isSubmitting } = formik;
  const descriptionError = touched.description && errors.description;
  const rateError = touched.rate && errors.rate;

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="review-description">
          Ваш відгук
        </label>
        <textarea
          id="review-description"
          name="description"
          className={`${styles.textarea} ${descriptionError ? styles.invalid : ''}`}
          placeholder="Напишіть ваш відгук"
          value={values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={Boolean(descriptionError)}
          aria-describedby={descriptionError ? 'review-description-error' : undefined}
        />
        {descriptionError && (
          <p id="review-description-error" className={styles.error}>
            {descriptionError}
          </p>
        )}
      </div>

      <div className={styles.rating}>
        <StarRating
          value={values.rate}
          size={32}
          editable
          onChange={(rate) => {
            formik.setFieldValue('rate', rate);
            formik.setFieldTouched('rate', true, false);
          }}
        />
        {rateError && <p className={styles.error}>{rateError}</p>}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancel}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Відмінити
        </button>
        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting ? (
            <span className={styles.loader} role="status" aria-label="Надсилання" />
          ) : (
            'Надіслати'
          )}
        </button>
      </div>
    </form>
  );
}
