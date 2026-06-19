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
        <div className="relative h-full flex flex-col gap-6 bg-[var(--cream)] rounded-[var(--radius-md)] border border-[var(--line)] p-8 md:p-10 hover:shadow-[var(--shadow-soft)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <span
                aria-hidden
                className="font-serif text-[var(--gold)]/40 text-6xl leading-none select-none"
            >
                &ldquo;
            </span>
            <div className="flex items-center gap-1 text-[var(--gold-deep)] text-sm tracking-[0.2em]">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
            </div>
            <p className="font-serif italic text-[clamp(17px,1.4vw,21px)] leading-[1.6] text-[var(--ink-soft)] flex-1">
                {item.details}
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-[var(--line)]">
                <Image
                    src={imageSrc}
                    alt={item?.name || "Testimonial"}
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-12 h-12"
                />
                <div className="flex flex-col">
                    <h4 className="font-serif text-[17px] text-[var(--ink)] leading-tight">{item.name}</h4>
                    <span className="text-[12px] uppercase tracking-[0.18em] text-[var(--ink-faint)] font-[family-name:var(--font-accent)]">{item.position}</span>
                </div>
            </div>
        </div>
    )
}