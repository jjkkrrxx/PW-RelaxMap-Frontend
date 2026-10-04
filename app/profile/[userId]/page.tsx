import { notFound } from "next/navigation";
import ProfileInfo from "@/components/profileinfo/profileinfo";
import ProfilePlaceholder from "@/components/profileplaceholder/profileplaceholder";
import ProfileLocations from "@/components/profilelocations/profilelocations";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error("BACKEND_URL не налаштовано в .env.local");
  }

  const userRes = await fetch(`${backendUrl}/api/users/${userId}`, {
    cache: "no-store",
  });

  if (!userRes.ok) {
    notFound();
  }

  const userJson = await userRes.json();
  const user = userJson.data;

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

        {user.articlesAmount === 0 ? (
          <ProfilePlaceholder userId={userId} />
        ) : (
          <ProfileLocations userId={userId} />
        )}
      </section>
    </main>
  );
}
