import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTestimonialsList, fetchUserTestimonial, postUserTestimonial } from './TestimonialServices';
export const useTestimonialsList = (page:number) => {
    return useQuery({ queryKey: ['testimonialslist', ], queryFn: () =>  
      fetchTestimonialsList(page) });
  };

export const useUserTestimonial = () => {
    return useQuery({
        queryKey: ['userTestimonial'],
        queryFn: () => fetchUserTestimonial(),
        retry: false,
    });
};

export const usePostTestimonial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { name: string; details: string; rating?: number }) => postUserTestimonial(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userTestimonial'] });
        }
    });
};