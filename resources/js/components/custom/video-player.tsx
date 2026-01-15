import { useEffect, useRef, useState } from "react";

type VideoWithThumbnailProps = {
  videoSrc?: string;
  thumbnailSrc?: string;     
  thumbnailFallbackSrc?: string;
  className?: string;
  delay?: number; 
};

export default function VideoWithThumbnail({
  videoSrc,
  thumbnailSrc,
  thumbnailFallbackSrc,
  className = "",
  delay = 3000,
}: VideoWithThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  useEffect(() => {
    if (!videoSrc) return;

    const timer = setTimeout(() => {
      setShowVideo(true);
      videoRef.current?.play().catch(() => {
        setVideoError(true);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [videoSrc, delay]);

  const shouldShowVideo = videoSrc && showVideo && !videoError;

  const currentThumbnail = !thumbError
    ? thumbnailSrc
    : thumbnailFallbackSrc;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {!shouldShowVideo && currentThumbnail && (
        <img
          src={currentThumbnail}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setThumbError(true)}
          draggable={false}
        />
      )}
      {!shouldShowVideo && !currentThumbnail && (
        <div className="absolute inset-0 bg-gray-900" />
      )}
      {shouldShowVideo && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay={true}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setVideoError(true)}
        />
      )}
    </div>
  );
}
