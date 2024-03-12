import React from 'react';
import axios from 'axios';
import { useMutation,useQueryClient } from 'react-query';
import Cookies from 'js-cookie';
import { myNewStore, usePostStore } from '@/services/store/store';
import toast from 'react-hot-toast';

const jwtToken = Cookies.get('jwt');


const DeletePost = (props) => {

    const { postStore , setPostStore } = usePostStore()
    const { myStore , setMystore } = myNewStore();
    const token = myStore ? myStore : jwtToken

    const queryClient = useQueryClient()
    const postId = props.post.id

    const deletePost = async () => {
    try {
        await axios.delete(`http://localhost:8000/posts/all/${postId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });

        toast.success('Post Deleted');
        queryClient.invalidateQueries([postStore])
        // queryClient.invalidateQueries(["allpost"])

    } catch (error) {

        toast.error('you cant delete this post!');
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
