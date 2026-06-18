import { dateToString } from "@/helpers/DateConverters";
import Image from "next/image";
import Link from "next/link";

interface NewsArticleCardProps {
    item: any; 
}
export const NewsArticleCard = ({item}:NewsArticleCardProps) => {
    const noPicImage = process.env.NEXT_PUBLIC_BLOG_NO_IMAGE || "/images/image3.png";
    
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

    const imageSrc = getValidImageSrc(item?.image);

    return (
        <Link href={`/blog/${item.slug}`} className="news-card-link">
            <article className="news-card">
                <div className="news-image" style={{ position: "relative" }}>
                    <Image
                        src={imageSrc}
                        alt={item?.title || "Article"}
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>
                <div className="news-content">
                    <time>{dateToString(item?.publishDate)}</time>
                    <h3>{item.title}</h3>
                    <button className="read-more-btn">Read More</button>
                </div>
            </article>
        </Link>
    )
}