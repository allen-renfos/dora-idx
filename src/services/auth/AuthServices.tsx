import axiosInstance from "../Api";

export const login = async (data:object) => {

    try {
       
      const response = await axiosInstance.post('/customer/login', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Explicit refresh (cookie-based). Returns the new token data or throws on 401.
  export const refreshAccessToken = async () => {
    const response = await axiosInstance.post('/customer/refresh');
    return response.data; // { access_token, expires_in }
  };

  export const register = async (data:object) => {

    try {
       
      const response = await axiosInstance.post('/customer/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
 export const forgetPassword = async (data:object) => {

    try {
       
      const response = await axiosInstance.post('customer/forgot-password', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const resetPassword = async (data: object) => {
    try {
      const response = await axiosInstance.post('/customer/reset', data, {
        params: data
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const changePassword = async (data: object) => {
    try {
      const response = await axiosInstance.post('/customer/reset', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

   export const postNewsLetter = async (data:object) => {

    try {
       
      const response = await axiosInstance.post(`/v1/newsletter`, data);
      // alert(response.data.message)
      return response.data;
    } catch (error) {
      throw error;
    }
  };
    export const postEnquiry = async (data:object) => {

    try {
       
      const response = await axiosInstance.post(`/v1/enquiry`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getSocialUrls = async (lagnt: string) => {
    try {
      const response = await axiosInstance.get(`/social_urls?lagnt=${lagnt}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };