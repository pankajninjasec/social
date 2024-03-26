import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { myNewStore, usePostStore } from '@/services/store/store';

const jwtToken = Cookies.get('jwt');

interface PostData {
    content: string;
}

const UploadPost: React.FC = () => {
    const { postStore, setPostStore } = usePostStore();
    const queryClient = useQueryClient();
    const [content, setContent] = useState<string>('');
    const { myStore, setMystore } = myNewStore();
    const token: string | undefined = myStore ? myStore : jwtToken;

    const createPostMutation = useMutation<PostData, Error, PostData>(
        (postData) =>
            axios.post('http://localhost:8000/posts', postData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }),
        {
            onSuccess: () => {
                setContent('');
                queryClient.invalidateQueries(postStore);
                toast.success('Post uploaded');
            },
            onError: () => {
                toast.error('Post upload failed');
            }
        }
    );

    const handlePost = async () => {
        try {
            await createPostMutation.mutateAsync({ content });
        } catch (error) {
            console.error('Error uploading post:', error);
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
