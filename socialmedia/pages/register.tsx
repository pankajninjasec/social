import React, { useState } from 'react'
import Layout from '@/layouts/layout'
import { useMutation } from 'react-query';
import axios from 'axios';
import {useRouter} from "next/router";
import toast from 'react-hot-toast';


interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();


    const registerMutation = useMutation(
      async (formData: RegisterFormData) => {
        const response = await axios.post('http://localhost:8000/api/user/register', formData);
        return response.data;
      },
      {
        onSuccess: () => {
          toast.success('User created successfully')
          router.push('/login');
        },
      }
    );
  
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      registerMutation.mutate({ name, email, password });
    };


  return (
    <Layout>


      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        <div className="w-full p-6 bg-white lg:max-w-xl">
          <h1 className="text-3xl font-bold text-center text-gray-700">Social Media</h1>
          <form onSubmit={submit} className="mt-6"> 
              <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-800"
              >
                Name
              </label>
              <input
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border focus:border-gray-400"
                placeholder='Name'
                required onChange={e => setName(e.target.value)}
              />
            </div>


            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800"
              >
                Email
              </label>
              <input
                type="email"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border focus:border-gray-400"
                placeholder='Email'
                required onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800"
              >
                Password
              </label>
              <input
                type="password"
                className=" block w-full px-4 py-2 mt-2 text-gray-700 bg-white border focus:border-gray-400"
                placeholder='password'
                required onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <button className="w-full px-4 py-2 text-white bg-gray-700 rounded-md" type="submit">
                Register
              </button>
            </div>
          </form>

        </div>
      </div>

    </Layout>
  );
};

export default Register