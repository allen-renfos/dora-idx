"use client"
import React, { useEffect, useState, useRef } from "react";
import { useBlogList, useNewsList } from "@/services/blog/BlogQueries";
import { Blog } from "@/types/Blog";
import { NewsArticleCard } from "@/component/home/NewsArticleCard";
import Providers from "@/provider/QueryClientProvider";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

interface NewsArticleListProps {
    currentPage: number;
    onPageChange: (page: number) => void;
    totalPages: number;
    setTotalPages: (total: number) => void;
}

const NewsArticleList = ({ currentPage, onPageChange, totalPages, setTotalPages }: NewsArticleListProps) => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { data: blogListDatas, isLoading, error } = useNewsList();

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        if (blogListDatas && !isLoading && !error) {
            const allBlogs = blogListDatas.data || [];
            setBlogs(allBlogs);
            // Calculate total pages (3 items per page)
            const pages = Math.ceil(allBlogs.length / 3);
            console.log('Total blogs:', allBlogs.length, 'Total pages:', pages);
            setTotalPages(pages);
        }
    }, [blogListDatas, isLoading, error, setTotalPages]);

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
    }, [blogs]);

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

    const handlePrevNews = () => {
        handleScrollLeft();
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextNews = () => {
        handleScrollRight();
        if (currentPage < totalPages - 1) {
            onPageChange(currentPage + 1);
        }
    };

    if (isLoading)
        return (
            <Providers>
                <div className="section-header">
                    <div className="flex column">
                        <div className="second-header-text">
                            Browse our <br /> News and Article
                            <br />
                        </div>
                    </div>
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
                </div>
                <div className="news-grid">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={`news-skeleton-${index}`} className="news-card">
                            <div className="news-image skeleton" style={{ height: "400px" }} />
                            <div className="news-content">
                                <div className="skeleton skeleton-text" style={{ width: "120px", height: "14px", marginBottom: "12px" }} />
                                <div className="skeleton skeleton-text" style={{ width: "90%", height: "16px", marginBottom: "10px" }} />
                                <div className="skeleton skeleton-text" style={{ width: "75%", height: "16px", marginBottom: "10px" }} />
                                <div className="skeleton skeleton-text" style={{ width: "40%", height: "12px" }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="section-cta mb5 ">
                    <div className="skeleton" style={{ width: "220px", height: "44px", borderRadius: "9999px" }} />
                </div>
            </Providers>
        );
    if (error) return <div>Error loading blogs.</div>;

    const handleBlog = () => {
        window.location.href = '/blog';
    }

    return (
        <Providers>
            <div className="section-header">
                <div className="flex column">
                    <div className="second-header-text">
                        Browse our <br /> News and Article
                        <br />
                    </div>
                </div>

                {blogs.length > 0 && (
                    <div className="nav-arrows">
                        <button
                            className={`nav-arrow ${canScrollLeft ? 'nav-arrow-bgbutton' : ''}`}
                            onClick={handlePrevNews}
                            disabled={!canScrollLeft}
                        >
                            <IoIosArrowRoundBack color={canScrollLeft ? "white" : "#c2a878"} size={40} />
                        </button>
                        <button
                            className={`nav-arrow ${canScrollRight ? 'nav-arrow-bgbutton' : ''}`}
                            onClick={handleNextNews}
                            disabled={!canScrollRight}
                        >
                            <IoIosArrowRoundForward color={canScrollRight ? "white" : "#c2a878"} size={40} />
                        </button>
                    </div>
                )}
            </div>

            <div className="news-grid news-carousel" ref={scrollContainerRef}>
                {blogs.length ? (
                    <>
                        {blogs.map((item, index) => (
                            <div
                                key={item.id}
                                className="stagger-item"
                                style={{ animationDelay: `${index * 0.12}s` }}
                            >
                                <NewsArticleCard item={item} />
                            </div>
                        ))}
                    </>
                ) : (
                    <div>No News articles found.</div>
                )}
            </div>
            <div className="section-cta ">
                <button
                    onClick={() => handleBlog()}
                    className="btn-gold mb5">See All News & Articles</button>
            </div>
        </Providers>
    );
}
export default NewsArticleList;