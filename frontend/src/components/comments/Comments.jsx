import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { setComments } from "../redux/reducers/sliceComments";
import "./comments.css";
import { useNavigate,useParams } from "react-router-dom";
import { Avatar, Button, Card, Input, List, Space } from "antd";
import { Modal } from 'antd';
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;



const Comments = () => {
  const [editingText, setEditingText] = useState("");
  const [newComment, setNewComment] = useState("");
  const posts = useSelector((reducer) => {
    
    return reducer.posts.posts;
  });

  
  const postIdByParams=useParams().id
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const postId = localStorage.getItem("postId") || postIdByParams;
  
  const post = posts.filter((elem, ind) => {
    return elem.post_id == postId;
  });

  const dispatch = useDispatch();
  const comments = useSelector((reducers) => {
    return reducers.comments.comments;
  });
  useEffect(() => {
    axios
      .get(`https://moltaqa-it.onrender.com/comments/${postId}/post`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(setComments(res.data.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [comments]);

  const handleComment = (e) => {
    
    axios
      .post(
        `https://moltaqa-it.onrender.com/comments/${postId}`,
        {
          comment: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setNewComment('')
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditComment = (commentId) => {
    axios
      .put(
        `https://moltaqa-it.onrender.com/comments/${commentId}`,
        {
          comment: editingText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setEditingCommentId(null);
        setEditingText("");
        const updatedComments = comments.map((comment) =>
          comment.comment_id === commentId
            ? { ...comment, comment: res.data.updatedComment.comment }
            : comment
        );
        dispatch(setComments(updatedComments));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteComment = (commentId) => {
    axios
      .delete(`https://moltaqa-it.onrender.com/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const filteredComments = comments.filter(
          (comment) => comment.comment_id !== commentId
        );
        dispatch(setComments(filteredComments));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const showPromiseConfirmSoftDeleted = (id) => {
    confirm({
      title: 'Do you want to delete this comment?',
      icon: <ExclamationCircleFilled />,
      content:"When clicked the OK button, this comment will be will be deleted permanently",
      onOk() {
        return new Promise((resolve, reject) => {          
        return  setTimeout(handleDeleteComment(id)? resolve : reject, 1500);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  };
  return (
    <div className="Comment-Page">
      
      <List
        dataSource={post}
        style={{
          width: "100%",
          flexGrow: 1,
        }}
        renderItem={(post) => (
          <Card
            className="Card-Comment"
            style={{
              marginBottom: "20px",
              padding: "15px",
              width: "100%",
              boxSizing: "border-box",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <List.Item key={post.post_id}>
              <List.Item.Meta
                avatar={
                  post.profile_image ? (
                    <Avatar
                      size={50}
                      src={post.profile_image}
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    <Avatar icon={<UserOutlined />} />
                  )
                }
                title={<strong>{post.user_name}</strong>}
                description={post.body}
               
              />
            
              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginTop: "10px",
                  }}
                />
              )}
              {post.video && (
                <video
                  controls
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                  src={post.video}
                />
              )}
            </List.Item>
            <Space
              style={{
                marginTop: "15px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
            </Space>
          </Card>
        )}
      />
       <div className="popup">
    <div className="popContent">
      <button
        className="btnComment"
        onClick={() => {
       
          navigate("../")
          dispatch(setComments([]));
        }}
      >
        X
      </button>
      { comments?.map((comment) => {
        return (
          <div key={comment.comment_id} className="parentComment">
            <div className="commentHeader">
              <Avatar src={comment.profile_image} />
              <p>{comment.user_name}</p>
            </div>
            <div className="CommentBody">
              <p>{comment.comment}</p>
            </div>
            <Button
              onClick={() => {
                showPromiseConfirmSoftDeleted(comment.comment_id)
              }}
            >
              delete
            </Button>
          </div>
        );
      })}
      </div>
      <div className="Create-Comment">
        <Input
        value={newComment}
        className="Add-Comment"
          placeholder="Add Comment"
          onChange={(e) => {
            setNewComment(e.target.value);
          }}
        />
        <Button onClick={handleComment}
        className="Comment-Button">Comment</Button>
      </div>
    </div>
    </div>
  );
};

export default Comments;
