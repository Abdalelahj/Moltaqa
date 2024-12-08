import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserById, updateUserById } from "../redux/reducers/sliceUser";
import {
  Button,
  Input,
  Form,
  Typography,
  Space,
  Avatar,
  message,
  Modal,
} from "antd";
import { CameraOutlined } from "@ant-design/icons";
import "./edit.css";

const { Title } = Typography;

const Edit = () => {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({});
  const [newPass, setNewPass] = useState({});
  const [showPass, setShowPass] = useState(false); // حالة للتحكم في إظهار/إخفاء نموذج تغيير كلمة السر
  const [isModalVisible, setIsModalVisible] = useState(false); // حالة لعرض النافذة المنبثقة
  const [passwordError, setPasswordError] = useState(""); // حالة لعرض خطأ كلمة السر
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.users.users);

  useEffect(() => {
    axios
      .get(`https://moltaqa-it.onrender.com/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(getUserById(result.data.User));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleFileChange = (e) => {
    const select = e.target.files[0];

    if (!select) return;

    const data = new FormData();
    data.append("file", select);
    data.append("upload_preset", "project_5");
    data.append("cloud_name", "dniaphcwx");
    fetch("https://api.cloudinary.com/v1_1/dniaphcwx/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        axios
          .put(
            `https://moltaqa-it.onrender.com/users/${userId}`,
            {
              profile_image: data.url,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            dispatch(updateUserById(res.data.result[0]));
            message.success("Profile image updated successfully!");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => console.log(err));
  };

  const handleUpdate = () => {
    setIsModalVisible(true); // عرض نافذة تأكيد التحديث
  };

  const confirmUpdate = () => {
    axios
      .put(`https://moltaqa-it.onrender.com/users/${userId}`, userInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(updateUserById(res.data.result[0]));
        setUserInfo({});
        message.success("User information updated successfully!");
        setIsModalVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cancelUpdate = () => {
    setIsModalVisible(false);
  };

  const handleChangePass = () => {
    if (newPass.new_pass === newPass.confirm) {
      if (newPass.oldPass) {
        axios
          .post(
            `https://moltaqa-it.onrender.com/users/checkpass/${userId}`,
            { password: newPass.oldPass },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((result) => {
            if (result.data.success) {
              axios
                .put(
                  `https://moltaqa-it.onrender.com/users/${userId}`,
                  {
                    password: newPass.new_pass,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then(() => {
                  message.success("Password updated successfully!");
                  setShowPass(false); // إغلاق الفورم بعد التحديث
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              setPasswordError("Incorrect old password. Please try again.");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setPasswordError("Please enter the old password.");
      }
    } else {
      setPasswordError("Passwords do not match.");
    }
  };

  return (
    <div className="edit-container">
      <Title level={3}>Edit Profile</Title>

      <div className="profile-picture">
        <div className="profile-image-container">
          <Avatar size={120} src={user[0]?.profile_image} />
          <label htmlFor="file-upload" className="camera-icon-overlay">
            <CameraOutlined className="camera-icon" />
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <Form
        layout="vertical"
        initialValues={{
          user_name: user[0]?.user_name,
          first_name: user[0]?.first_name,
          last_name: user[0]?.last_name,
          email: user[0]?.email,
          country: user[0]?.country,
          bio: user[0]?.bio,
        }}
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <Form.Item label="User Name" name="user_name">
          <Input
            onChange={(e) => {
              setUserInfo({ ...userInfo, user_name: e.target.value });
            }}
            style={{ borderRadius: "8px", padding: "10px" }}
          />
        </Form.Item>

        <Form.Item label="First Name" name="first_name">
          <Input
            onChange={(e) => {
              setUserInfo({ ...userInfo, first_name: e.target.value });
            }}
            style={{ borderRadius: "8px", padding: "10px" }}
          />
        </Form.Item>

        <Form.Item label="Last Name" name="last_name">
          <Input
            onChange={(e) => {
              setUserInfo({ ...userInfo, last_name: e.target.value });
            }}
            style={{ borderRadius: "8px", padding: "10px" }}
          />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input
            type="email"
            onChange={(e) => {
              setUserInfo({ ...userInfo, email: e.target.value });
            }}
            style={{ borderRadius: "8px", padding: "10px" }}
          />
        </Form.Item>

        <Form.Item label="Country" name="country">
          <Input
            onChange={(e) => {
              setUserInfo({ ...userInfo, country: e.target.value });
            }}
            style={{ borderRadius: "8px", padding: "10px" }}
          />
        </Form.Item>

        <Form.Item label="Bio" name="bio">
          <Input.TextArea
            onChange={(e) => {
              setUserInfo({ ...userInfo, bio: e.target.value });
            }}
            style={{ borderRadius: "8px", padding: "10px" }}
          />
        </Form.Item>

        <div className="button-container">
          <Button
            type="primary"
            size="large"
            shape="round"
            onClick={handleUpdate}
            style={{
              backgroundColor: "#1890ff",
              borderRadius: "25px",
              width: "70%",
              fontSize: "17px",
            }}
          >
            Save Changes
          </Button>
          <Button
            size="large"
            shape="round"
            onClick={() => navigate(`/profile/${userId}`)}
            style={{
              backgroundColor: "#f44336",
              borderRadius: "25px",
              width: "70%",
              fontSize: "17px",
              marginLeft: "10px",
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>

      <Modal
        title="Confirm Changes"
        open={isModalVisible}
        onOk={confirmUpdate}
        onCancel={cancelUpdate}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to save the changes?</p>
      </Modal>

      <div className="password-section">
        {!showPass ? (
          <a href="#" onClick={() => setShowPass(true)}>
            Change Password?
          </a>
        ) : (
          <div>
            <br />
            <br />
            <Input.Password
              placeholder="Enter old password"
              onChange={(e) =>
                setNewPass({ ...newPass, oldPass: e.target.value })
              }
            />
            <br /> <br />
            <Input.Password
              placeholder="Enter new password"
              onChange={(e) =>
                setNewPass({ ...newPass, new_pass: e.target.value })
              }
            />
            <br />
            <br />
            <Input.Password
              placeholder="Confirm new password"
              onChange={(e) =>
                setNewPass({ ...newPass, confirm: e.target.value })
              }
            />
            <br />
            {passwordError && <p className="error-message">{passwordError}</p>}
            <br />
            <div className="password-buttons-container">
              <Button
                type="primary"
                size="large"
                onClick={handleChangePass}
                style={{
                  backgroundColor: "#1890ff",
                  borderRadius: "25px",
                }}
              >
                Change Password
              </Button>
              <Button
                size="large"
                onClick={() => setShowPass(false)}
                style={{
                  backgroundColor: "#f44336",
                  borderRadius: "25px",
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Edit;
