import { useQuery } from 'react-query';
import Cookies from 'js-cookie';
import axios from 'axios';
import { myNewStore } from '../store/store';

interface UserData {
  id: string;
}

interface PostData {
  content:string;
}

const useUserData = () => {
  const jwtToken = Cookies.get('jwt');
  const { myStore , setMystore } = myNewStore();
  const token = myStore ? myStore : jwtToken;

  const fetchUser = async (): Promise<UserData> => {
    const response = await axios.get<UserData>('http://localhost:8000/api/user/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  const fetchUserPost = async ({ pageParam = 1 }): Promise<PostData[]> => {
    const response = await axios.get<PostData[]>(`http://localhost:8000/posts/mypost?page=${pageParam}&pageSize=5`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  const fetchPosts = async ({ pageParam = 1 }): Promise<PostData[]> => {
    const response = await axios.get<PostData[]>(`http://localhost:8000/posts/all?page=${pageParam}&pageSize=5`);
    return response.data;
  };

  const SearchfetchPosts = async (query: string): Promise<PostData[]> => {
    const response = await axios.get<PostData[]>(`http://localhost:8000/posts/search?query=${query}&pageSize=10`);
    return response.data;
  };

  return { fetchUser, fetchUserPost, fetchPosts, SearchfetchPosts };
};

export default useUserData;
