import React from 'react';
import axios, { AxiosError } from 'axios';
import { useQueryClient } from 'react-query';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { myNewStore, usePostStore } from '@/services/store/store';
import { Post } from '@/types/type';


const jwtToken: string | undefined = Cookies.get('jwt');

const DeletePost: React.FC<{ post: Post }> = (props) => {
    const { postStore } = usePostStore();
    const { myStore } = myNewStore();
    const token: string | undefined = myStore ? myStore : jwtToken;

    const queryClient = useQueryClient();
    const postId: string = props.post.id;

    const deletePost = async () => {
        try {
            if (!token) throw new Error('Authentication token not found');
            await axios.delete(`http://localhost:8000/posts/all/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success('Post Deleted');
            queryClient.invalidateQueries([postStore]);
        } catch (error) {
            const errorMessage: string = (error as AxiosError).response?.data?.message || 'An error occurred';
            toast.error(errorMessage);
        }
    };

    return (
        <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={deletePost}
        >
            Delete
        </button>
    );
};

export default DeletePost;
