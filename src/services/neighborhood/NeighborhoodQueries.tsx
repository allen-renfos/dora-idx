"use client"
import { useQuery } from "@tanstack/react-query";
import { fetchNeighborhoodList } from "./NeighborhoodServices";

export const useNeighborhoodList = () => {
    return useQuery({ queryKey: ['neighborhoodlist', ], queryFn: () => 
       fetchNeighborhoodList() });
  };