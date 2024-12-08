const express = require("express");
const postsRouter = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  getPostByUser,
  updatePostById,
  SoftDeletePostById,
  hardDeletedPostById,
  getSavedPosts,
  savePost,
  removeFromSaved
} = require("../controllers/posts");
const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');

postsRouter.post('/' , authentication , createPost)
postsRouter.get('/' , authentication , getAllPosts)
postsRouter.get('/:post_id/post' , authentication , getPostById)
postsRouter.get('/:user_id/user' , authentication , getPostByUser)


postsRouter.get('/saved' , authentication , getSavedPosts)
postsRouter.post('/add&save/:id' , authentication , savePost)

postsRouter.put('/:post_id' , authentication , updatePostById)
postsRouter.delete('/:post_id/soft' , authentication , SoftDeletePostById)
postsRouter.delete('/:post_id/hard' , authentication , hardDeletedPostById)

postsRouter.delete('/savedTr/:id' , authentication , removeFromSaved)

module.exports = postsRouter;


/* https://moltaqa-it.onrender.com/posts
    Don't Forget the Token !!!!!!!!!!!
{
    "body":"test"
}
*/