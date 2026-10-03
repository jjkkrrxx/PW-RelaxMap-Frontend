"use client";

import Image from "next/image";
import { useState } from "react";
import type { UserProfile } from "@/types/user";
import styles from "./profileinfo.module.css";

type ProfileInfoProps = {
  user: UserProfile;
  variant?: "owner" | "public";
};

export default function ProfileInfo({
  user,
  variant = "owner",
}: ProfileInfoProps) {
  const { name, avatar, articlesAmount } = user;
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  const avatarSrc = avatar && avatar !== failedAvatar ? avatar : null;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`${styles.profileInfo} ${
        variant === "public"
          ? styles.publicProfileInfo
          : styles.ownerProfileInfo
      }`}
    >
      {avatarSrc ? (
        <Image
          className={styles.avatar}
          src={avatarSrc}
          alt={`Аватар користувача ${name}`}
          width={145}
          height={145}
          onError={() => setFailedAvatar(avatarSrc)}
        />
      ) : (
        <div
          className={`${styles.avatar} ${styles.avatarPlaceholder}`}
          role="img"
          aria-label={`Аватар користувача ${name}`}
        >
          {initial}
        </div>
      )}

      <div className={styles.details}>
        <p className={styles.name}>{name}</p>
        <p className={styles.articlesAmount}>Статей: {articlesAmount}</p>
      </div>
    </div>
  );
}
