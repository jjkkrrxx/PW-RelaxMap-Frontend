"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/Modal/Modal";
import css from "./ConfirmationModal.module.css";

interface ConfirmationModalProps {
  title: string;
  subtitle?: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  title,
  subtitle,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      // помилка → toast, модалка лишається відкритою
      const message =
        error instanceof Error
          ? error.message
          : "Щось пішло не так. Спробуйте ще раз";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // поки йде запит, модалку не закриваємо
  const handleClose = () => {
    if (!isLoading) onCancel();
  };

  return (
    <Modal onClose={handleClose}>
      <div className={css.header}>
        <h2 className={css.title}>{title}</h2>
        {subtitle && <p className={css.subtitle}>{subtitle}</p>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleClose}
          disabled={isLoading}
        >
          {cancelButtonText}
        </button>
        <button
          type="button"
          className={css.confirmButton}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className={css.loader} aria-label="Завантаження" />
          ) : (
            confirmButtonText
          )}
        </button>
      </div>
    </Modal>
  );
}
