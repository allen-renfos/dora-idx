import '../../styles/globalStyles.css';
import PropertyList from "@/main-pages/properties/PropertyList";
import { NewsLetter } from "@/component/sharable/NewsLetter";

export default function PropertiesPage() {
  return (
    <>
      <PropertyList />
      <NewsLetter />
    </>
  );
}
