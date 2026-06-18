"use client"
import { FeaturedNewsListCard } from "@/component/blog/FeaturedNewsListCard";
import { useArticleList } from "@/services/blog/BlogQueries";
import { Blog } from "@/types/Blog";
import { useEffect, useState } from "react";

const FeaturedArticleList = () => {
    const [article, setArticle] = useState<Blog[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const { data: articleListDatas, isLoading, error } = useArticleList();
    useEffect(() => {
        if (articleListDatas && !isLoading && !error) {
            console.log("articleListDatas", articleListDatas)
            setArticle(articleListDatas.data || []);
            setCurrentPage(articleListDatas.meta?.current_page || 1);
            setTotalPages(articleListDatas.meta?.last_page || 1);
            setTotal(articleListDatas.meta?.total || 0);
            setPerPage(articleListDatas.meta?.per_page || 10);
        }
    }, [articleListDatas, isLoading, error]);

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
            {article.length ? (
                <>
                    {article.filter(item => item.category === 'articles').length > 0 ? (
                        <div className="featured-news-grid">
                            {article.filter(item => item.category === 'articles').slice(0, 3).map((item, index) => (
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
                            <p>No articles found.</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="empty-state">
                    <p>No blogs found.</p>
                </div>
            )}
        </div>
    )
}
export default FeaturedArticleList;