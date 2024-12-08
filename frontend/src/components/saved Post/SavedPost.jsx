import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./savePost.css";
import moment from "moment-timezone";

const SavedPost = () => {
  
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
    const formatRelativeTime = (timestamp) => {
      const date = new Date(timestamp);
      const offset = date.getTimezoneOffset();
      date.setMinutes(date.getMinutes() - offset);
      const localTime = moment.utc(date);
  
      return localTime.fromNow();
    };
  useEffect(() => {
    axios
      .get("https://moltaqa-it.onrender.com/posts/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setPosts(result.data.saved_posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleClick = (id) => {
    navigate(`/home/comments/${id}`);
  };

  const handleRemove = (id) => {
    axios
      .delete(`https://moltaqa-it.onrender.com/posts/savedTr/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const removed = posts.filter((post) => post.post_id !== id);
        setPosts(removed);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="saved-posts-container">
      <h2 className="title">Saved Posts</h2>
      {posts.length ? (
        posts.map((post) => (
          <div key={post.saved_post_id} className="post-card">
            <div className="post-header">
              <div className="user-info">
                <img
                  src={post?.profile_image}
                  alt="Profile"
                  className="profile-image"
                />
                <span className="username">@{post.user_name}</span>
              </div>
              <button
                className="remove-btn"
                onClick={() => handleRemove(post.post_id)}
              >
                ✕ Remove
              </button>
            </div>
            <div
              className="post-content"
             onClick={(e)=>{
              navigate('/home')
             }}
            >
              <p className="post-body">{post.body}</p>
              <p className="saved-at">Saved at {formatRelativeTime(post.saved_at)}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="no-posts">No saved posts</p>
      )}
    </div>
  );
};

export default SavedPost;
