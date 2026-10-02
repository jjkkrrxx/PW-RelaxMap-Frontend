// Слот @modal — паралельний маршрут для модалок сторінки локації (форма відгуку).
export default function LocationLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
