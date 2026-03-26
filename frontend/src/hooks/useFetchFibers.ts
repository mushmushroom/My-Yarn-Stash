import { api } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

export default function useFetchFibers() {
  return useQuery({
    queryKey: ["fibers"],
    queryFn: api.getFibers,
  });
}
