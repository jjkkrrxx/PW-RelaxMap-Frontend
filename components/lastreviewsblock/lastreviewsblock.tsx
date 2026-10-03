"use client";

import { useQuery } from "@tanstack/react-query";
import { getLastReviews } from "@/components/utils/feedbacks";
import ReviewsBlock from "@/components/reviewsblock/reviewsblock";
import Loader from "@/components/loader/loader";
import styles from "./lastreviewsblock.module.css";

// Секція «Останні відгуки» на головній сторінці (учасник №12).
export default function LastReviewsBlock() {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["last-reviews"],
    queryFn: getLastReviews,
  });

  if (!isLoading && reviews.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Останні відгуки</h2>
        {isLoading ? (
          <Loader />
        ) : (
          <ReviewsBlock reviews={reviews} showLocation />
        )}
      </div>
    </section>
  );
}
