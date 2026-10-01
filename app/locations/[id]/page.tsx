'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { notFound } from 'next/navigation';
import Loading from '@/app/loading';
import LocationInfoBlock from '@/components/locationinfoblock/locationinfoblock';
import LocationGallery from '@/components/locationgallery/locationgallery';
import LocationDescription from '@/components/locationdescription/locationdescription';
import { apiClient } from '@/components/utils/api-client';
import type { LocationDetails } from '@/types/location-details';
import styles from './page.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

interface LocationResponse {
  data: LocationDetails | null;
}

async function getLocation(id: string): Promise<LocationDetails | null> {
  try {
    const response = await apiClient.get<LocationResponse>(
      `/locations/${encodeURIComponent(id)}`
    );

    return response.data.data ?? null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export default function LocationPage({ params }: Props) {
  const { id } = use(params);
  const { data: location, isPending, isFetching, isError, error } = useQuery({
    queryKey: ['location', id],
    queryFn: () => getLocation(id),
  });

  if (isPending || (isFetching && !location)) {
    return <Loading />;
  }

  if (isError && !isFetching) {
    throw error;
  }

  if (!location?._id) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.info}>
            <LocationInfoBlock location={location} />
          </div>
          <div className={styles.gallery}>
            <LocationGallery image={location.image} name={location.name} />
          </div>
        </div>
        <div className={styles.description}>
          <LocationDescription description={location.description} />
        </div>
      </div>
    </main>
  );
}
