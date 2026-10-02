import AddReviewModal from '@/components/addreviewmodal/addreviewmodal';

interface Props {
  params: Promise<{ id: string }>;
}

// Прямий захід за адресою /locations/[id]/review (без перехоплення).
export default async function ReviewModalPage({ params }: Props) {
  const { id } = await params;

  return <AddReviewModal locationId={id} />;
}
