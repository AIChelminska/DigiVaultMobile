import { useQuery } from '@tanstack/react-query';
import {
  fetchPopularCourses,
  fetchNewestCourses,
  fetchTopRatedCourses,
  fetchCategories,
  fetchCourseSearch,
  fetchPurchasedCourses,
} from '../api/coursesApi';
import { useCurrentUser } from './useCurrentUser';

export const usePopularCourses = () =>
  useQuery({
    queryKey: ['courses', 'popular'],
    queryFn: fetchPopularCourses,
  });

export const useNewestCourses = () =>
  useQuery({
    queryKey: ['courses', 'newest'],
    queryFn: fetchNewestCourses,
  });

export const useTopRatedCourses = () =>
  useQuery({
    queryKey: ['courses', 'top-rated'],
    queryFn: fetchTopRatedCourses,
  });

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

export const usePurchasedCourses = () => {
  const { isAuthenticated } = useCurrentUser();

  return useQuery({
    queryKey: ['courses', 'purchased'],
    queryFn: fetchPurchasedCourses,
    enabled: isAuthenticated,
  });
};

export const useCourseSearch = (params: {
  search?: string;
  idCategory?: number;
  sortBy?: string;
}) =>
  useQuery({
    queryKey: ['courses', 'search', params],
    queryFn: () => fetchCourseSearch(params),
  });
