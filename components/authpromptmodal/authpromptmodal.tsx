"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import Modal from "@/components/Modal/Modal";
import css from "./authpromptmodal.module.css";

interface Props {
  // куди повернутися після закриття і після входу; за замовчуванням — головна
  returnTo?: string;
}

export default function AuthPromptModal({ returnTo = "/" }: Props) {
  const router = useRouter();
  const isClosing = useRef(false);

  // replace, а не back: при прямому заході за адресою back вивів би із сайту
  const close = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;
    router.replace(returnTo, { scroll: false });
  }, [router, returnTo]);

  // після входу чи реєстрації — назад туди, звідки прийшли
  const from = `?from=${encodeURIComponent(returnTo)}`;

  return (
    <Modal onClose={close}>
      <div className={css.header}>
        <h2 className={css.title}>Потрібна авторизація</h2>
        <p className={css.text}>
          Щоб виконати цю дію, будь ласка, увійдіть у свій акаунт або
          зареєструйтесь.
        </p>
      </div>

      <div className={css.actions}>
        <Link href={`/login${from}`} className={css.secondaryButton}>
          Увійти
        </Link>
        <Link href={`/register${from}`} className={css.accentButton}>
          Зареєструватися
        </Link>
      </div>
    </Modal>
  );
}
