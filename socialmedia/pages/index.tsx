
import React, { useEffect, useState } from 'react'
import Layout from '../layouts/layout'
import Post from '@/components/post/post'
import axios from 'axios'
import { useQuery, useQueryClient } from 'react-query'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast';
import { myNewStore, useAuthStore, useJwtStore, usePostStore } from '@/services/store/store'
import { useRouter } from 'next/router'
import useUserData from '@/services/actions/getUser'

const Home = () => {
  const router = useRouter();
  const { auth , setAuth } = useAuthStore()
  const { useJwt , setJwt } = useJwtStore()
  const { postStore , setPostStore } = usePostStore()
  const { myStore , setMystore } = myNewStore();
  const { fetchUser } = useUserData();

  const { data, isLoading, isError } = useQuery('userData', fetchUser);

  useEffect(() => {
    if (!isLoading && !isError && data && data.id){
      setAuth(true);
    }
  }, [data,isLoading]);



  return (
    <div>
      <Layout>
        <Post/>
      </Layout>
    </div>
  )
}

export default Home
