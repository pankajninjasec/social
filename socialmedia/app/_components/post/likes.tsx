import React from 'react';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { usePostStore, myNewStore } from '@/services/store/store';
import { Post } from '@/types/type';


const jwtToken: string | undefined = Cookies.get('jwt');

interface LikesProps {
    post: Post;
}

const Likes: React.FC<LikesProps> = (props) => {
    const { postStore } = usePostStore();
    const { myStore } = myNewStore();
    const token: string | undefined = myStore ? myStore : jwtToken;
    const postId: string = props.post.id;
    const queryClient = useQueryClient();

    const likePost = async () => {
        try {
            if (!token) throw new Error('Authentication token not found');
            await axios.put(`http://localhost:8000/posts/all/${postId}/like`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success('Liked');
            queryClient.invalidateQueries([postStore]);
        } catch (error) {
            const errorMessage: string = (error as AxiosError).response?.data?.message || 'An error occurred';
            toast.error(errorMessage);
        }
    };

    return (
        <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={likePost}
        >
            Like {props.post.likesCount}
        </button>
    );
};

export default Likes;
