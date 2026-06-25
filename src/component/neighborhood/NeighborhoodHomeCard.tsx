import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";

interface NeighborhoodHomeCardProps {
  item: any; // Replace 'any' with a more specific type if available
}

export const NeighborhoodHomeCard = ({ item }: NeighborhoodHomeCardProps) => {
  const handleClick = (name: string) => {
    // sessionStorage.setItem("prop_location", name);
    window.location.href = "/properties?keyword=" + encodeURIComponent(name);
  };

  // Helper to validate image src
  const getImageSrc = () => {
    const img = item.image ?? item.images;
    if (typeof img === "string" && img.trim() !== "") {
      if (img.startsWith("http")) {
        return img;
      }
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://stgadm.realtipro.com/api";
      const apiBaseUrl = baseUrl.replace("/api", "");
      return `${apiBaseUrl}/${img}`;
    }
    // Default fallback image from environment variable
    return (
      process.env.NEXT_PUBLIC_NEIGHBORHOOD_NO_IMAGE ||
      "/images/neighborhood-1.png"
    );
  };

  const label = item.name || item.city || item.county || item.state;

  return (
    <div
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--pine)] border border-[var(--line)] cursor-pointer hover:shadow-[var(--shadow-lift)] hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      onClick={() => handleClick(label)}
    >
      <Image
        src={getImageSrc()}
        alt={label || "neighborhood"}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--pine)] via-[var(--pine)]/30 to-transparent pointer-events-none" />
      {(item.name ||
        item.city ||
        item.county ||
        item.state ||
        item.description) && (
        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-3">
          <div className="flex items-end justify-between gap-3">
            {label && (
              <h3 className="font-serif text-2xl text-[var(--on-pine)] leading-tight">
                {label}
              </h3>
            )}
            <span className="shrink-0 w-9 h-9 rounded-full border border-[var(--on-pine-faint)] flex items-center justify-center text-[var(--on-pine)] group-hover:bg-[var(--gold-300)] group-hover:border-[var(--gold-300)] group-hover:text-[var(--pine)] transition-all duration-300">
              <FiArrowRight size={14} />
            </span>
          </div>
          {item.description && (
            <p className="text-[13px] text-[var(--on-pine-soft)] line-clamp-2 max-w-xs">
              {item.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
