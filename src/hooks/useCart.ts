import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCart, addToCart, removeFromCart } from '../api/cartApi';
import { useCurrentUser } from './useCurrentUser';

export const useCart = () => {
  const { isAuthenticated } = useCurrentUser();

  return useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: isAuthenticated,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
};