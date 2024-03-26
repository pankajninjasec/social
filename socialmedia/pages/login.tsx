import React, { useState } from 'react';
import Layout from '../app/layout';
import { useMutation , useQueryClient } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'
import toast from 'react-hot-toast';
import { myNewStore, useAuthStore, useJwtStore } from '@/services/store/store';
import { LoginFormData } from '@/types/type';


const Login = () => {
  const { auth , setAuth } = useAuthStore()
  const { myStore , setMystore } = myNewStore();
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const loginMutation = useMutation(
    async (formData: LoginFormData) => {
      const response = await axios.post('http://localhost:8000/api/user/login', formData, { withCredentials: true });
      const jwtoken = response.data.token
      setMystore(jwtoken)
      Cookies.set('jwt', response.data.token, { expires: 7, secure: true });
      return response.data;
    },
    {
      onSuccess: () => {
        setAuth(true)
        toast.success('Your are logged in')
        queryClient.invalidateQueries('allpost')
        queryClient.invalidateQueries('getuser')
        router.push('/');
      },
    }
  );


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };


  return (
    <Layout>
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <div className="w-full p-6 bg-white lg:max-w-xl">
          <h1 className="text-3xl font-bold text-center text-gray-700">Login</h1>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                Email
              </label>
              <input
                type="email"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border focus:border-gray-400"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                Password
              </label>
              <input
                type="password"
                className=" block w-full px-4 py-2 mt-2 text-gray-700 bg-white border focus:border-gray-400"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <button className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
