
import React, { useEffect, useState } from 'react'
import Layout from '../layouts/layout'
import Post from '@/components/post/post'
import axios from 'axios'
import { useQuery, useQueryClient } from 'react-query'
import { fetchUser } from '@/services/actions/getUser'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast';
import { myNewStore, useAuthStore, useJwtStore, usePostStore } from '@/services/store/store'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter();
  const { auth , setAuth } = useAuthStore()
  const { useJwt , setJwt } = useJwtStore()
  const { postStore , setPostStore } = usePostStore()
  const { myStore , setMystore } = myNewStore();


  return (
    <div>
      <Layout>
      {/* {users ? users.name : <></>}  */}
        <Post/>
      </Layout>
    </div>
  )
}

export default Home
