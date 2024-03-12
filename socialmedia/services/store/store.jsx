import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  auth: false,
  setAuth: (newValue) => set({ auth: newValue }),
}));


export const usePostStore = create((set) => ({
  postStore: '',
  setPostStore: (newValue) => set({ postStore: newValue }),
}));


export const useJwtStore = create((set) => ({
  getJwt: '',
  setJwt: (newValue) => set({ getJwt: newValue }),
}));


export const myNewStore = create((set) => ({
  myStore: '',
  setMystore: (newValue) => set({ myStore: newValue }),
}));


