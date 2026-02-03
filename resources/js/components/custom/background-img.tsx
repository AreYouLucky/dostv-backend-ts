type BackgroundImageProps = {
  imageSrc?: string;
  fallbackSrc?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function BackgroundImg({
  imageSrc,
  fallbackSrc = "/images/logos/dostv.png",
  className = "",
  children,
}: BackgroundImageProps) {

  const effectiveSrc = imageSrc || fallbackSrc;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 bg-gray-900 border-2 border-black"
        style={{
          backgroundImage: `url(${effectiveSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
