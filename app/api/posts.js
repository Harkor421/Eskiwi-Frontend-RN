import client from './client';

// Get latest posts
const getLatestPosts = (page) => {
  return client.get(`/posts/getLatestPosts/${page}`);
};

// Get latest user posts
const getLatestUserPosts = (userID, page) => {
  return client.get(`/posts/getLatestUserPosts/${userID}/${page}`);
};

const getRecommendedUserPosts = (page) => {
  return client.get(`/posts/getRecommended/${page}`);
};


const getPost = (postID) => {
  return client.get(`/posts/getPost/${postID}`);
};


const sharePost = (post_id) => {
  return client.post(`/posts/sharePost`, {post_id});
};


const deletePost = (postID) => {
  return client.delete(`/posts/createPost/${postID}`);
};



// Create a post with multipart/form-data
const createPost = async (formData) => {
  try {
    const response = await client.post('/posts/createPost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// Like a post
const likePost = (post_id) => {
  return client.post(`/posts/likePost`, { post_id });
};

// Unlike a post
const unlikePost = (post_id) => {
  return client.delete(`/posts/likePost/${post_id}`);
};

// Like a comment
const likeComment = (comment_id) => {
  return client.post(`/posts/likeComment`, { comment_id });
};

// Unlike a comment
const unlikeComment = (comment_id) => {
  return client.delete(`/posts/likeComment/${comment_id}`);
};

const getCommentLike = (comment_id) => {
  return client.get(`/posts/getUserCommentLike/${comment_id}`);
};

// Get user like status
const getUserLike = (post_id) => {
  return client.get(`/posts/getUserLike/${post_id}`);
};

// Get comments on a post
const getComments = (post_id, page) => {
  return client.get(`/posts/getLatestComments/${post_id}/${page}`);
};

// Post a comment on a post
const postComment = (post_id, text, gems) => {
  return client.post(`/posts/createComment`, { post_id, text, gems });
};

const deleteComment = (comment_id) => {
  return client.delete(`/posts/createComment/${comment_id}`);
};

// Get replies to a comment
const getReplies = (comment_id, page) => {
  return client.get(`/posts/getLatestReplies/${comment_id}/${page}`);
};

// Reply to a comment
const replyToComment = (body) => {
  return client.post(`/posts/createReply`, body);
};

export default {
  getLatestPosts,
  getLatestUserPosts,
  createPost,
  getPost,
  likePost,
  unlikePost,
  getUserLike,
  getComments,
  postComment,
  getReplies,
  replyToComment,
  likeComment,
  unlikeComment,
  getCommentLike,
  deletePost,
  deleteComment,
  getRecommendedUserPosts,
  sharePost,
};
