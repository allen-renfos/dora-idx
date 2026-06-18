import { dateToString } from "@/helpers/DateConverters";
import { Blog } from "@/types/Blog";
import Image from "next/image";
import { useState } from "react";

interface BlogListCardProps {
  item: Blog;
}

export const BlogListCard = ({ item }: BlogListCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const handleView = (id: string) => {
    window.location.href = `/blog/${id}`;
  };

  const noPicImage =
    process.env.NEXT_PUBLIC_BLOG_NO_IMAGE || "/images/image3.png";
  
  // Validate image source
  const getValidImageSrc = (imageSrc: string | undefined | null) => {
    if (!imageSrc || imageSrc.trim().length === 0) {
      return noPicImage;
    }
    // Check if it's a valid URL or absolute path
    if (imageSrc.startsWith('/') || imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }
    // If it's not a valid format, use fallback
    return noPicImage;
  };

  const validImageSrc = getValidImageSrc(item.image);
  const backgroundImage = `url(${validImageSrc})`;

  return (
    <div className="news-blog-card blog-card-img" style={{ backgroundImage: "none" }}>
      {!isImageLoaded && (
        <div
          className="skeleton"
          style={{ position: "absolute", inset: 0, borderRadius: "0" }}
        />
      )}
      <div style={{ position: "absolute", inset: 0 }}>
        <Image
          src={validImageSrc}
          alt={item.title || "Blog image"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{
            objectFit: "cover",
            opacity: isImageLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageLoaded(true)}
        />
      </div>
      <div className="news-blog-overlay"></div>
      <div className="news-blog-info">
        <p className="news-blog-date">{dateToString(item?.publishDate)}</p>
        <h3>{item.title}</h3>
        <button
          className="news-blog-button"
          onClick={() => handleView(item.slug)}
        >
          Read More
        </button>
      </div>
    </div>
  );
};
