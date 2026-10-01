'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '../Button/Button';
import styles from './LoginForm.module.css';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Введіть коректну email-адресу')
    .required("Пошта є обов'язковою"),
  password: Yup.string()
    .min(6, 'Пароль має містити щонайменше 6 символів')
    .required("Пароль є обов'язковим"),
});

export const LoginForm = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Помилка авторизації');
        }

        router.push('/profile');
      } catch (error: unknown) {
        
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form} noValidate>
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
        {formik.isSubmitting ? 'Вхід...' : 'Увійти'}
      </Button>
    </form>
  );
};

export default LoginForm;
