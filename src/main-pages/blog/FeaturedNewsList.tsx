"use client";
import { FeaturedNewsListCard } from "@/component/blog/FeaturedNewsListCard";
import { useNewsList, useArticleList } from "@/services/blog/BlogQueries";
import { Blog } from "@/types/Blog";
import { isInCategory } from "@/main-pages/blog/blogCategory";
import { useEffect, useMemo, useState } from "react";

const FeaturedNewsList = () => {
  const [news, setNews] = useState<Blog[]>([]);
  // Primary source: the dedicated featured-news endpoint. It often returns
  // nothing (no posts flagged featured), so fall back to the general blog
  // list and pull the "news" items from there.
  const { data: featuredNews } = useNewsList();
  const { data: blogList, isLoading, error } = useArticleList();

  useEffect(() => {
    if (isLoading || error) return;
    const featured: Blog[] = featuredNews?.data || [];
    const all: Blog[] = blogList?.data || [];
    setNews(featured.length ? featured : all);
  }, [featuredNews, blogList, isLoading, error]);

  const headlines = useMemo(
    () => news.filter((item) => isInCategory(item.category, "news")).slice(0, 3),
    [news]
  );

  if (isLoading)
    return (
      <div className="featured-news-container">
        <div className="featured-news-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`featured-news-skeleton-${index}`} className="featured-div-mt">
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
      {headlines.length > 0 ? (
        <div className="featured-news-grid">
          {headlines.map((item, index) => (
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
          <p>No headlines just yet.</p>
        </div>
      )}
    </div>
  );
};
export default FeaturedNewsList;
