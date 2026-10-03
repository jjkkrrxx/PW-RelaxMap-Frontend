"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/Icon/Icon";
import css from "./Modal.module.css";

// на сервері false, у браузері true — без setState в ефекті
const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  const isClient = useIsClient();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    // сторінка під модалкою не скролиться
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // закриваємо лише при кліку по самому бекдропу, не по вмісту модалки
    if (event.target === event.currentTarget) onClose();
  };

  // на сервері document немає — портал рендеримо лише в браузері
  if (!isClient) return null;

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal} role="dialog" aria-modal="true">
        <button
          type="button"
          className={css.closeButton}
          onClick={onClose}
          aria-label="Закрити"
        >
          <Icon name="icon-close" size={24} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
