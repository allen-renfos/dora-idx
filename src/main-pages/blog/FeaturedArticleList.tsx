"use client"
import { FeaturedNewsListCard } from "@/component/blog/FeaturedNewsListCard";
import { useArticleList } from "@/services/blog/BlogQueries";
import { Blog } from "@/types/Blog";
import { isInCategory } from "@/main-pages/blog/blogCategory";
import { useEffect, useMemo, useState } from "react";

const FeaturedArticleList = () => {
    const [article, setArticle] = useState<Blog[]>([]);
    const { data: articleListDatas, isLoading, error } = useArticleList();
    useEffect(() => {
        if (articleListDatas && !isLoading && !error) {
            setArticle(articleListDatas.data || []);
        }
    }, [articleListDatas, isLoading, error]);

    // API category is "article" (singular); match tolerantly.
    const picks = useMemo(
        () => article.filter((item) => isInCategory(item.category, "article")).slice(0, 3),
        [article]
    );

    if (isLoading)
        return (
            <div className="featured-news-container">
                <div className="featured-news-grid">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={`featured-article-skeleton-${index}`} className="featured-div-mt">
                            <div className="featured-blog-img">
                                <div className="skeleton" style={{ width: "130px", height: "135px", borderRadius: "0" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="skeleton skeleton-text" style={{ width: "120px", height: "14px", marginBottom: "10px" }} />
                                <div className="skeleton skeleton-text" style={{ width: "90%", height: "18px", marginBottom: "8px" }} />
                                <div className="skeleton skeleton-text" style={{ width: "70%", height: "18px" }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    if (error) return <div>Error loading blogs.</div>;

    return (
        <div className="featured-news-container">
            {picks.length > 0 ? (
                <div className="featured-news-grid">
                    {picks.map((item, index) => (
                        <div
                            key={item.id}
                            className="stagger-up"
                            style={{ animationDelay: `${index * 0.12}s` }}
                        >
                            <FeaturedNewsListCard item={item} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>No picks just yet.</p>
                </div>
            )}
        </div>
    )
}
export default FeaturedArticleList;