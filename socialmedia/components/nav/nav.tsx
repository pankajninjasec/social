import React from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast';
import { myNewStore, useAuthStore } from '@/services/store/store';
import router from 'next/router';
import { useQueryClient } from 'react-query';


const Nav = () => {
  const { auth , setAuth } = useAuthStore()
  const { myStore , setMystore } = myNewStore()

  const queryClient = useQueryClient()

  function logout() {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    toast.success('Your logged out!')
    setMystore('logout')
    setAuth(false);
    // queryClient.invalidateQueries("allpost")
  }

  return (

      <div className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white font-bold">Social Media</div>
      <div className="space-x-4">
        <Link
            href="/"
              className={"text-white hover:text-gray-300"}
            >
              Home
        </Link>
        {auth ? (
          <>
              <button onClick={logout} className='text-white'>Logout</button>
          </>
        ): (

          <>
              <Link
                  href="/login"
                    className={"text-white hover:text-gray-300"}
                  >
                    Login
              </Link>
              <Link
                  href="/register"
                    className={"text-white hover:text-gray-300"}
                  >
                    Register
              </Link>
          </>

        )}
         
      </div>
    </div>
    
  )
}

export default Nav