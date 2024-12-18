import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteComment,
  setComments,
} from "../../../redux/reducers/sliceComments";
import axios from "axios";
import "./adminComment.css";
import {
  Modal,
  Button,
  List,
  Avatar,
  Popconfirm,
} from "antd";


const AdminComments = ({ id, isVisible, handleCloseComments }) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const comments = useSelector((reducers) => {
    return reducers.comments.comments;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible) {
      fetchComments();
    }
  }, [isVisible]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://moltaqa-it.onrender.com/comments/${id}/post`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      dispatch(setComments(response.data.data));
    } catch (error) {
      console.error("Error fetching comments:", error);
      setLoading(false);
    }
  };

  const handleDeleteComment = (commentId) => {
    axios
      .delete(`https://moltaqa-it.onrender.com/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        dispatch(deleteComment(commentId));
        success();
      })
      .catch((err) => {
        console.log(err);
        error();
      });
  };

  const error = () => {
    Modal.error({
      title: "Error",
      content: "Failed to delete comment",
    });
  };
  const success = () => {
    Modal.success({
      content: "comment deleted successfully",
    });
  };

  

  return (
    <Modal
      title="Comments"
      open={isVisible}
      onCancel={handleCloseComments}
      footer={null}
      styles={{
        maxHeight: "70vh",
        overflowY: "auto",
      }}
      mask={false}
      centered
      maskClosable
      loading={loading}
    >
      <List
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={(comment) => (
          <List.Item
            actions={[
              <Popconfirm
                title="Are you sure to delete this comment?"
                onConfirm={() => handleDeleteComment(comment.comment_id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger>
                  Delete
                </Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar src={comment.profile_image}>
                  {comment.user_name?.toUpperCase() || "A"}
                </Avatar>
              }
              title={<span>{comment.user_name || "Anonymous"}</span>}
              description={comment.comment}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default AdminComments;
