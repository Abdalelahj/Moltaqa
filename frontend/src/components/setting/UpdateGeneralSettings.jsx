import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const UpdateGeneralSettings = () => {
  const navigate =useNavigate()
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    bio: "",
    profile_image: null, // هنا نخزن الصورة المرفوعة
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      const uploadedFile = info.file.response?.fileUrl || ""; // استبدل باسم الحقل المرسل من الخادم
      setFormData({ ...formData, profile_image: uploadedFile });
      message.success(`${info.file.name} uploaded successfully.`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  const handleSubmit = () => {
    const payload = new FormData(); // استخدم FormData لإرسال البيانات مع الصورة
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    axios
      .put("https://moltaqa-it.onrender.com/settings/general", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data", // هام لإرسال البيانات مع الملفات
        },
      })
      .then((response) => {
        message.success("Settings updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating settings:", error);
        message.error("Error updating settings.");
      });
  };

  return (
    <div style={styles.container}>
      
      <div className="Back-Div-Gen">

      <IoArrowBackOutline className="Back" onClick={()=>{
        navigate('/home')
      }}/>

      </div>
      <div style={styles.formContainer}>
        <Title level={3} style={styles.title}>
          Update Your Settings
        </Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Username" name="user_name">
            <Input
              name="user_name"
              placeholder="Enter your username"
              onChange={handleChange}
              style={styles.input}
            />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input
              name="email"
              placeholder="Enter your email"
              type="email"
              onChange={handleChange}
              style={styles.input}
            />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              style={styles.input}
            />
          </Form.Item>

          <Form.Item label="Bio" name="bio">
            <Input.TextArea
              name="bio"
              placeholder="Tell us about yourself"
              onChange={handleChange}
              style={styles.textArea}
            />
          </Form.Item>

          <Form.Item label="Profile Image" name="profile_image">
            <Upload
              name="file" // يجب أن يتوافق مع الحقل الذي يتعامل معه السيرفر
              action="https://moltaqa-it.onrender.com/upload" // استبدل بعنوان رفع الصورة في API
              headers={{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }}
              onChange={handleImageUpload}
              listType="picture"
            >
              <Button icon={<UploadOutlined />} style={styles.uploadButton}>
                Upload Profile Image
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={styles.submitButton}
            >
              Update Settings
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UpdateGeneralSettings;

// الأنماط المخصصة
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f4ff", // خلفية فاتحة وجميلة
    padding: "20px",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  title: {
    color: "#4a90e2", // لون مميز للعنوان
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    borderRadius: "8px",
    padding: "10px",
  },
  textArea: {
    borderRadius: "8px",
    padding: "10px",
  },
  uploadButton: {
    backgroundColor: "#4a90e2",
    color: "#fff",
    borderRadius: "8px",
  },
  submitButton: {
    backgroundColor: "#4a90e2",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
  },
};
