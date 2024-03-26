
export interface Post {
    id: string;
    content: string;
    likesCount: number;
    author: {
        name: string;
    };
    createdAt: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface UserData {
  id: string;
}

