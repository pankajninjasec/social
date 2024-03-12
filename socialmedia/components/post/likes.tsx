import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { useMutation,useQueryClient } from 'react-query';
const jwtToken = Cookies.get('jwt');


import React, { FC } from 'react';
import axios from 'axios';
import { useJwtStore, usePostStore , myNewStore } from '@/services/store/store';


interface LikeCart {
    post: any;
}

const Likes = (props) => {
    const { postStore , setPostStore } = usePostStore();
    const { myStore , setMystore } = myNewStore();
    const token = myStore ? myStore : jwtToken
    const postId = props.post.id;
    const queryClient = useQueryClient()
    
    const likePost = async () => {
        try {
            await axios.put(`http://localhost:8000/posts/all/${postId}/like`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            toast.success('Liked');
            // queryClient.invalidateQueries(["allpost"])
            queryClient.invalidateQueries([postStore])

        } catch (error) {

            toast.error('login first!'); 
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

