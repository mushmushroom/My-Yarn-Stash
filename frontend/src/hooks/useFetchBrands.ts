import { api } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

export default function useFetchBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: api.getBrands,
  });
}
