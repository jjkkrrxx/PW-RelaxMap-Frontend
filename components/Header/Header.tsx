"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useLogout } from "@/lib/hooks/useLogout";
import { Icon } from "@/components/Icon/Icon";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
import css from "./Header.module.css";

const DEFAULT_AVATAR =
  "https://ac.goit.global/fullstack/react/default-avatar.jpg";

const GUEST_LINKS = [
  { href: "/", label: "Головна" },
  { href: "/locations", label: "Місця відпочинку" },
];

const AUTH_LINKS = [
  { href: "/locations", label: "Місця відпочинку" },
  { href: "/profile", label: "Мій Профіль" },
];

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const logout = useLogout();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  // відкрите бургер-меню: сторінка не скролиться, Esc закриває
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const links = isAuthenticated ? AUTH_LINKS : GUEST_LINKS;

  const renderLogo = () => (
    <Link href="/" className={css.logo} onClick={closeMenu}>
      <Icon name="icon-map_search" size={24} className={css.logoIcon} />
      <span>Relax Map</span>
    </Link>
  );

  const renderLinks = () =>
    links.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className={`${css.link} ${pathname === href ? css.active : ""}`}
        onClick={closeMenu}
      >
        {label}
      </Link>
    ));

  const renderGuestButtons = () => (
    <>
      <Link href="/login" className={css.secondaryButton} onClick={closeMenu}>
        Вхід
      </Link>
      <Link href="/register" className={css.accentButton} onClick={closeMenu}>
        Реєстрація
      </Link>
    </>
  );

  const openLogout = () => {
    closeMenu();
    setIsLogoutOpen(true);
  };

  const renderActions = () => {
    // поки сесію не перевірено — нічого не показуємо, щоб не блимало
    if (!isHydrated) return <div className={css.actionsPlaceholder} />;

    if (isAuthenticated && user) {
      return (
        <>
          <Link
            href="/locations/add"
            className={css.accentButton}
            onClick={closeMenu}
          >
            Поділитись локацією
          </Link>
          <div className={css.userBar}>
            <Image
              src={user.avatar || DEFAULT_AVATAR}
              alt=""
              width={32}
              height={32}
              className={css.avatar}
            />
            <span className={css.userName}>{user.name}</span>
            <span className={css.divider} aria-hidden="true" />
            <button
              type="button"
              className={css.logoutButton}
              onClick={openLogout}
              aria-label="Вийти"
            >
              <Icon name="icon-logout" size={24} />
            </button>
          </div>
        </>
      );
    }

    return renderGuestButtons();
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        {renderLogo()}

        <nav className={css.nav} aria-label="Основна навігація">
          {renderLinks()}
        </nav>

        <div className={css.actions}>{renderActions()}</div>

        {/* 768px: «Вхід» і «Реєстрація» поруч із бургером (лише для гостя) */}
        {isHydrated && !isAuthenticated && (
          <div className={css.tabletActions}>{renderGuestButtons()}</div>
        )}

        {/* одна кнопка: бургер ↔ хрестик, лежить поверх відкритого меню */}
        <button
          type="button"
          className={`${css.burger} ${isMenuOpen ? css.burgerOpen : ""}`}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={isMenuOpen}
        >
          <span className={css.burgerLine} />
          <span className={css.burgerLine} />
          <span className={css.burgerLine} />
        </button>
      </div>

      {/* меню завжди в DOM — показ і приховування анімує CSS-клас open */}
      <div
        className={`${css.mobileMenu} ${isMenuOpen ? css.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        {/* праворуч тут місце для кнопки-хрестика з шапки */}
        <div className={css.mobileTop}>{renderLogo()}</div>

        <nav className={css.mobileNav} aria-label="Мобільна навігація">
          {renderLinks()}
        </nav>

        <div className={css.mobileActions}>{renderActions()}</div>
      </div>

      {isLogoutOpen && (
        <ConfirmationModal
          title="Ви точно хочете вийти?"
          subtitle="Ми будемо сумувати за вами!"
          confirmButtonText="Вийти"
          cancelButtonText="Відмінити"
          onConfirm={async () => {
            await logout();
            setIsLogoutOpen(false);
          }}
          onCancel={() => setIsLogoutOpen(false)}
        />
      )}
    </header>
  );
}
