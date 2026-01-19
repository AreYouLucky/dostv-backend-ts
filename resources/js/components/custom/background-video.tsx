type BackgroundVideoProps = {
  videoSrc?: string;
  poster?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function BackgroundVideo({
  videoSrc,
  poster,
  className = "",
  children,
}: BackgroundVideoProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gray-900">
        {videoSrc && (
          <video
            className="w-full h-full object-cover border-2 border-black"
            src={videoSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
