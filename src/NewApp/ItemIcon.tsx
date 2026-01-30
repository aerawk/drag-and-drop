export function ItemIcon({
  src,
  alt,
  width,
}: {
  src: string;
  alt: string;
  width: number;
}) {
  return (
    // <div className="w-fit scale-[0.25] sm:scale-[0.50] md:scale-[.75] lg:scale-[1]">
    <div className="w-fit">
      <img src={src} alt={alt} width={width} />
    </div>
  );
}
