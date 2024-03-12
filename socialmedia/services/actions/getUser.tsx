import { useQuery } from 'react-query';
import Cookies from 'js-cookie';
import axios from 'axios';

const jwtToken = Cookies.get('jwt');



export const fetchUser = async () => {
  const response = await axios.get('http://localhost:8000/api/user/user',{
    headers: {
        Authorization: `Bearer ${jwtToken}`

    },
  });
  return response.data;
};


export const fetchUserPost = async ({ pageParam = 1 }) => {
  const response = await axios.get(`http://localhost:8000/posts/mypost?page=${pageParam}&pageSize=5`,{
    headers: {
        Authorization: `Bearer ${jwtToken}`

    },
  });
  return response.data;
};

