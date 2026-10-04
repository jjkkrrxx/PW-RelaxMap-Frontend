import HeroBlock from '@/components/heroblock/heroblock';
import PopularLocationsBlock from '@/components/popularlocationsblock/popularlocationsblock';
import LastReviewsBlock from '@/components/lastreviewsblock/lastreviewsblock';
import AdvantagesBlock from '@/components/AdvantagesBlock/AdvantagesBlock';

export default function HomePage() {
  return (
    <main>
      <HeroBlock />

      <AdvantagesBlock />

      <PopularLocationsBlock />

      <LastReviewsBlock />
    </main>
  );
}
