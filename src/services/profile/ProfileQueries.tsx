import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile, fetchUserWhishlist, updateUserProfile, removeWishlistItem } from "./ProfileServices";
import { isAuthenticated } from "@/services/auth/authStorage";

export const useProfile = () => {
   return useQuery({
      queryKey: ['profileInfo',], queryFn: () =>
         fetchUserProfile(),
      enabled: typeof window !== 'undefined' && isAuthenticated(),
   });
};
export const useUserWishlist = () => {
   return useQuery({
      queryKey: ['userWishlistInfo',], queryFn: () =>
         fetchUserWhishlist(),
      enabled: typeof window !== 'undefined' && isAuthenticated(),
   });
};

export const useRemoveWishlistItem = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (id: string) => removeWishlistItem(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['userWishlistInfo'] });
      },
   });
};

export const useUpdateProfile = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (data: any) => updateUserProfile(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['profileInfo'] });
      }
   });
};