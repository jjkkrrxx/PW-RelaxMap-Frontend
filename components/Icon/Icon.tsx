type IconProps = {
  name: string;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} aria-hidden="true">
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
}
