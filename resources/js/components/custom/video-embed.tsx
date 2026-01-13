import React from "react";



interface VideoEmbedProps {
  url?: string;
  platform?: string;
}

const VideoEmbed = ({ url = "", platform = "", }: VideoEmbedProps) => {
  if (!url || !platform) {
    return (
      <div className="w-full min-h-[215px] flex items-center justify-center border border-dashed rounded-lg">
        Add video information
      </div>
    );
  }

  const getEmbedUrl = () => {
    switch (platform) {
      case "YouTube":
        return `https://www.youtube.com/embed/${extractYouTubeId(url)}`;

      case "Facebook":
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          url
        )}&show_text=false`;

      case "Tiktok":
        return `https://www.tiktok.com/embed/v2/${extractTikTokId(url)}`;

      default:
        return "";
    }
  };

  return (
    <iframe
      src={getEmbedUrl()}
      width="100%"
      height="315"
      style={{ border: "none", borderRadius: "8px" }}
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
      allowFullScreen
      loading="lazy"
      title="Embedded Video"
    />
  );
};

function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&?/]+)/,
  );
  return match ? match[1] : "";
}

function extractTikTokId(url: string): string {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : "";
}

export default VideoEmbed;
