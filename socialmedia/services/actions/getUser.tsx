import { useQuery } from 'react-query';
import Cookies from 'js-cookie';
import axios from 'axios';
import { myNewStore } from '../store/store';


const useUserData = () => {

  const jwtToken = Cookies.get('jwt');
  const { myStore , setMystore } = myNewStore()
  const token = myStore ? myStore : jwtToken


  const fetchUser = async () => {
    const response = await axios.get('http://localhost:8000/api/user/user',{
      headers: {
          Authorization: `Bearer ${token}`

      },
    });
    return response.data;
  };


  const fetchUserPost = async ({ pageParam = 1 }) => {
    const response = await axios.get(`http://localhost:8000/posts/mypost?page=${pageParam}&pageSize=5`,{
      headers: {
          Authorization: `Bearer ${token}`

      },
    });
    return response.data;
  };

  const fetchPosts = async ({ pageParam = 1 }) => {
    const response = await axios.get(`http://localhost:8000/posts/all?page=${pageParam}&pageSize=5`);
    return response.data;
  };


  const SearchfetchPosts = async (query) => {
    const response = await axios.get(`http://localhost:8000/posts/search?query=${query}&pageSize=10`);
    return response.data;
  };



  return {fetchUser, fetchUserPost, fetchPosts,SearchfetchPosts}

}

export default useUserData;


