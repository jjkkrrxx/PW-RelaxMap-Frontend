import { useState } from "react";
import styles from "./Dropdown.module.css";
import { Icon } from "@/components/Icon/Icon";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const Dropdown = ({ options, value, onChange, placeholder }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedOption?.label || placeholder}</span>

        <Icon
          name={isOpen ? "icon-keyboard_arrow_up" : "icon-keyboard_arrow_down"}
          size={24}
          className={styles.arrow}
        />
      </button>

      {isOpen && (
        <ul className={styles.menu}>
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={styles.option}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
