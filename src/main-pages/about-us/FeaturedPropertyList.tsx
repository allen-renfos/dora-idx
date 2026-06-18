import PropertyHomeList from "../home/PropertyHomeList"
import FeaturedProperties from "./FeaturedProperties"

export const FeturedPropertyList = () => {
    return (
        <section className="properties">
            <div className="container">
                <div className=" flex flex-col items-center mb-8">
                    <span className="second-header-text">Featured Listings</span>
                </div>
                <FeaturedProperties />
            </div>
        </section>)
}