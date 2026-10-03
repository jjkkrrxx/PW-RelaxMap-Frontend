import React from 'react';
import AddReviewModal from '@/components/addreviewmodal/addreviewmodal';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReviewModalPage({ params }: Props) {  
  await params;

  return AddReviewModal;
}
