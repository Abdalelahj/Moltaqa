import React, { useEffect, useState } from "react";
import "./posts.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  deletePost,
  setPosts,
  updatePost,
} from "../redux/reducers/slicePosts";
import { useNavigate, useParams } from "react-router-dom";
import Like from "../likes/Like";

import {
  Input,
  Button,
  Avatar,
  Card,
  List,
  Layout,
  Space,
  Typography,
  Upload,
  Tooltip,
  Modal,
  message,
} from "antd";
import {
  UserOutlined,
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  CommentOutlined,
  SendOutlined,
  CameraOutlined,
  HeartFilled,
  MessageOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

const Posts = () => {
  const [postDisplayEdit, setpostDisplayEdit] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [postId, setPostId] = useState(0);
  const [updateClicked, setUpdateClicked] = useState(false);
  const [editPostText, setEditPostText] = useState("");
  const [addPost, setAddPost] = useState({
    body: null,
    image: null,
    video: null,
  });
  const postInfo = {
    body: addPost.body || null,
    image: addPost.image || null,
    video: addPost.video || null,
  };

  const { id } = useParams();
  const userId = id ? id : localStorage.getItem("user_id");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [savedPost, setSavedPost] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const posts = useSelector((state) => state.posts.posts);

  useEffect(() => {
    axios
      .get(`https://moltaqa-it.onrender.com/followers/posty/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(setPosts(res.data.data));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [posts]);

  useEffect(() => {
    axios
      .get("https://moltaqa-it.onrender.com/posts/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        let found = result.data.saved_posts.map((elem) => {
          return elem.post_id;
        });
        setSavedPost(found);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [posts]);

  const handleAddPost = () => {
    if (
      postInfo.body !== null ||
      postInfo.video !== null ||
      postInfo.image !== null
    ) {
      axios
        .post("https://moltaqa-it.onrender.com/posts", postInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          dispatch(createPost(res.data.post[0]));
          message.success("Post created successfully!");
          setAddPost({ body: "", image: null, video: null });
          setFileList([]);
        })
        .catch((err) => {
          console.error("Error while creating post:", err);
          message.error("Failed to create post.");
        });
    } else {
      message.error(
        "write something or upload photo or video  to create post."
      );
    }
  };

  const handleUpdatePost = (postId) => {
    axios
      .put(
        `https://moltaqa-it.onrender.com/posts/${postId}`,
        { body: editPostText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setpostDisplayEdit(false);
        message.success("Post updated successfully!");
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to update post.");
      });
  };

  const handleDelete = (postId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this post?",
      content: "Once deleted, it cannot be recovered.",
      okText: "Yes",
      cancelText: "No",
      centered: true,
      onOk: () => {
        axios
          .delete(`https://moltaqa-it.onrender.com/posts/${postId}/hard`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            dispatch(deletePost({ post_id: postId }));
            message.success("Post deleted successfully!");
          })
          .catch((err) => {
            console.error(err);
            message.error("Failed to delete post.");
          });
      },
    });
  };

  const handleAddSave = (postId) => {
    Modal.confirm({
      title: "Are you sure you want to save this post?",
      content: "You can view it later in your saved posts.",
      okText: "Yes",
      cancelText: "No",
      centered: true,
      onOk: () => {
        axios
          .post(
            `https://moltaqa-it.onrender.com/posts/add&save/${postId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            message.success("Post saved successfully!");
            setSavedPost([...savedPost, postId]);
          })
          .catch((err) => {
            console.error(err);
            message.error("Failed to save post.");
          });
      },
    });
  };
  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      fileList.splice(index, 1);
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    onChange: (file) => {
      if (!fileList[0]) return;

      const data = new FormData();
      data.append("file", fileList[0]);
      data.append("upload_preset", "project_5");
      data.append("cloud_name", "dniaphcwx");
      fetch("https://api.cloudinary.com/v1_1/dniaphcwx/image/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data.url);
          setAddPost({ ...addPost, image: data.url });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fileList,
  };
  const prop = {
    onRemove: (video) => {
      const index = videoList.indexOf(video);
      const newFileList = videoList.slice();
      videoList.splice(index, 1);
      setVideoList([]);
      setAddPost({ ...addPost, video: null });
    },
    beforeUpload: (video) => {
      setVideoList([...videoList, video]);
      return false;
    },
    onChange: (video) => {
        if (!videoList[0]) return;

      const data = new FormData();
      data.append("file", videoList[0]);
      data.append("upload_preset", "project_5");
      data.append("cloud_name", "dniaphcwx");
      fetch("https://api.cloudinary.com/v1_1/dniaphcwx/video/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data.url);
          setAddPost({ ...addPost, video: data.url });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    videoList,
  };

  return (
    <Content
      style={{
        padding: "20px",
        margin: "0 auto",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Create Post Section */}
      <Card
        style={{
          marginBottom: "20px",
          padding: "20px",
          width: "950px",
          boxSizing: "border-box",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <TextArea
          placeholder="What's on your mind?"
          value={addPost.body || ""}
          onChange={(e) => setAddPost({ ...addPost, body: e.target.value })}
          rows={4}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Tooltip title="Upload Image">
            <Upload {...props}>
              <Button icon={<CameraOutlined />}>Upload image</Button>
            </Upload>
          </Tooltip>

          <Tooltip title="Upload Video">
            <Upload {...prop}>
              <Button icon={<CameraOutlined />}>Upload video</Button>
            </Upload>
          </Tooltip>

          <Tooltip title="Post">
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleAddPost}
              style={{
                backgroundColor: "#1877f2",
              }}
            >
              Post
            </Button>
          </Tooltip>
        </div>
      </Card>

      {/* Display Posts */}
      <List
        dataSource={posts}
        style={{
          width: "100%",
          flexGrow: 1,
        }}
        renderItem={(post) => (
          <Card
            style={{
              marginBottom: "20px",
              padding: "20px",
              width: "100%",
              boxSizing: "border-box",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            hoverable
          >
            
            <List.Item key={post.post_id}>
              <List.Item.Meta
                avatar={
                  post.profile_image ? (
                    <Avatar
                      size={50}
                      src={post.profile_image}
                      style={{ borderRadius: "50%" }}
                      onClick={() => {
                        navigate(`/home/profile/${post.user_id}`);
                      }}
                    />
                  ) : (
                    <Avatar icon={<UserOutlined />} />
                  )
                }
                title={<strong>{post.user_name}</strong>}
                description={
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#333", // اللون الرمادي الداكن
                      marginTop: "10px",
                      lineHeight: "1.8", // تباعد الأسطر
                      fontFamily: "'Poppins', sans-serif", // تغيير الخط إلى Poppins
                      fontWeight: "400", // خط عادي أو يمكن تغييره إلى bold
                    }}
                  >
                    {postDisplayEdit && postId == post.post_id ? (
                      <>
                        <Input
                          defaultValue={post.body}
                          onChange={(e) => {
                            setEditPostText(e.target.value);
                          }}
                        />
                        <Button
                          onClick={(e) => {
                            setpostDisplayEdit(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={(e) => {
                            handleUpdatePost(postId);
                          }}
                        >
                          Save
                        </Button>
                      </>
                    ) : (
                      <div>
                        <p>{post.body}</p>

                        {post.image && post.video ? (
                          <div className="media-container">
                            <div className="media-item media-image">
                              <img src={post.image} alt="Post visual content" />
                            </div>
                            <div className="media-item media-video">
                              <video controls>
                                <source src={post.video} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          </div>
                        ) : (
                          <>
                            {post.image && (
                              <img
                                src={post.image}
                                alt="Post Image"
                                style={{
                                  width: "100%",
                                  borderRadius: "8px",
                                  marginTop: "10px",
                                  objectFit: "cover",
                                  height: "auto",
                                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
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
                                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                }}
                                src={post.video}
                              />
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>

            <Space
              style={{
                marginTop: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* زر الإعجاب */}
              <Like
                postId={post.post_id}
                likedPosts={likedPosts}
                setLikedPosts={setLikedPosts}
                token={token}
                icon={
                  <HeartFilled
                    style={{
                      color: likedPosts.includes(post.post_id)
                        ? "red"
                        : "black",
                      fontSize: "20px",
                    }}
                  />
                }
              />

              {/* زر التعليقات */}

              <Button
                icon={<MessageOutlined />}
                type="link"
                style={{
                  color: "#1890ff",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
                onClick={() => navigate(`./comments/${post.post_id}`)}
              >
                Comments
              </Button>

              {/* زر الحفظ */}
              {!savedPost.includes(post.post_id) ? (
                <Button
                  icon={<SaveOutlined />}
                  type="link"
                  onClick={() => handleAddSave(post.post_id)}
                  style={{
                    color: "#28a745",
                    fontSize: "18px",
                  }}
                >
                  Save
                </Button>
              ) : (
                <Button
                  icon={<SaveOutlined />}
                  disabled
                  type="link"
                  style={{
                    color: "#28a745",
                    fontSize: "18px",
                  }}
                >
                  Saved
                </Button>
              )}

              {/* زر التعديل */}
              {post.user_id === parseInt(userId) && (
                <Button
                  icon={<EditOutlined />}
                  type="link"
                  onClick={() => {
                    setpostDisplayEdit(true);
                    setPostId(post.post_id);
                    setEditPostText(post.body);
                    setUpdateClicked(true);
                  }}
                  style={{
                    color: "#ffc107",
                    fontSize: "18px",
                  }}
                >
                  Edit
                </Button>
              )}

              {post.user_id === parseInt(userId) && (
                <Button
                  icon={<DeleteOutlined />}
                  type="link"
                  danger
                  onClick={() => handleDelete(post.post_id)}
                  style={{
                    fontSize: "18px",
                  }}
                >
                  Delete
                </Button>
              )}
            </Space>
          </Card>
        )}
      />
    </Content>
  );
};

export default Posts;
