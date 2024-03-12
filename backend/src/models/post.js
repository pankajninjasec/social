
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function createPost(userId, content) {
    try {
        const post = await prisma.post.create({
            data: {
                userId: userId,
                content: content,
            }
        });
        return post;
    } catch (error) {
        console.error('Error creating post:', error);
        throw new Error('Error creating post');
    }
}


module.exports = {
    createPost
};
