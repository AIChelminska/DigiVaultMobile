import { useCurrentUser } from './useCurrentUser';

type StackNavigation = {
  navigate: (screen: string, params?: object) => void;
};

export function useAuthNavigation(navigation: StackNavigation) {
  const { isAuthenticated } = useCurrentUser();

  const requireAuth = (action: () => void) => {
    if (isAuthenticated) action();
    else navigation.navigate('Login');
  };

  return {
    isAuthenticated,
    onCartPress: () => requireAuth(() => navigation.navigate('Cart')),
    onNotificationsPress: () => requireAuth(() => navigation.navigate('Notifications')),
    requireAuth,
  };
}
