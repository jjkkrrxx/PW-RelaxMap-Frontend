import AddReviewModal from '@/components/addreviewmodal/addreviewmodal';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReviewModalPage({ params }: Props) {
  const { id } = await params;

  return <AddReviewModal locationId={id} />;
}
