export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
    // meta: BlogMeta;
    image: string;
    author: string;
    category: string;
    date: string;
    publishDate: string;
    subtitle: string;
    is_featured: boolean;
    isFeatured: boolean;
}