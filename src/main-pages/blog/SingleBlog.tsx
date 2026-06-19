"use client";

import { SingleBlogBanner } from "@/component/blog/SingleBlogBanner";
import { SingleBlogContent } from "@/component/blog/SingleBlogContent";
import HomeNewsletter from "@/main-pages/home/HomeNewsletter";
import { useSingleBlog } from "@/services/blog/BlogQueries";
import { Blog } from "@/types/Blog";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import Link from "next/link";

const emptyBlog: Blog = {
  id: "",
  title: "",
  slug: "",
  content: "",
  status: "",
  created_at: "",
  updated_at: "",
  image: "",
  author: "",
  category: "",
  date: "",
  publishDate: "",
  subtitle: "",
  is_featured: false,
  isFeatured: false,
};

const SingleBlog = () => {
  const [blog, setBlog] = useState<Blog | undefined>();
  const params = useParams();
  const blogId =
    params && typeof params === "object" && "id" in params
      ? (params as { id: string }).id
      : undefined;
  const { data, isLoading, error } = useSingleBlog(blogId ?? "");

  useEffect(() => {
    if (data?.data) setBlog(data.data);
  }, [data]);

  return (
    <>
      <main className="bg-[var(--surface-ink)] text-[var(--ink)] min-h-screen">
        {isLoading ? (
          <BlogSkeleton />
        ) : error ? (
          <BlogError />
        ) : (
          <>
            <SingleBlogBanner blog={blog ?? emptyBlog} />
            <SingleBlogContent blog={blog ?? emptyBlog} />
          </>
        )}
      </main>
      <HomeNewsletter />
    </>
  );
};

function BlogSkeleton() {
  return (
    <div className="container-wide pt-32 pb-20 animate-pulse">
      <div className="h-[40vh] min-h-[260px] bg-[var(--surface-charcoal)] mb-10" />
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <div className="h-3 w-32 bg-[var(--surface-graphite)]" />
        <div className="h-10 w-full bg-[var(--surface-graphite)]" />
        <div className="h-5 w-[80%] bg-[var(--surface-graphite)]" />
        <div className="h-5 w-[60%] bg-[var(--surface-graphite)]" />
      </div>
    </div>
  );
}

function BlogError() {
  return (
    <div className="container-wide pt-40 pb-20 max-w-md mx-auto text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-[var(--gold-500)]/10 border border-[var(--gold-500)]/30 flex items-center justify-center mb-6">
        <FiAlertCircle size={24} className="text-[var(--gold-500)]" />
      </div>
      <h1 className="font-serif text-3xl mb-3">Article unavailable</h1>
      <p className="text-[var(--ink-faint)] mb-8 leading-relaxed">
        The article may have moved or been removed. Browse the journal for the
        latest writing.
      </p>
      <Link href="/blog" className="btn-gold-new">
        Read the journal
      </Link>
    </div>
  );
}

export default SingleBlog;
