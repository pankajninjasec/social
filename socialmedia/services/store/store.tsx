import create from 'zustand';

interface AuthStoreState {
  auth: boolean;
  setAuth: (newValue: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  auth: false,
  setAuth: (newValue) => set({ auth: newValue }),
}));

interface PostStoreState {
  postStore: string;
  setPostStore: (newValue: string) => void;
}

export const usePostStore = create<PostStoreState>((set) => ({
  postStore: '',
  setPostStore: (newValue) => set({ postStore: newValue }),
}));

interface JwtStoreState {
  getJwt: string;
  setJwt: (newValue: string) => void;
}

export const useJwtStore = create<JwtStoreState>((set) => ({
  getJwt: '',
  setJwt: (newValue) => set({ getJwt: newValue }),
}));

interface MyNewStoreState {
  myStore: string;
  setMystore: (newValue: string) => void;
}

export const myNewStore = create<MyNewStoreState>((set) => ({
  myStore: '',
  setMystore: (newValue) => set({ myStore: newValue }),
}));
