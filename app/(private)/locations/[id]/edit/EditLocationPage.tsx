'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import LocationForm, {
  LocationFormValues,
} from '@/components/LocationForm/LocationForm';
import { updateLocation } from '@/components/utils/locationForm';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

interface EditLocationClientProps {
  id: string;
  data: LocationFormValues;
}

export default function EditLocationClient({
  id,
  data,
}: EditLocationClientProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (values: LocationFormValues) => updateLocation(id, values),
    onSuccess: location => {
      queryClient.invalidateQueries({
        queryKey: ['locations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['location', id],
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
    <LocationForm
      edit
      values={data}
      onSubmit={mutation.mutate}
      isPending={mutation.isPending}
    />
  );
}
