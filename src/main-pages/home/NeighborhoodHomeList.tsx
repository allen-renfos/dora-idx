"use client";
import { NeighborhoodHomeCard } from "@/component/neighborhood/NeighborhoodHomeCard";
import Providers from "@/provider/QueryClientProvider";
import { useNeighborhoodList } from "@/services/neighborhood/NeighborhoodQueries";
import { useEffect, useState, useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";
type Neighborhood = {
  id: number;
  name: string;
};

const NeighborhoodHomeList = () => {
  const [neighborhood, setNeighborhood] = useState<Neighborhood[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: neighborListDatas, isLoading, error } = useNeighborhoodList();

  useEffect(() => {
    if (neighborListDatas && !isLoading && !error) {
      setNeighborhood(neighborListDatas.data || []);
    }
  }, [neighborListDatas, isLoading, error]);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    requestAnimationFrame(checkScrollButtons);
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [neighborhood]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const handleMore = () => {
    window.location.href = "/neighborhoods";
  };

  return (
    <Providers>
      <section className="neighborhoods">
        <div className="container">
          <div className="section-header">
            <div className="flex column">
              <span className="second-header-text">
                Find your <br /> Neighborhoods
              </span>
              {/* <p>Top priority, and committed to walking with them</p> */}
            </div>

            {isLoading ? (
              <div className="nav-arrows">
                <div
                  className="skeleton"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
                <div
                  className="skeleton"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
              </div>
            ) : neighborhood.length > 0 ? (
              <div className="nav-arrows">
                <button
                  className={`nav-arrow ${canScrollLeft ? 'nav-arrow-bgbutton' : ''}`}
                  onClick={handleScrollLeft}
                  disabled={!canScrollLeft}
                >
                  <IoIosArrowRoundBack color={canScrollLeft ? "white" : "#EDB75E"} size={30} />
                </button>
                <button
                  className={`nav-arrow ${canScrollRight ? 'nav-arrow-bgbutton' : ''}`}
                  onClick={handleScrollRight}
                  disabled={!canScrollRight}
                >
                  <IoIosArrowRoundForward color={canScrollRight ? "white" : "#EDB75E"} size={30} />
                </button>
              </div>
            ) : null}
          </div>

          <div className="neighborhoods-grid neighborhoods-carousel" ref={scrollContainerRef}>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`neighborhood-skeleton-${index}`}
                  className="neighborhood-card skeleton"
                  style={{ minHeight: "350px" }}
                />
              ))
            ) : neighborhood.length ? (
              <>
                {neighborhood.map((item, index) => (
                  <div
                    key={item.id}
                    className="stagger-right"
                    style={{ animationDelay: `${index * 0.12}s` }}
                  >
                    <NeighborhoodHomeCard item={item} />
                  </div>
                ))}
              </>
            ) : (
              <div>No neighborhood found.</div>
            )}
          </div>

          <div className="section-cta">
            <button className="btn-gold" onClick={handleMore}>
              See All Neighborhoods
            </button>
          </div>
        </div>
      </section>
    </Providers>
  );
};
export default NeighborhoodHomeList;
