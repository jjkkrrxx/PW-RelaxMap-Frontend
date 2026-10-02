'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useAuthStore } from '../providers/authStore';
import { Button } from '../Button/Button';
import styles from './RegisterForm.module.css';

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Ім\'я має містити від 2 до 32 символів')
    .max(32, 'Ім\'я має містити від 2 до 32 символів')
    .required('Ім\'я є обов\'язковим'),
  email: Yup.string()
    .max(64, 'Email має бути до 64 символів')
    .email('Введіть коректну email-адресу')
    .required('Пошта є обов\'язковою'),
  password: Yup.string()
    .min(8, 'Пароль має містити від 8 до 128 символів')
    .max(128, 'Пароль має містити від 8 до 128 символів')
    .required('Пароль є обов\'язковим'),
});

export const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 409) {
            setFieldError('email', 'Цей email вже використовується');
            return;
          }
          throw new Error(data.message || 'Помилка реєстрації');
        }

        useAuthStore.getState().setUser(data.data);
        toast.success('Реєстрація успішна!');
        
        const from = searchParams.get('from') || '/profile';
        router.push(from);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Щось пішло не так';
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form} noValidate>
      <div className={styles.fieldGroup}>
        <label htmlFor="name" className={styles.label}>Ім'я*</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Ваше ім'я"
          className={`${styles.input} ${formik.touched.name && formik.errors.name ? styles.inputError : ''}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          disabled={formik.isSubmitting}
        />
        {formik.touched.name && formik.errors.name && (
          <div className={styles.error}>{formik.errors.name}</div>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="email" className={styles.label}>Пошта*</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="hello@relaxmap.ua"
          className={`${styles.input} ${formik.touched.email && formik.errors.email ? styles.inputError : ''}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          disabled={formik.isSubmitting}
        />
        {formik.touched.email && formik.errors.email && (
          <div className={styles.error}>{formik.errors.email}</div>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="password" className={styles.label}>Пароль*</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="********"
          className={`${styles.input} ${formik.touched.password && formik.errors.password ? styles.inputError : ''}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          disabled={formik.isSubmitting}
        />
        {formik.touched.password && formik.errors.password && (
          <div className={styles.error}>{formik.errors.password}</div>
        )}
      </div>

      <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? 'Реєстрація...' : 'Зареєструватись'}
      </Button>
    </form>
  );
};

export default RegisterForm;
