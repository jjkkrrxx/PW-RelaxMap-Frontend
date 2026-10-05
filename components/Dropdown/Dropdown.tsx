'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/Icon/Icon';
import styles from './Dropdown.module.css';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  // назва списку для скрінрідерів, напр. «Регіон»
  ariaLabel: string;
}

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder,
  ariaLabel,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // порожнє значення — фільтр не обрано, показуємо плейсхолдер
  const selected = value
    ? options.find((option) => option.value === value)
    : undefined;

  const open = () => {
    const index = options.findIndex((option) => option.value === value);
    setHighlighted(index >= 0 ? index : 0);
    setIsOpen(true);
  };

  const select = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!options.length) return;

    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        open();
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setHighlighted((index) => (index + 1) % options.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlighted(
          (index) => (index - 1 + options.length) % options.length,
        );
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const option = options[highlighted];
        if (option) select(option.value);
        break;
      }
      default:
        break;
    }
  };

  const optionId = (index: number) => `${listId}-option-${index}`;

  return (
    <div ref={rootRef} className={styles.dropdown}>
      <button
        type="button"
        role="combobox"
        // для combobox назва — лише з aria-label: поле й обране значення
        aria-label={`${ariaLabel}: ${selected?.label ?? 'не обрано'}`}
        className={`${styles.trigger} ${selected ? styles.hasValue : ''} ${
          isOpen ? styles.open : ''
        }`}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? optionId(highlighted) : undefined}
      >
        <span className={styles.label}>{selected?.label ?? placeholder}</span>
        <Icon
          name="icon-keyboard_arrow_down"
          size={24}
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
        />
      </button>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className={styles.menu}
        >
          {options.map((option, index) => (
            <li
              key={option.value || 'all'}
              id={optionId(index)}
              role="option"
              aria-selected={option.value === value}
              className={`${styles.option} ${
                index === highlighted ? styles.highlighted : ''
              } ${option.value === value ? styles.selected : ''}`}
              // не забираємо фокус з кнопки при кліку на пункт
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setHighlighted(index)}
              onClick={() => select(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
