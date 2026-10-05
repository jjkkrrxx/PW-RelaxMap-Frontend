import { ReactNode } from 'react';
import css from './Container.module.css';

interface ContainerProps {
  children: ReactNode;
  // додаткові стилі блоку поверх контейнера (напр. flex)
  className?: string;
}

function Container({ children, className }: ContainerProps) {
  return (
    <div className={className ? `${css.container} ${className}` : css.container}>
      {children}
    </div>
  );
}

export default Container;
