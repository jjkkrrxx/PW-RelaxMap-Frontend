import type { ButtonHTMLAttributes, ReactNode } from 'react';
import css from './Button.module.css';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  secondary?: boolean;
  short?: boolean;
}

function Button({
  type = 'button',
  children,
  secondary,
  short,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        css.button,
        secondary && css.secondary,
        short && css.short,
        className
      )}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
