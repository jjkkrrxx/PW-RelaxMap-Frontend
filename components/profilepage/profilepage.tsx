"use client";

import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader/loader";
import ProfileInfo from "@/components/profileinfo/profileinfo";
import ProfilePlaceholder from "@/components/profileplaceholder/profileplaceholder";
import {
  getCurrentUserIdentity,
  getUserProfile,
} from "@/components/utils/users";
import styles from "./profilepage.module.css";

type ProfilePageProps = {
  userId?: string;
};

export default function ProfilePage({ userId }: ProfilePageProps) {
  const currentUserQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUserIdentity,
    retry: false,
  });

  const profileId = userId ?? currentUserQuery.data?._id;
  const profileQuery = useQuery({
    queryKey: ["user-profile", profileId],
    queryFn: () => getUserProfile(profileId as string),
    enabled: Boolean(profileId),
  });

  if (!userId && currentUserQuery.isPending) {
    return <Loader fullscreen />;
  }

  if (!userId && currentUserQuery.isError) {
    return (
      <main className={`section ${styles.page}`}>
        <p className={styles.message} role="alert">
          Не вдалося перевірити авторизацію. Спробуйте оновити сторінку.
        </p>
      </main>
    );
  }

  if (!profileId) {
    return (
      <main className={`section ${styles.page}`}>
        <p className={styles.message} role="alert">
          Увійдіть, щоб переглянути свій профіль.
        </p>
      </main>
    );
  }

  if (profileQuery.isPending) {
    return <Loader fullscreen />;
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <main className={`section ${styles.page}`}>
        <p className={styles.message} role="alert">
          Не вдалося завантажити профіль.
        </p>
      </main>
    );
  }

  const isOwner = currentUserQuery.data?._id === profileId;

  return (
    <main className={`section ${styles.page}`}>
      <div className={styles.content}>
        <ProfileInfo
          user={profileQuery.data}
          variant={userId ? "public" : "owner"}
        />
        {userId ? (
          <section className={styles.locationsSection}>
            <h2 className={styles.locationsTitle}>Локації</h2>
            {profileQuery.data.articlesAmount === 0 &&
              (isOwner ? (
                <ProfilePlaceholder
                  isOwner
                  shareLocationHref="/locations/add"
                />
              ) : (
                <ProfilePlaceholder
                  isOwner={false}
                  locationsHref="/locations"
                />
              ))}
          </section>
        ) : (
          profileQuery.data.articlesAmount === 0 && (
            <div className={styles.ownerSection}>
              <ProfilePlaceholder isOwner shareLocationHref="/locations/add" />
            </div>
          )
        )}
      </div>
    </main>
  );
}
