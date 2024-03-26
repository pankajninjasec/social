import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { myNewStore, useAuthStore, usePostStore } from '@/services/store/store';
import { Post } from '@/types/type';


const jwtToken: string | undefined = Cookies.get('jwt');

const EditPostPopup: React.FC<{ post: Post }> = (props) => {
    const { postStore } = usePostStore();
    const queryClient = useQueryClient();
    const post = props.post;
    const [content, setContent] = useState(post.content);
    const [showPopup, setShowPopup] = useState(false);
    const { myStore } = myNewStore();
    const token: string | undefined = myStore ? myStore : jwtToken;
    const updatePostMutation = useMutation(
        (newContent: string) =>
            axios.put(`http://127.0.0.1:8000/posts/all/${post.id}`, { content: newContent }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
    );

    const handleEdit = async () => {
        try {
            if (!token) throw new Error('Authentication token not found');
            await updatePostMutation.mutateAsync(content);
            toast.success('Post updated successfully');
            queryClient.invalidateQueries([postStore]);
        } catch (error) {
            const errorMessage: string = (error as AxiosError).response?.data?.message || 'An error occurred';
            toast.error(errorMessage);
        }
    };

    return (
        <>
            <button onClick={() => setShowPopup(true)} className="bg-green-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded m-4">Edit Post</button>
            {showPopup && (
                <div className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-headline"
                        >
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                            Edit Post
                                        </h3>
                                        <div className="mt-2">
                                            <textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                className="w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={handleEdit}
                                    disabled={updatePostMutation.isLoading}
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                                        updatePostMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {updatePostMutation.isLoading ? 'Updating...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditPostPopup;
