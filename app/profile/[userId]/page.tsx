import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import ProfileInfo from "@/components/profileinfo/profileinfo";
import ProfileLocationGrid from "@/components/LocationGrid/ProfileLocationGrid";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ userId: string }>;
};

interface PublicUser {
  name: string;
  avatar: string;
  articlesAmount: number;
}

// один запит на сторінку: результат ділять generateMetadata і сам компонент
const getUser = cache(async (userId: string): Promise<PublicUser | null> => {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error("BACKEND_URL не налаштовано в .env.local");
  }

  const userRes = await fetch(
    `${backendUrl}/api/users/${encodeURIComponent(userId)}`,
    {
      cache: "no-store",
    },
  );

  if (!userRes.ok) {
    return null;
  }

  const userJson = await userRes.json();
  return userJson.data ?? null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUser(userId);

  // користувача немає — лишається заголовок за замовчуванням, сторінка віддасть 404
  if (!user) {
    return {};
  }

  const title = `${user.name} | Relax Map`;
  const description = `Профіль користувача ${user.name}: опубліковані локації для відпочинку в Україні.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;
  const user = await getUser(userId);

  if (!user) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <ProfileInfo
        name={user.name}
        avatar={user.avatar}
        articlesAmount={user.articlesAmount}
      />

      <section className={styles.locations}>
        <h2 className={styles.heading}>Локації</h2>

        <ProfileLocationGrid key={userId} userId={userId} />
      </section>
    </main>
  );
}
