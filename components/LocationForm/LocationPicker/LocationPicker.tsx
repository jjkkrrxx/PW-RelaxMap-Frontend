'use client';
import css from './LocationPicker.module.css';

import { useFormikContext } from 'formik';
import Map from '../Map/Map';
import { LocationFormValues } from '../LocationForm';

interface LocationPickerProps {
  id: string;
  className?: string;
  resetSignal?: number;
}

export default function LocationPicker({
  id,
  className,
  resetSignal,
}: LocationPickerProps) {
  const { values, setFieldValue } = useFormikContext<LocationFormValues>();

  return (
    <div className={className}>
      <label className={css.label} htmlFor={id}>
        Оберіть розташування
      </label>
      <Map
        resetSignal={resetSignal}
        coordinates={values.coordinates}
        searchable
        onCoordinatesChange={coords => {
          setFieldValue('coordinates', coords);
        }}
        id={id}
      />
    </div>
  );
}
