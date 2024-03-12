import React, { useState } from 'react';
import axios from 'axios';
import { useMutation,useQueryClient } from 'react-query';

import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { myNewStore, usePostStore } from '@/services/store/store';

const jwtToken = Cookies.get('jwt');

const UploadPost = () => {
    const { postStore , setPostStore } = usePostStore()
    const queryClient = useQueryClient()
    const [content, setContent] = useState('');
    const { myStore , setMystore } = myNewStore();
    const token = myStore ? myStore : jwtToken
 


    const CreatepostData = async (postData) => {
        const response = await axios.post('http://localhost:8000/posts', postData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    };

    const createPostMutation = useMutation(CreatepostData);

    const handlePost = async () => {
        try {
            await createPostMutation.mutateAsync({ content });
            setContent('');
            // queryClient.invalidateQueries(["allpost"])
            queryClient.invalidateQueries(postStore)
            toast.success('Post uploaded')

        } catch (error) {
            toast.error('Post upload failed')
        }
    };

    

    return (
        <div className="bg-white shadow-md rounded-md p-4 mb-4">
            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="What's on your mind?"
                    className="flex-grow px-4 py-2 outline-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <div className="flex justify-end">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    onClick={handlePost}
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default UploadPost;
