import React, { useEffect, useState } from "react";
import "./posts.css";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button } from "antd";
import axios from "axios";
import { deletePost, setPosts } from "../../redux/reducers/slicePosts";
import { useNavigate } from "react-router-dom";
import AdminComments from "./adminComments/AdminComments";
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

const AdminPosts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [id, setId] = useState("");

  const token = localStorage.getItem("token");
  const posts = useSelector((posts) => {
    return posts.posts.posts;
  });

  useEffect(() => {
    axios
      .get("https://moltaqa-it.onrender.com/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(setPosts(res.data.Posts));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [posts]);

  const handelDelete = (postId) => {
    axios
      .delete(`https://moltaqa-it.onrender.com/posts/${postId}/soft`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(deletePost({ post_id: postId }));
        success();
        return res;
      })
      .catch((err) => {
        console.error(err);
        error();
        return err;
      });
  };
  const handelHardDelete = (postId) => {
    axios
      .delete(`https://moltaqa-it.onrender.com/posts/${postId}/hard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(deletePost({ post_id: postId }));
        success();
        return true;
      })
      .catch((err) => {
        console.error(err);
        error();
        return false;
      });
  };

  const handleCloseComments = () => {
    setIsVisible(false);
    setId(null);
  };

  const showPromiseConfirmSoftDeleted = (id) => {
    confirm({
      title: "Do you want to delete this post?",
      icon: <ExclamationCircleFilled />,
      content:
        "When clicked the OK button, this post will be disappeared from user posts but as an admin you can retrieve it later.",
      onOk() {
        return new Promise((resolve, reject) => {
          return setTimeout(handelDelete(id) ? resolve : reject, 1500);
        }).catch(() => console.log("Oops errors!"));
      },
      onCancel() {},
    });
  };
  const showPromiseConfirmHardDeleted = (id) => {
    confirm({
      title: "Do you want to delete this post?",
      icon: <ExclamationCircleFilled />,
      content:
        "When clicked the OK button, this post will be deleted permanently",
      onOk() {
        return new Promise((resolve, reject) => {
          return setTimeout(handelHardDelete(id) ? resolve : reject, 1500);
        }).catch(() => console.log("Oops errors!"));
      },
      onCancel() {},
    });
  };
  const error = () => {
    Modal.error({
      title: "Error",
      content: "Failed to delete post",
    });
  };
  const success = () => {
    Modal.success({
      content: "Post deleted successfully",
    });
  };
  return (
    <div className="parentPostAdmin">
      {posts?.map((post, index) => (
        <div key={index} className="postAdmin">
          <div className="postHeaderAdmin">
            {post.profile_image ? (
              <Avatar
                src={post.profile_image}
                className="post-avatar"
                onClick={() => {
                  navigate(`/home/profile/${post.user_id}`);
                }}
              />
            ) : (
              <Avatar icon={<UserOutlined />} className="post-avatar" />
            )}

            <h3>{post.user_name}</h3>
          </div>
          <div className="postContentAdmin">
            <p>{post.body}</p>

            <div>
              <Button
                onClick={(e) => {
                  showPromiseConfirmSoftDeleted(post.post_id);
                }}
              >
                Soft DELETE
              </Button>
              <Button
                onClick={() => {
                  showPromiseConfirmHardDeleted(post.post_id);
                }}
              >
                Hard DELETE
              </Button>
              <Button
                onClick={() => {
                  setIsVisible(true);
                  // navigate(`./comments/${post.post_id}`);
                  setId(post.post_id);
                }}
              >
                Show comments
              </Button>
            </div>
        </div>
          {isVisible && <AdminComments id={id} isVisible={isVisible} handleCloseComments={handleCloseComments} />}
          </div>
      ))}
    </div>
  );
};

export default AdminPosts;
