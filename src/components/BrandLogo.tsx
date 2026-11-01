const BrandLogo = ({ src, className = "" }: { src: string; className?: string }) => {
  const isVariationSheet = src.includes("green_life_expo_logo_variations_20251225134629_1.webp");

  return (
    <span className={`relative inline-block shrink-0 ${isVariationSheet ? "aspect-square overflow-hidden bg-white" : ""} ${className}`}>
      <img
        src={src}
        alt="Green Life Expo"
        className={isVariationSheet
          ? "absolute top-0 left-0 w-[200%] max-w-none h-[200%]"
          : "h-full w-auto object-contain"}
      />
    </span>
  );
};

export default BrandLogo;
