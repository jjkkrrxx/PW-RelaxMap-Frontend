'use client';

import { useEffect, useRef, useState } from 'react';
import css from './Select.module.css';
import { ErrorMessage, useField } from 'formik';
import clsx from 'clsx';
import { IoIosArrowDown } from 'react-icons/io';

const DROPDOWN_HEIGHT = 290;

interface Option {
  slug: string;
  name: string;
}

interface SelectProps {
  options: Option[];
  placeholder: string;
  name: string;
  label?: string;
  id: string;
}

function Select({ options, placeholder, name, label, id }: SelectProps) {
  const [field, meta, helpers] = useField<string>(name);
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const selectedOption = options.find(option => option.slug === field.value);
  const selectedValue = selectedOption?.name;

  const handleToggle = () => {
    if (!isOpen) {
      const rect = selectRef.current?.getBoundingClientRect();

      if (rect) {
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        setOpenUp(spaceBelow < DROPDOWN_HEIGHT && spaceAbove > spaceBelow);
      }

      const selectedIndex = options.findIndex(
        option => option.slug === field.value
      );

      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
    setIsOpen(prev => !prev);
  };

  const handleClick = (option: Option) => {
    helpers.setValue(option.slug);
    helpers.setTouched(true, false);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!options.length) return;
    if (!isOpen) {
      switch (e.key) {
        case ' ':
        case 'ArrowDown':
        case 'ArrowUp':
          e.preventDefault();
          handleToggle();
          return;

        default:
          return;
      }
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;

      case 'Tab':
        setIsOpen(false);
        break;

      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
        break;

      case 'Home':
        e.preventDefault();
        setHighlightedIndex(0);
        break;

      case 'End':
        e.preventDefault();
        setHighlightedIndex(options.length - 1);
        break;

      case 'Enter':
      case ' ': {
        e.preventDefault();

        const option = options[highlightedIndex];

        if (option) {
          handleClick(option);
        }

        break;
      }

      default:
        break;
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    optionRefs.current[highlightedIndex]?.scrollIntoView({
      block: 'nearest',
    });
  }, [highlightedIndex, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hasError = Boolean(meta.touched && meta.error);
  return (
    <>
      {label && (
        <label htmlFor={id} className={css.label}>
          {label}
        </label>
      )}
      <div
        ref={selectRef}
        className={clsx(
          css.select,
          isOpen && css.selectOpen,
          isOpen && openUp && css.openUp,
          hasError && css.errorBorder
        )}
      >
        <button
          id={id}
          className={clsx(css.selectInput, selectedValue && css.selectedInput)}
          type="button"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          onBlur={() => helpers.setTouched(true)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${id}-list`}
        >
          {selectedValue ?? placeholder}
          <IoIosArrowDown
            className={clsx(css.selectIcon, isOpen && css.selectIconOpen)}
          />
        </button>
        {isOpen && (
          <ul
            className={clsx(css.selectList, openUp && css.openUp)}
            id={`${id}-list`}
          >
            {options.map((option, index) => {
              return (
                <li key={option.slug} className={css.selectItem}>
                  <button
                    className={clsx(
                      css.selectButton,
                      selectedValue === option.name && css.selectedButton,
                      index === highlightedIndex && css.highlightedButton
                    )}
                    onClick={() => handleClick(option)}
                    type="button"
                    tabIndex={-1}
                    ref={element => {
                      optionRefs.current[index] = element;
                    }}
                  >
                    {option.name}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <ErrorMessage className={css.error} component="span" name={name} />
    </>
  );
}

export default Select;
