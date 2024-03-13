import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import axios from 'axios';
import Delete from './delete';
import Likes from './likes';
import { toast } from 'react-hot-toast';
import EditPostPopup from './editPost';
import UploadPost from './uploadpost';
import useDebounce from '@/hooks/useDebounce'
import {myNewStore, useAuthStore, useJwtStore, usePostStore} from '@/services/store/store'
import { useInView } from 'react-intersection-observer';
import Cookies from 'js-cookie';
import router from 'next/router';
import SearchPosts from './search';
import useUserData from '@/services/actions/getUser';



const Post = () => {
  const { fetchUserPost , fetchPosts , SearchfetchPosts } = useUserData();
  const { ref , inView } = useInView();
  const { auth , setAuth } = useAuthStore()
  const { postStore , setPostStore } = usePostStore();
  const { myStore , setMystore } = myNewStore();
  const { useJwt , setJwt } = useJwtStore()
  const [searchQuery, setSearchQuery] = useState('');
  const jwtToken = Cookies.get('jwt');
  const debouncedSearchTerm = useDebounce(searchQuery, 200)
  const [fetchingUserPosts, setFetchingUserPosts] = useState(false);
  const searchInputRef = useRef(null);
  const token = myStore ? myStore : jwtToken



  // const { data: posts, isLoading, isError, refetch } = useQuery(
  //   fetchingUserPosts ? 'userposts' : 'allpost',
  //   fetchingUserPosts ? fetchUserPost : fetchPosts,
  //   {
  //     enabled: !searchQuery,
  //   }
  // );


  const {
    isLoading,
    isError,
    error,
    refetch,
    data:posts,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage
} = useInfiniteQuery( fetchingUserPosts ? 'userposts' : 'allpost', fetchingUserPosts ? fetchUserPost : fetchPosts , {
    getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length ? allPages.length + 1 : undefined;
        return nextPage
    },
    enabled: !searchQuery,
})




  const { data: searchResults, isLoading: searchLoading, isError: searchError } = useQuery(
    ['searchPosts', debouncedSearchTerm],
    () => SearchfetchPosts(debouncedSearchTerm),

    {
      enabled: !!searchQuery,
    }
  );




  const handleAllPostsClick = () => {
    setFetchingUserPosts(false);
    setPostStore('allpost');
    setSearchQuery('');
    refetch();
  };

  const handleMyPostsClick = () => {
    if(!auth){
      router.push('/login');
    }
    setFetchingUserPosts(true);
    setPostStore('userposts');
    setSearchQuery('');
    refetch();
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };


  useEffect(() => {
    if (searchQuery.length >= 2){
      setPostStore('searchPosts');
    }
    else{
      if(fetchingUserPosts){
        setPostStore('userposts')
      }
      else{
        setPostStore('allpost')
      }
    }
    if (searchResults && searchResults.length > 0) {
      searchInputRef.current.focus();
    }
    if (inView && hasNextPage){
      fetchNextPage();
    }
  }, [searchResults,inView, hasNextPage , fetchNextPage]);



  if (isLoading || searchLoading) return <div>Loading...</div>;
  if (isError || searchError) return <div>Error fetching data</div>;

  return (
    <>
      <div className="flex">
        <div className="w-1/2 pr-2">
          <div className="flex items-center bg-white shadow-md rounded-md p-2">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border focus:border-gray-400"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
        <div className="w-1/4 pl-2 p-4">
          <button onClick={handleAllPostsClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full">
            All Posts
          </button>
        </div>
        <div className="w-1/4 pl-2 p-4">
          <button onClick={handleMyPostsClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full">
            My Posts
          </button>
        </div>
      </div>

      <UploadPost />

      {searchQuery ? (
        <>
          <h2>Search Results for "{searchQuery}":</h2>
          {searchResults.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-md p-4 mb-4">
              <div className="flex items-center mb-2">
                <img
                  src="https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                  <div className="font-bold">{post.author.name}</div>
                  <div className="text-gray-500">{post.createdAt}</div>
                </div>
              </div>
              <div className="mb-4">{post.content}</div>
              <Likes post={post} />
              <EditPostPopup post={post} />
              <Delete post={post} />
            </div>
          ))}
        </>
      ) : (
        <>
          {posts.pages.map((page, index) => (
            <div key={index} className="post-wrapper">
              {page.map((post) => (
              <div key={post.id} className="bg-white shadow-md rounded-md p-4 mb-4">
                <div className="flex items-center mb-2">
                  <img
                    src="https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg"
                    alt="Avatar"
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <div>
                    <div className="font-bold">{post.author.name}</div>
                    <div className="text-gray-500">{post.createdAt}</div>
                  </div>
                </div>
                <div className="mb-4">{post.content}</div>
                <Likes post={post} />
                <EditPostPopup post={post} />
                <Delete post={post} />
              </div>

              ))}
            </div>
          ))}
            <button className="bg-green-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded m-4" ref={ref} disabled onClick={fetchNextPage}>{ isFetchingNextPage ? 'loading ... '  : 'Reached End'}</button>
            <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>



        </>
      )}
    </>
  );
};

export default Post;


