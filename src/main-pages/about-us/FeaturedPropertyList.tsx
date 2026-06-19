import PropertyHomeList from "../home/PropertyHomeList"
import FeaturedProperties from "./FeaturedProperties"

export const FeturedPropertyList = () => {
    return (
        <section className="section-pad bg-[var(--canvas)]">
            <div className="container-wide">
                <div className="flex flex-col items-center text-center gap-4 mb-12">
                    <span className="eyebrow inline-flex items-center gap-3">
                        <span className="inline-block h-px w-10 bg-[var(--gold)]" />
                        Selected Homes
                        <span className="inline-block h-px w-10 bg-[var(--gold)]" />
                    </span>
                    <h2 className="display-md text-[var(--ink)]">Featured listings</h2>
                </div>
                <FeaturedProperties />
            </div>
        </section>)
}