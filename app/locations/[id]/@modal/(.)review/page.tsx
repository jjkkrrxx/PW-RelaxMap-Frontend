import AddReviewModal from '@/components/addreviewmodal/addreviewmodal';

interface Props {
  params: Promise<{ id: string }>;
}

// Перехід зі сторінки локації: модалка поверх сторінки, закриття — крок назад в історії.
export default async function InterceptedReviewModalPage({ params }: Props) {
  const { id } = await params;

  return <AddReviewModal locationId={id} intercepted />;
}
