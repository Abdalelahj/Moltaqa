import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../redux/reducers/sliceUser";
import {
  createPost,
  deletePost,
  setPosts,
  updatePost,
} from "../redux/reducers/slicePosts";
import {
  Input,
  Button,
  Card,
  Avatar,
  Typography,
  Row,
  Col,
  Space,
  Upload,
  Tooltip,
  Modal,
  message,
} from "antd";
import {
  HeartFilled,
  MessageOutlined,
  SaveOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  UsergroupAddOutlined,
  CameraOutlined,
  SendOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./Profile.css";
import Like from "../likes/Like";
import { setVisitId } from "../redux/reducers/auth";

const { Title, Paragraph } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [updateClicked, setUpdateClicked] = useState(false);
  const [postId, setPostId] = useState(0);
  const [editPostText, setEditPostText] = useState("");
  const [savedPost, setSavedPost] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const userId = id ? id : localStorage.getItem("user_id");
  const [addPost, setAddPost] = useState({});
  const postInfo = {
    image: addPost.image || null,
    body: addPost.body || null,
    video: addPost.video || null,
  };

  const [following, setFollowing] = useState();
  const [follower, setFollower] = useState();
  const [fileList, setFileList] = useState([]);
  const [videoList, setVideoList] = useState([]);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.users.users);
  const posts = useSelector((state) => state.posts.posts);

  useEffect(() => {
    axios
      .get(`https://moltaqa-it.onrender.com/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        dispatch(getUserById(result.data.User));
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`https://moltaqa-it.onrender.com/posts/${userId}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        dispatch(setPosts(result.data.Post || []));
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("https://moltaqa-it.onrender.com/posts/saved", {
        headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    axios
      .get(`https://moltaqa-it.onrender.com/followers/${userId}/following`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        setFollowing(result.data.data?.length);
        dispatch(setVisitId(userId));
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`https://moltaqa-it.onrender.com/followers/${userId}/follower`)
      .then((result) => {
        setFollower(result.data.data?.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  const handleAddPost = () => {
    if (
      postInfo.body !== null ||
      postInfo.video !== null ||
      postInfo.image !== null
    ) {
      axios
        .post("https://moltaqa-it.onrender.com/posts", postInfo, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          dispatch(createPost(res.data.post[0]));
          message.success("Post created successfully!");
          setAddPost({ body: "", image: null, video: null });
          setVideoList([]);
          setFileList([]);
        })
        .catch((err) => {
          console.error(err);
          console.log('"Failed to create post."');
        });
    } else {
      message.error(
        "write something or upload photo or video  to create post."
      );
    }
  };

  const handleDelete = (postId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this post?",
      content: "Once deleted, it cannot be recovered.",
      okText: "Yes",
      cancelText: "No",
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
  };

  const handelUpdatePost = (postId) => {
    axios
      .put(
        `https://moltaqa-it.onrender.com/posts/${postId}`,
        { body: editPostText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        dispatch(updatePost(res.data.UpdatedPost[0]));
      })
      .catch((err) => {
        console.error(err);
        console.log('"Failed to update post."');
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
    <div className="profile-container">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-picture">
            <Avatar
              size={120}
              src={user[0]?.profile_image || "default-profile.png"}
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            <Title level={2}>{user[0]?.first_name}</Title>
            <p>@{user[0]?.user_name}</p>
          </div>
          <br />
          <Paragraph className="bio">{user[0]?.bio}</Paragraph>

          {user[0]?.user_id == localStorage.getItem("user_id") && (
            <Button
              type="primary"
              onClick={() => navigate(`/home/profile/edit`)}
              className="edit-profile-btn"
              style={{ borderRadius: "25px" }}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      <Paragraph className="bio-text">{user?.bio}</Paragraph>
      <Row gutter={16} className="profile-stats">
        <Col span={8}>
          <Card className="profile-stat">
            <Space>
              <UsergroupAddOutlined className="followers-icon" />
              <Link to={`/home/profile/f/0`}>
                <Title level={5}>Followers</Title>
              </Link>
            </Space>
            <p>{follower || 0}</p>
          </Card>
        </Col>

        <Col span={8}>
          <Card className="profile-stat">
            <Space>
              <UsergroupAddOutlined className="followers-icon" />

              <Link to={`/home/profile/f/1`}>
                <Title level={5}>Following</Title>
              </Link>
            </Space>
            <p>{following || 0}</p>
          </Card>
        </Col>

        <Col span={8}>
          <Card className="profile-stat">
            <Space>
              <EnvironmentOutlined className="location-icon" />
              <Title level={5}>Location</Title>
            </Space>
            <p>{user[0]?.country || "Unknown"}</p>
          </Card>
        </Col>
      </Row>
      <br /> <br /> <br /> <br />
      {userId == localStorage.getItem("user_id") && (
        <div className="createPost">
          <Input.TextArea
            placeholder="What's on your mind?"
            value={addPost.body || ""}
            onChange={(e) => setAddPost({ ...addPost, body: e.target.value })}
            rows={3}
            style={{ width: "750px", marginBottom: "10px" }}
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
        </div>
      )}
      <br /> <br /> <br /> <br />
      <div className="posts-section">
        {localStorage.getItem("user_id") == userId && <h3>Your Posts</h3>}
        <br></br>
        {posts?.map((post, index) => (
          <div className="post-card" key={index}>
            <Row>
              <Col span={4} className="post-avatar">
                <Avatar size="large" src={post?.profile_image} />
              </Col>
              <Col span={20}>
                <h3>{post?.user_name}</h3>
                <p className="post-body">{post?.body}</p>
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
                {post?.user_id == userId && (
                  <div className="post-actions">
                    {updateClicked && postId === post?.post_id && (
                      <>
                        <Input
                          value={editPostText}
                          onChange={(e) => setEditPostText(e.target.value)}
                        />
                        <Button
                          onClick={() => {
                            handelUpdatePost(post.post_id);
                            setUpdateClicked(false);
                          }}
                        >
                          Save
                        </Button>
                        <Button onClick={() => setUpdateClicked(false)}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </Col>
            </Row>

            <div className="post-actions">
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
                onClick={() => navigate(`/home/comments/${post.post_id}`)}
              >
                Comments
              </Button>
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
                  type="link"
                  disabled
                  style={{
                    color: "#28a745",
                    fontSize: "18px",
                  }}
                >
                  Saved
                </Button>
              )}

              {localStorage.getItem("user_id") == userId && (
                <>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      setUpdateClicked(true);
                      setPostId(post.post_id);
                    }}
                    className="update-button"
                  >
                    Update
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDelete(post.post_id)}
                  >
                    Delete
                  </Button>
                </>
              )}

              {/* زر الحفظ */}

              {/* زر التعديل */}
              {post?.user_id === userId && (
                <Button
                  icon={<EditOutlined />}
                  type="link"
                  onClick={() => {
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
              {/* زر الحذف */}
              {post?.user_id === userId && (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
