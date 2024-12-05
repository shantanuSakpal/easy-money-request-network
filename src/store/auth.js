import { create } from 'zustand'
import { persist } from 'zustand/middleware'


export const useAuthStore = create()(
    persist(
        (set) => ({
            isUserValid: false,
            setIsUserValid: (status) => set({ isUserValid: status }),
        }),
        {
            name: 'auth-storage',
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        }
    )
)
