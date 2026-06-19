import { dateToString } from "@/helpers/DateConverters";
import { Blog } from "@/types/Blog";
import Image from "next/image";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

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

  return (
    <article
      onClick={() => handleView(item.slug)}
      className="group flex flex-col h-full cursor-pointer bg-[var(--cream)] rounded-[var(--radius-md)] border border-[var(--line)] overflow-hidden hover:shadow-[var(--shadow-lift)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--canvas-2)]">
        {!isImageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-[var(--canvas-2)]" />
        )}
        <Image
          src={validImageSrc}
          alt={item.title || "Article"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ opacity: isImageLoaded ? 1 : 0 }}
          className="object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)]/25 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col gap-3 p-7 flex-1">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold-deep)] font-[family-name:var(--font-accent)]">
          {dateToString(item?.publishDate)}
        </span>
        <h3 className="font-serif text-[1.45rem] md:text-[1.6rem] leading-[1.2] text-[var(--ink)] group-hover:text-[var(--gold-deep)] transition-colors line-clamp-3">
          {item.title}
        </h3>
        <span className="mt-auto pt-2 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)] group-hover:text-[var(--gold-deep)] transition-colors">
          Read
          <FiArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </article>
  );
};
