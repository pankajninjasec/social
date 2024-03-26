import React, { useEffect } from 'react';
import Layout from '../app/layout';
import Post from '../app/_components/post/post';
import axios from 'axios';
import { useQuery } from 'react-query';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { myNewStore, useAuthStore } from '@/services/store/store';
import { useRouter } from 'next/router';
import useUserData from '@/services/actions/getUser';
import { UserData } from '@/types/type';


const Home: React.FC = () => {
  const router = useRouter();
  const { auth, setAuth } = useAuthStore();
  const { fetchUser } = useUserData();
  const { data, isLoading, isError } = useQuery<UserData>('userData', fetchUser);

  useEffect(() => {
    if (!isLoading && !isError && data && data.id) {
      setAuth(true);
    }
  }, [data, isLoading, isError, setAuth]);

  return (
    <div>
      <Layout>
        <Post />
      </Layout>
    </div>
  );
};

export default Home;
