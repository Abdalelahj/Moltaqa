import React, { useState, useEffect } from "react";
import axios from "axios";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

const Like = ({ postId }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [likedBy, setLikedBy] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch likes data
  const fetchLikes = async () => {
    try {
      const response = await axios.get(
        `https://moltaqa-it.onrender.com/reacts/${postId}/likes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLikesCount(response.data.count);
      setLikedBy(response.data.users);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  // Toggle like status
  const toggleLike = async () => {
    try {
      const response = await axios.post(
        `https://moltaqa-it.onrender.com/reacts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        // After the "like" action, fetch the updated like data
        fetchLikes(); 
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [postId]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Like button */}
      <button
        onClick={toggleLike}
        onMouseEnter={() => setShowUsers(true)}
        onMouseLeave={() => setShowUsers(false)}
        style={{
          background: "none",
          border: "none",
          color: isLiked ? "red" : "gray",
          cursor: "pointer",
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isLiked ? (
          <HeartFilled style={{ fontSize: "1.5rem", color: "red" }} />
        ) : (
          <HeartOutlined style={{ fontSize: "1.5rem", color: "gray" }} />
        )}

        <span style={{ marginLeft: "8px", fontSize: "1.2rem", color: "black" }}>
          Like
        </span>

        <span style={{ marginLeft: "8px", fontSize: "1.2rem", color: "black" }}>
          ({likesCount})
        </span>
      </button>

      {/* Show users who liked the post */}
      {showUsers && likedBy.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            backgroundColor: "white",
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "200px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
          }}
        >
          <p style={{ margin: "0", fontWeight: "bold" }}>Liked by:</p>
          <ul
            style={{
              listStyleType: "none",
              paddingLeft: "0",
              marginTop: "5px",
            }}
          >
            {likedBy.map((username, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {username}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Like;
