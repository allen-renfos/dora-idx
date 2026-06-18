import axiosInstance from "../Api";
import { Enquiry } from "@/types/Enquiry";
export const fetchBlogList = async (data: { page?: number; per_page?: number; }) => {
    const response = await axiosInstance.get(`/v1/blogs?lagnt=${process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID}&page=${data.page}&per_page=${data.per_page}`);
    return response.data;
}
export const fetchNewsList = async () => {
    const response = await axiosInstance.get(`/v1/blog/featured/news?lagnt=${process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID}`);
    return response.data;
}
export const fetchArticleList = async () => {
    const response = await axiosInstance.get(`/v1/blogs?lagnt=${process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID}`);
    return response.data;
}
export const fetchSingleBlog = async (id: string) => {
    const response = await axiosInstance.get(`/v1/blog/${id}`);
    return response.data;
}
export const postEnquiry = async (enquiryData: Enquiry) => {
    const response = await axiosInstance.post(`/v1/enquiry`, enquiryData);
    return response.data;
}