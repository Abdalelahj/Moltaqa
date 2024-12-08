import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteComment,
  setComments,
} from "../../../redux/reducers/sliceComments";
import axios from "axios";
import "./adminComment.css";
import { Avatar, Button } from "antd";
import { Modal } from 'antd';
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

const AdminComments = ({ id, setIsVisible }) => {
    const navigate=useNavigate()
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
    const { postId } = useParams();
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
  }, []);

  const handleDeleteComment = (commentId) => {
    axios
      .delete(`https://moltaqa-it.onrender.com/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        dispatch(deleteComment(commentId));
        success()
      })
      .catch((err) => {
        console.log(err);
        error()
        
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
  const error = () => {
    Modal.error({
      title: 'Error',
      content: 'Failed to delete comment',
    });
  };
  const success = () => {
    Modal.success({
      content: 'comment deleted successfully',
    });
  };
  return (
    <div className="popup">
    <div className="popContent">
      <button
        className="btnComment"
        onClick={() => {
          setIsVisible(false);
          navigate("../posts")
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
    </div>
  );
};

export default AdminComments;
