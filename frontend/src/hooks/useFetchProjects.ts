import { api } from '@/api/api';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';

export default function useFetchProjects() {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS,
    queryFn: api.getProjects,
  });
}
