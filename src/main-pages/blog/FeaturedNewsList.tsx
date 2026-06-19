"use client";
import { FeaturedNewsListCard } from "@/component/blog/FeaturedNewsListCard";
import { useNewsList } from "@/services/blog/BlogQueries";
import { Blog } from "@/types/Blog";
import { useEffect, useState } from "react";

const FeaturedNewsList = () => {
  const [news, setNews] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const { data: newsListDatas, isLoading, error } = useNewsList();
  useEffect(() => {
    if (newsListDatas && !isLoading && !error) {
      console.log("newsListDatas", newsListDatas);
      setNews(newsListDatas.data || []);
      setCurrentPage(newsListDatas.meta?.current_page || 1);
      setTotalPages(newsListDatas.meta?.last_page || 1);
      setTotal(newsListDatas.meta?.total || 0);
      setPerPage(newsListDatas.meta?.per_page || 10);
    }
  }, [newsListDatas, isLoading, error]);

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
      {news.length ? (
        <>
          {news.filter((item) => item.category === "news").length > 0 ? (
            <div className="featured-news-grid">
              {news
                .filter((item) => item.category === "news")
                .slice(0, 3)
                .map((item, index) => (
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
        </>
      ) : (
        <div className="empty-state">
          <p>No headlines just yet.</p>
        </div>
      )}
    </div>
  );
};
export default FeaturedNewsList;
