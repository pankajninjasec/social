import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchPosts = async (query) => {
  const response = await axios.get(`http://localhost:8000/posts/search?query=${query}`);
  console.log(response)
  return response.data;
};

const SearchPosts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: posts, isLoading, isError } = useQuery(['searchPosts', searchQuery], () => fetchPosts(searchQuery), {
    enabled: searchQuery !== '',
  });


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
        <div className="w-1/2 pr-2">
            <div className="flex items-center bg-white shadow-md rounded-md p-2">
                <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border focus:border-gray-400"
                    onChange={(e)=>setSearchQuery(e.target.value)}
                />
            </div>
        </div>
  );
};

export default SearchPosts;
