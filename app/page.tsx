import HeroBlock from '@/components/heroblock/heroblock';
import PopularLocationsBlock from '@/components/popularlocationsblock/popularlocationsblock';
import LastReviewsBlock from '@/components/lastreviewsblock/lastreviewsblock';

export default function HomePage() {
  return (
    <main>
      <HeroBlock />

      <PopularLocationsBlock />

      <LastReviewsBlock />
    </main>
  );
}
