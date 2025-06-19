import { authStore } from './store/store';
import { AuthDeps } from './types';

export const createAuthModule = async (deps: AuthDeps) => {
  const useAuthStore = await authStore(deps);

  return {
    useAuthStore,
  };
};

export { AuthScreen } from './screens/AuthScreen';
