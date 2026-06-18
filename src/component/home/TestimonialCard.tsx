import Image from "next/image";

export const TestmonialCard = ({ item, index }: { item: any; index: number }) => {
    // Validate and provide fallback for image
    const getValidImageSrc = (imageSrc: string | undefined | null) => {
        if (!imageSrc || imageSrc.trim().length === 0) {
            return "/images/default-avatar.png";
        }
        // Check if it's a valid URL or absolute path
        if (imageSrc.startsWith('/') || imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
            return imageSrc;
        }
        // If it's not a valid format, use fallback
        return "/images/default-avatar.png";
    };

    const imageSrc = getValidImageSrc(item?.image);

    return (
        <div className={((index + 1) % 2) ? "testimonial-card " : "testimonial-card active"}>
            <div className="stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
            </div>
            <p className="testimonial-text">{item.details}</p>
            <div className="testimonial-author">
                <Image
                    src={imageSrc}
                    alt={item?.name || "Testimonial"}
                    width={48}
                    height={48}
                    className="author-avatar"
                />
                <div className="author-info">
                    <h4>{item.name}</h4>
                    <span>{item.position}</span>
                </div>
            </div>
        </div>
    )
}