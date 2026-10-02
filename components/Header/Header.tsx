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

// у Figma залогінений бачить і «Головна»
const AUTH_LINKS = [
  { href: "/", label: "Головна" },
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
  const isSignedIn = isHydrated && isAuthenticated && user !== null;
  const isGuest = isHydrated && !isAuthenticated;

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

  const openLogout = () => {
    closeMenu();
    setIsLogoutOpen(true);
  };

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

  const renderGuestButtons = (extraClass = "") => (
    <>
      <Link
        href="/login"
        className={`${css.secondaryButton} ${extraClass}`}
        onClick={closeMenu}
      >
        Вхід
      </Link>
      <Link
        href="/register"
        className={`${css.accentButton} ${extraClass}`}
        onClick={closeMenu}
      >
        Реєстрація
      </Link>
    </>
  );

  const renderShareButton = (extraClass = "") => (
    <Link
      href="/locations/add"
      className={`${css.accentButton} ${extraClass}`}
      onClick={closeMenu}
    >
      Поділитись локацією
    </Link>
  );

  // аватар, ім'я, роздільник, іконка виходу
  const renderProfile = () =>
    user && (
      <div className={css.profile}>
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
    );

  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link href="/" className={css.logo} onClick={closeMenu}>
          <Icon name="icon-map_search" size={24} />
          <span>Relax Map</span>
        </Link>

        <div className={css.right}>
          {/* desktop: посилання + кнопки */}
          <nav className={css.nav} aria-label="Основна навігація">
            {renderLinks()}
          </nav>

          <div className={css.actions}>
            {!isHydrated && <div className={css.actionsPlaceholder} />}
            {isGuest && renderGuestButtons()}
            {isSignedIn && (
              <>
                {renderShareButton()}
                {renderProfile()}
              </>
            )}
          </div>

          {/* tablet: кнопки поруч із бургером */}
          <div className={css.tabletActions}>
            {isGuest && renderGuestButtons()}
            {isSignedIn && renderShareButton()}
          </div>

          {/* одна кнопка: бургер ↔ хрестик */}
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
      </div>

      {/* меню під шапкою; завжди в DOM — показ і приховування анімує клас open */}
      <div
        className={`${css.menu} ${isMenuOpen ? css.open : ""}`}
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <nav className={css.menuNav} aria-label="Мобільна навігація">
          {renderLinks()}
        </nav>

        <div className={css.menuActions}>
          {/* на планшеті ці кнопки вже є в шапці — у меню лише на мобільному */}
          {isGuest && renderGuestButtons(css.mobileOnly)}
          {isSignedIn && (
            <>
              {renderShareButton(css.mobileOnly)}
              {renderProfile()}
            </>
          )}
        </div>
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
