const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PostModel = require('../models/post');
const jwt = require('jsonwebtoken');
require('dotenv').config();


async function createPost(req, res) {
    const { content } = req.body;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

    try {
        const { _id } = jwt.verify(token, process.env.SECRET_KEY);
        console.log('createpost calling ')
        console.log(_id)
        
        const post = await PostModel.createPost(_id, content);
        
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// async function getAllPosts(req, res) {
//     try {
//         const posts = await prisma.post.findMany({
//             include: {
//                 author: {
//                     select: {
//                         name: true
//                     }
//                 }
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             }
//         });
//         res.json(posts);
//     } catch (error) {
//         console.error('Error retrieving posts:', error);
//         res.status(500).json({ message: 'Error retrieving posts' });
//     }
// }



async function getAllPosts(req, res) {
    try {
        const { page = 1, pageSize = 10 } = req.query;

        const offset = (page - 1) * pageSize;

        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: offset,
            take: parseInt(pageSize)
        });

        res.json(posts);
    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ message: 'Error retrieving posts' });
    }
}



async function searchPosts(req, res) {
    try {
        const { query , page = 1, pageSize = 10 } = req.query;

        const offset = (page - 1) * pageSize;

        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { content: { contains: query } },
                    { author: { name: { contains: query } } }
                ]
            },
            include: {
                author: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: offset,
            take: parseInt(pageSize)
        });

        res.json(posts);
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).json({ message: 'Error searching posts' });
    }
}



async function getPostsByUser(req, res) {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const { _id } = jwt.verify(token, process.env.SECRET_KEY);
        userId = _id;

        const { page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            where: { userId: userId },
            skip: offset,
            take: parseInt(pageSize),
        });
        res.json(posts);
    } catch (error) {
        console.error('Error retrieving posts by user:', error);
        res.status(500).json({ error: 'Error retrieving posts by user' });
    }
}

async function deletePost(req, res) {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        const { _id } = jwt.verify(token, process.env.SECRET_KEY);
        const postId = req.params.postId;
        userId = _id;

        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
            select: { userId: true }
        });

        if (!post || post.userId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }

        await prisma.post.delete({
            where: { id: parseInt(postId) }
        });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Error deleting post' });
    }
}

async function editPost(req, res) {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        const { _id } = jwt.verify(token, process.env.SECRET_KEY);
        const postId = req.params.postId;
        const content = req.body.content;
        userId = _id;

        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
            select: { userId: true }
        });

        if (!post || post.userId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to edit this post' });
        }

        const updatedPost = await prisma.post.update({
            where: { id: parseInt(postId) },
            data: { content }
        });

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error editing post:', error);
        res.status(500).json({ error: 'Error editing post' });
    }
}

async function likePost(req, res) {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        const { _id } = jwt.verify(token, process.env.SECRET_KEY); 
        const postId = parseInt(req.params.postId);
        userId = _id;

        // Check if user has already liked the post
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { likedBy: { where: { id: userId } } }
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        let updatedPost;
        if (post.likedBy.length > 0) {
            // User already liked the post, so dislike it
            updatedPost = await prisma.post.update({
                where: { id: postId },
                data: {
                    likesCount: {
                        decrement: 1
                    },
                    likedBy: {
                        disconnect: { id: userId }
                    }
                },
                include: { likedBy: true }
            });
        } else {
            // User hasn't liked the post, so like it
            updatedPost = await prisma.post.update({
                where: { id: postId },
                data: {
                    likesCount: {
                        increment: 1
                    },
                    likedBy: {
                        connect: { id: userId }
                    }
                },
                include: { likedBy: true }
            });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error('Error liking/disliking post:', error);
        res.status(500).json({ error: 'Error liking/disliking post' });
    }
}

module.exports = { createPost, getAllPosts, getPostsByUser, deletePost, editPost, likePost , searchPosts };
