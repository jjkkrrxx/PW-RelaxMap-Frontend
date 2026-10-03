import styles from './loader.module.css';

type LoaderProps = {
  fullscreen?: boolean;
};

export default function Loader({ fullscreen = false }: LoaderProps) {
  return (
    <div
      className={fullscreen ? `${styles.loader} ${styles.fullscreen}` : styles.loader}
      role="status"
      aria-label="Завантаження"
    >
      <span className={styles.spinner} aria-hidden="true" />
    </div>
  );
}