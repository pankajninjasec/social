const express = require('express');
const router = express.Router();
const { searchPosts , createPost , getAllPosts , deletePost , editPost , getPostsByUser , likePost } = require('../controllers/postController');

router.post('/', createPost);
router.get('/all', getAllPosts);
router.delete('/all/:postId', deletePost);
router.put('/all/:postId', editPost);
router.get('/mypost', getPostsByUser);
router.put('/all/:postId/like', likePost);
router.get('/search',searchPosts)


module.exports = router;
