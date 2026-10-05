"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "@/components/Modal/Modal";
import { useAuthStore } from "@/lib/store/authStore";
import {
  updateProfileAvatar,
  updateProfileName,
} from "@/components/utils/profile";
import css from "./EditProfileModal.module.css";

const DEFAULT_AVATAR =
  "https://ac.goit.global/fullstack/react/default-avatar.jpg";

// як на бекенді: jpg/png до 1 МБ
const MAX_FILE_SIZE = 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

// як на бекенді й при реєстрації: 2–32 символи
const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Ім'я має містити щонайменше 2 символи")
    .max(32, "Ім'я має містити не більше 32 символів")
    .required("Введіть ім'я"),
});

interface EditProfileModalProps {
  onClose: () => void;
}

// Додаткове завдання: модалка зміни аватара й імені (відкривається з шапки)
export default function EditProfileModal({ onClose }: EditProfileModalProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // прибираємо тимчасову адресу попереднього перегляду
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!user) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFileError("Дозволені лише зображення jpg або png");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFileError("Розмір файлу — до 1 МБ");
      return;
    }

    setFileError(null);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      let updated = user;

      if (file) {
        updated = await updateProfileAvatar(file);
      }

      const name = values.name.trim();
      if (name !== user.name) {
        updated = await updateProfileName(name);
      }

      // шапка оновиться одразу, сторінка профілю — після refresh
      setUser(updated);
      toast.success("Профіль оновлено");
      router.refresh();
      onClose();
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Не вдалося оновити профіль")
        : "Не вдалося оновити профіль";
      toast.error(message);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className={css.title}>Редагування профілю</h2>

      <Formik
        initialValues={{ name: user.name }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, dirty }) => (
          <Form className={css.form} noValidate>
            <div className={css.avatarField}>
              <Image
                src={preview ?? (user.avatar || DEFAULT_AVATAR)}
                alt=""
                width={96}
                height={96}
                className={css.avatar}
                unoptimized={Boolean(preview)}
              />
              <input
                ref={fileInputRef}
                id="profile-avatar"
                type="file"
                accept="image/png,image/jpeg"
                hidden
                onChange={handleFileChange}
              />
              <button
                type="button"
                className={css.secondaryButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                Змінити фото
              </button>
              {fileError && (
                <p className={css.error} role="alert">
                  {fileError}
                </p>
              )}
            </div>

            <div className={css.field}>
              <label htmlFor="profile-name" className={css.label}>
                Ім&apos;я
              </label>
              <Field
                id="profile-name"
                name="name"
                type="text"
                autoComplete="name"
                className={css.input}
              />
              <ErrorMessage name="name" component="p" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.secondaryButton}
                onClick={onClose}
                disabled={isSubmitting}
              >
                Відмінити
              </button>
              <button
                type="submit"
                className={css.accentButton}
                // нічого не змінено — нічого зберігати
                disabled={isSubmitting || (!dirty && !file)}
              >
                {isSubmitting ? "Зберігаємо..." : "Зберегти"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
