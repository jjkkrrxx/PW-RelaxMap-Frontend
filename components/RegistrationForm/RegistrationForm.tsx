"use client";

import axios from "axios";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useAuthStore, type User } from "@/lib/store/authStore";
import styles from "./RegistrationForm.module.css";

type RegisterValues = {
  name: string;
  email: string;
  password: string;
};

const initialValues: RegisterValues = {
  name: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Ім’я має містити щонайменше 2 символи")
    .max(32, "Ім’я має містити не більше 32 символів")
    .required("Введіть ім’я"),

  email: Yup.string()
    .trim()
    .email("Введіть коректну електронну пошту")
    .max(64, "Пошта має містити не більше 64 символів")
    .required("Введіть електронну пошту"),

  password: Yup.string()
    .min(8, "Пароль має містити щонайменше 8 символів")
    .max(128, "Пароль має містити не більше 128 символів")
    .required("Введіть пароль"),
});

export default function RegistrationForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (values: RegisterValues) => {
    try {
      const response = await axios.post<User>(
        "/api/auth/register",
        values,
      );

      setUser(response.data);

      toast.success("Реєстрація успішна");

      router.push(`/profile/${response.data._id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Не вдалося зареєструватися";

        toast.error(message);
        return;
      }

      toast.error("Сталася невідома помилка");
    }
  };

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Реєстрація</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">
                Ім’я*
              </label>

              <input
                className={styles.input}
                id="name"
                name="name"
                type="text"
                placeholder="Ваше ім’я"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {touched.name && errors.name && (
                <p className={styles.error}>{errors.name}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Пошта*
              </label>

              <input
                className={styles.input}
                id="email"
                name="email"
                type="email"
                placeholder="hello@relaxmap.ua"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {touched.email && errors.email && (
                <p className={styles.error}>{errors.email}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Пароль*
              </label>

              <input
                className={styles.input}
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {touched.password && errors.password && (
                <p className={styles.error}>{errors.password}</p>
              )}
            </div>

            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Реєструємо..." : "Зареєструватися"}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
}