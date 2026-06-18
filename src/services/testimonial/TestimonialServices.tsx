import axiosInstance from "../Api";
export const  fetchTestimonialsList =async (page:number) =>{
    const response = await axiosInstance.get(`/v1/testimonials?page=${page}&lagnt=${process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID}`);
    return response.data;
}

// Admin testimonial endpoints (authenticated user)
export const fetchUserTestimonial = async () => {
    const response = await axiosInstance.get(`/v1/admin/testimonial`);
    return response.data;
}

export const postUserTestimonial = async (data: { name: string; details: string; rating?: number }) => {
    const response = await axiosInstance.post(`/v1/admin/testimonial`, data);
    return response.data;
}