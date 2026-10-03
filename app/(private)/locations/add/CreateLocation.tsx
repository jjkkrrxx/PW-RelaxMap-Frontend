'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import LocationForm from '@/components/LocationForm/LocationForm';
import { createLocation } from '@/components/utils/locationForm';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CreateLocationClient() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createLocation,
    onSuccess: location => {
      queryClient.invalidateQueries({
        queryKey: ['locations'],
      });
      router.push(`/locations/${location._id}`);
    },
    onError: error => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
            'Не вдалося опублікувати локацію. Спробуйте ще раз.'
        );
      } else {
        toast.error('Сталася невідома помилка.');
      }
    },
  });

  return (
    <LocationForm onSubmit={mutation.mutate} isPending={mutation.isPending} />
  );
}
