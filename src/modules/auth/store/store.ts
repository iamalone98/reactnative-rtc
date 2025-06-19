import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthDeps } from '../types';

interface AuthState {
  token: string | null;
  login: () => Promise<void>;
}

export const authStore = async (deps: AuthDeps) => {
  return create<AuthState>()(
    persist(
      set => ({
        token: null,
        login: async () => {
          try {
            const newToken = await deps.apiModule.post<string>();

            if (newToken) {
              set({ token: newToken });
            }
          } catch (error) {
            console.log(error);
          }
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  );
};
