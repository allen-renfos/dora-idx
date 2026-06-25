import axiosInstance from "../Api";

export const fetchUserProfile = async () => {

  const response = await axiosInstance.get(`/customer/profile`);
  return response.data;
}
export const fetchUserWhishlist = async () => {

  const response = await axiosInstance.get(`/v1/customer/property/wishlist?lagnt=${process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID}`);
  return response.data;
}
export const postUserPropertyWishlist = async (data: object) => {

  const response = await axiosInstance.post(`/v1/property/wishlist?lagnt=${process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID}`, data);
  return response.data;
}
export const postUserLogout = async () => {

  const response = await axiosInstance.post(`/customer/logout`);
  return response.data;
}
export const removeWishlistItem = async (wishlistId: string) => {
  const response = await axiosInstance.delete(`/v1/customer/property/wishlist/${wishlistId}`);
  return response.data;
};

export const updateUserProfile = async (data: any) => {
  const lagnt = process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID || "";
  let payload = data;

  if (data instanceof FormData) {
    if (!data.has('lagnt')) data.append('lagnt', lagnt);
    if (!data.has('_method')) data.append('_method', 'PUT');
    payload = data;
  } else {
    payload = { ...data, lagnt, _method: 'PUT' };
  }

  const response = await axiosInstance.post('/customer/profile', payload, {
    headers: {
      'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
}