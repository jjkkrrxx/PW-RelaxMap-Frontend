import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import LocationInfoBlock from '@/components/locationinfoblock/locationinfoblock';
import LocationGallery from '@/components/locationgallery/locationgallery';
import LocationDescription from '@/components/locationdescription/locationdescription';
import ReviewsSection from '@/components/reviewssection/reviewssection';
import type { LocationDetails } from '@/types/location-details';
import styles from './page.module.css';
import Map from '@/components/LocationForm/Map/Map';

interface Props {
  params: Promise<{ id: string }>;
}

interface LocationResponse {
  data: LocationDetails;
}

interface CategoryOption {
  slug: string;
  name: string;
}

interface CategoriesResponse {
  data: {
    regions: CategoryOption[];
    locationTypes: CategoryOption[];
  };
}

const getLocation = cache(async (id: string): Promise<LocationDetails> => {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    throw new Error('BACKEND_URL не налаштовано');
  }

  const response = await fetch(
    `${backendUrl}/api/locations/${encodeURIComponent(id)}`,
    { cache: 'no-store' }
  );

  if (response.status === 400 || response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Не вдалося завантажити локацію: HTTP ${response.status}`);
  }

  const { data: location }: LocationResponse = await response.json();

  if (!location?._id) {
    throw new Error('Backend не повернув дані локації');
  }

  return location;
});

// Категорії змінюються рідко — кешуємо на годину.
// Якщо бекенд недоступний, повертаємо null і показуємо slug (сторінка не падає).
const getCategories = cache(
  async (): Promise<CategoriesResponse['data'] | null> => {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      return null;
    }

    try {
      const response = await fetch(`${backendUrl}/api/categories`, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        return null;
      }

      const { data }: CategoriesResponse = await response.json();
      return data;
    } catch {
      return null;
    }
  }
);

const findName = (list: CategoryOption[] | undefined, slug: string) =>
  list?.find(item => item.slug === slug)?.name ?? slug;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const location = await getLocation(id);
  const title = `${location.name} | Relax Map`;
  const plainDescription = location.description
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const description =
    plainDescription.length > 160
      ? `${plainDescription.slice(0, 157).trimEnd()}...`
      : plainDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: location.image
        ? [{ url: location.image, alt: location.name }]
        : undefined,
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { id } = await params;
  const [location, categories] = await Promise.all([
    getLocation(id),
    getCategories(),
  ]);

  // назви замість slug — одразу в HTML, без мигання
  const regionName = findName(categories?.regions, location.region);
  const locationTypeName = findName(
    categories?.locationTypes,
    location.locationType
  );

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.info}>
            <LocationInfoBlock
              location={location}
              regionName={regionName}
              locationTypeName={locationTypeName}
            />
          </div>
          <div className={styles.gallery}>
            <LocationGallery image={location.image} name={location.name} />
          </div>
        </div>
        <div className={styles.description}>
          <LocationDescription description={location.description} />
        </div>
        {location.coordinates && (
          <div className={styles.map}>
            <Map id="location-map" coordinates={location.coordinates} />
          </div>
        )}
      </div>
      <ReviewsSection
        reviews={location.feedbacksId}
        addReviewHref={`/locations/${id}/review`}
      />
    </main>
  );
}
