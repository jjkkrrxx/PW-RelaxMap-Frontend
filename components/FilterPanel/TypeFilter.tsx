'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/Icon/Icon';
import type { DropdownOption } from '@/components/Dropdown/Dropdown';
import dropdownStyles from '@/components/Dropdown/Dropdown.module.css';
import styles from './TypeFilter.module.css';

interface TypeFilterProps {
  options: DropdownOption[];
  // обрані типи (slug); порожній масив — усі типи
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}

// Фільтр за типом локації: за ТЗ — чекбокси, за макетом — поле як у Dropdown.
// Тому поле виглядає як список, а всередині — чекбокси, можна обрати кілька типів.
const TypeFilter = ({
  options,
  values,
  onChange,
  placeholder,
}: TypeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // клік поза списком закриває його
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setIsOpen(false);
    }
  };

  const toggle = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );
  };

  const selected = options.filter((option) => values.includes(option.value));
  const label =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0].label
        : `Обрано: ${selected.length}`;

  return (
    <div
      ref={rootRef}
      className={dropdownStyles.dropdown}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={`${dropdownStyles.trigger} ${
          selected.length ? dropdownStyles.hasValue : ''
        } ${isOpen ? dropdownStyles.open : ''}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-label={`Тип локації: ${
          selected.length
            ? selected.map((option) => option.label).join(', ')
            : 'усі типи'
        }`}
      >
        <span className={dropdownStyles.label}>{label}</span>
        <Icon
          name="icon-keyboard_arrow_down"
          size={24}
          className={`${dropdownStyles.arrow} ${
            isOpen ? dropdownStyles.arrowOpen : ''
          }`}
        />
      </button>

      {isOpen && (
        <fieldset
          id={listId}
          className={`${dropdownStyles.menu} ${styles.list}`}
        >
          <legend className={styles.legend}>Тип локації</legend>
          {options.map((option) => (
            <label key={option.value} className={styles.item}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={values.includes(option.value)}
                onChange={() => toggle(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
      )}
    </div>
  );
};

export default TypeFilter;
