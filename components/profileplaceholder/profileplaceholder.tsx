import Link from "next/link";
import styles from "./profileplaceholder.module.css";

type ProfilePlaceholderProps =
  | { isOwner: true; shareLocationHref: string; isDisabled?: boolean }
  | { isOwner: false; locationsHref: string; isDisabled?: boolean };

export default function ProfilePlaceholder(props: ProfilePlaceholderProps) {
  const isOwner = props.isOwner;
  const message = isOwner
    ? "Ви ще нічого не публікували, поділіться своєю першою локацією!"
    : "Цей користувач ще не ділився локаціями";
  const linkText = isOwner ? "Поділитись локацією" : "Назад до локацій";
  const href = isOwner ? props.shareLocationHref : props.locationsHref;
  const isLinkDisabled = props.isDisabled === true;
  const variantClassName = isOwner ? styles.shareLink : styles.backLink;
  const disabledClassName = isLinkDisabled
    ? isOwner
      ? styles.shareLinkDisabled
      : styles.backLinkDisabled
    : "";
  const linkClassName = `${styles.link} ${variantClassName} ${disabledClassName}`;

  return (
    <section
      className={`${styles.placeholder} ${
        isOwner ? styles.ownerPlaceholder : styles.publicPlaceholder
      }`}
      aria-label="Порожній профіль"
    >
      <p className={isOwner ? styles.message : styles.publicMessage}>
        {message}
      </p>
      <Link
        className={linkClassName}
        href={href}
        aria-disabled={isLinkDisabled || undefined}
        tabIndex={isLinkDisabled ? -1 : undefined}
        onClick={isLinkDisabled ? (event) => event.preventDefault() : undefined}
      >
        {linkText}
      </Link>
    </section>
  );
}
