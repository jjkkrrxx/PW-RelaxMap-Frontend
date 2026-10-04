'use client';

import { Form, Formik } from 'formik';
import css from './LocationForm.module.css';
import { useEffect, useId, useState } from 'react';
import * as Yup from 'yup';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/image';
import ImageUploadField from './ImageUploadField/ImageUploadField';
import InputField from './InputField/InputField';
import Select from './Select/Select';
import Textarea from './Textarea/Textarea';
import Button from './Button/Button';
import LocationPicker from './LocationPicker/LocationPicker';
import { useCategoriesStore } from '@/lib/store/categoriesStore';

export interface LocationFormValues {
  image: File | null | string;
  name: string;
  locationType: string;
  region: string;
  description: string;
  coordinates: {
    lat: number | null;
    lon: number | null;
  };
}

interface LocationFormProps {
  values?: LocationFormValues;
  edit?: boolean;
  onSubmit: (values: LocationFormValues) => void;
  isPending: boolean;
}

const locationFormSchema = Yup.object({
  image: Yup.mixed<File | string>()
    .nullable()
    .required('Завантажте зображення')
    .test('fileType', 'Дозволені тільки PNG або JPG зображення', value => {
      if (typeof value === 'string') return true;
      if (!(value instanceof File)) return false;

      return ALLOWED_IMAGE_TYPES.includes(value.type);
    })
    .test(
      'fileSize',
      'Зображення завелике. Будь ласка, оберіть інше.',
      value => {
        if (typeof value === 'string') return true;
        if (!(value instanceof File)) return false;

        return value.size <= MAX_FILE_SIZE;
      }
    ),
  name: Yup.string()
    .required('Введіть назву')
    .min(3, 'Мінімум 3 символи')
    .max(96, 'Максимум 96 символів'),
  locationType: Yup.string().required('Оберіть тип місця'),
  region: Yup.string().required('Оберіть регіон'),
  description: Yup.string()
    .required('Введіть опис')
    .min(20, 'Мінімум 20 символів')
    .max(6000, 'Максимум 6000 символів'),
  coordinates: Yup.object({
    lat: Yup.number().nullable().optional(),
    lon: Yup.number().nullable().optional(),
  })
    .nullable()
    .optional()
    .test('coords-pair', 'Оберіть розташування', value => {
      if (!value) return true;
      const { lat, lon } = value;
      return (lat == null && lon == null) || (lat != null && lon != null);
    }),
});

function LocationForm({
  values,
  edit,
  onSubmit,
  isPending,
}: LocationFormProps) {
  const initialValues: LocationFormValues = {
    image: null,
    name: '',
    locationType: '',
    region: '',
    description: '',
    coordinates: {
      lat: null,
      lon: null,
    },
    ...values,
  };
  const [resetSignal, setResetSignal] = useState(0);
  const formId = useId();
  const categories = useCategoriesStore(state => state.categories);
  const hasHydrated = useCategoriesStore(state => state.hasHydrated);
  const fetchIfEmpty = useCategoriesStore(state => state.fetchIfEmpty);

  useEffect(() => {
    if (!useCategoriesStore.persist.hasHydrated()) {
      void useCategoriesStore.persist.rehydrate();
    }
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      void fetchIfEmpty();
    }
  }, [fetchIfEmpty, hasHydrated]);

  const handleSubmit = (values: LocationFormValues) => {
    onSubmit(values);
  };

  const locationTypes = categories?.locationTypes ?? [];
  const regions = categories?.regions ?? [];

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={locationFormSchema}
      enableReinitialize
    >
      {({ isValid, dirty, resetForm }) => (
        <Form className={css.form}>
          <ImageUploadField
            name="image"
            id={`image-${formId}`}
            label="Обкладинка"
          />

          <InputField
            id={`name-${formId}`}
            name="name"
            placeholder="Введіть назву місця"
            type="text"
            label="Назва місця"
          />

          <Select
            label="Тип місця"
            name="locationType"
            options={locationTypes}
            placeholder="Оберіть тип місця"
            id={`locationType-${formId}`}
          />
          <Select
            label="Регіон"
            name="region"
            options={regions}
            placeholder="Оберіть регіон"
            id={`region-${formId}`}
          />
          <Textarea
            id={`textarea-${formId}`}
            name="description"
            placeholder="Детальний опис локації"
            label="Детальний опис"
          />
          <LocationPicker
            id={`location-${formId}`}
            className={css.locationPicker}
            resetSignal={resetSignal}
          />
          <div className={css.buttons}>
            <Button
              className={css.button}
              type="button"
              onClick={() => {
                resetForm();
                setResetSignal(prev => prev + 1);
              }}
              secondary
            >
              Відмінити
            </Button>
            <Button
              className={css.button}
              type="submit"
              disabled={!(isValid && dirty) || isPending}
            >
              {isPending ? (
                <>
                  <span>{edit ? 'Збереження' : 'Публікація'}</span>
                  <span className={css.loader} />
                </>
              ) : edit ? (
                'Зберегти'
              ) : (
                'Опублікувати'
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default LocationForm;
