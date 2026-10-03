import AddReviewModal from '@/components/addreviewmodal/addreviewmodal';

interface Props {
  params: Promise<{ id: string }>;
}

<<<<<<< HEAD
=======
// Прямий захід за адресою /locations/[id]/review (без перехоплення).
>>>>>>> d689ce4bf53ec5e1131e460deb5527dc837dc923
export default async function ReviewModalPage({ params }: Props) {
  const { id } = await params;

  return <AddReviewModal locationId={id} />;
}
