'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

interface ButtonProps {
  text?: string;
  type?: 'submit' | 'button' | 'link';
  variant?: 'primary' | 'secondary' | 'success';
  route?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Button = ({
  text,
  type = 'button',
  variant = 'primary',
  route,
  onClick,
  disabled = false,
  className = '',
  children,
}: ButtonProps) => {
  const content = text || children;
  const variantClass = styles[variant] || styles.primary;

  if (type === 'link' && route) {
    return React.createElement(
      Link,
      {
        href: route,
        className: `${styles.button} ${variantClass} ${className}`,
      },
      content
    );
  }

  return React.createElement(
    'button',
    {
      type: type === 'submit' ? 'submit' : 'button',
      onClick,
      disabled,
      className: `${styles.button} ${variantClass} ${className}`,
    },
    content
  );
};
