
type BackgroundImageProps = {
  imageSrc?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function BackgroundImg({
  imageSrc,
  className = "",
  children,
}: BackgroundImageProps) {

  return (
    <div className={`relative overflow-hidden ${className}`}>
        <div
          className="absolute inset-0 bg-gray-900 border-2 border-black"
          style={
            imageSrc
              ? {
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
