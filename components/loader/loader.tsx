import styles from "./loader.module.css";

type LoaderProps = {
  fullscreen?: boolean;
  size?: number;
  light?: boolean;
};

export default function Loader({
  fullscreen = false,
  size = 50,
  light = false,
}: LoaderProps) {
  return (
    <div
      className={
        fullscreen ? `${styles.loader} ${styles.fullscreen}` : styles.loader
      }
      role="status"
      aria-label="Завантаження"
    >
      <span
        className={`${styles.spinner} ${light ? styles.light : ""}`}
        style={{
          width: size,
          height: size,
          borderWidth: Math.max(2, Math.round(size / 10)),
        }}
        aria-hidden="true"
      />
    </div>
  );
}
