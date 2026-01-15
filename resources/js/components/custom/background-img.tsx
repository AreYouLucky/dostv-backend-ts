
type BackgroundVideoProps = {
  imageSrc?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function BackgroundImg({
  imageSrc,
  className = "",
  children,
}: BackgroundVideoProps) {

  return (
    <div className={`relative overflow-hidden ${className}`}>
        <div
          className="absolute inset-0 bg-gray-900"
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
