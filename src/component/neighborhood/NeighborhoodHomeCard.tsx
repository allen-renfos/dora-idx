import Image from "next/image";

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
        "https://adminapi.realtipro.com/api";
      const apiBaseUrl = baseUrl.replace("/api", "");
      return `${apiBaseUrl}/${img}`;
    }
    // Default fallback image from environment variable
    return (
      process.env.NEXT_PUBLIC_NEIGHBORHOOD_NO_IMAGE ||
      "/images/neighborhood-1.png"
    );
  };

  return (
    <div
      className="neighborhood-card"
      onClick={() =>
        handleClick(item.name || item.city || item.county || item.state)
      }
      style={{ position: "relative" }}
    >
      <Image src={getImageSrc()} alt="neighborhood" width={300} height={200} />
      {(item.name ||
        item.city ||
        item.county ||
        item.state ||
        item.description) && (
        <div className="neighborhood-info">
          {(item.name || item.city || item.county || item.state) && (
            <h3>{item.name || item.city || item.county || item.state}</h3>
          )}
          {/* <h3>{item.name}</h3> */}
          <p>{item.description}</p>
        </div>
      )}
    </div>
  );
};
