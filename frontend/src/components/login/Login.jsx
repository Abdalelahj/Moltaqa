import React, { useState, useEffect } from "react";
import "./login.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, SetUserId } from "../redux/reducers/auth";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { Modal } from "antd"; // استيراد الـ Modal من antd

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [role, setRole] = useState([]);

  const [userInfo, setUserInfo] = useState({
    email: localStorage.getItem("email") || null,
    password: localStorage.getItem("password" || null),
  });
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // الحالة للتحكم في ظهور الـ Modal

  const handleLogin = () => {
    if (
      Object.values(userInfo)[0] !== null &&
      Object.values(userInfo)[1] !== null
    ) {
      axios
        .post("https://moltaqa-it.onrender.com/users/login", userInfo)
        .then((res) => {
          const decoded = jwtDecode(res.data.token);
          setRole(decoded.role_id);
          axios
            .put(
              `https://moltaqa-it.onrender.com/users/islogin/true/${res.data.userId}`,
              {}
            )
            .then((result) => {})
            .catch((err) => {
              console.log(err);
            });
          dispatch(login(res.data.token));
          dispatch(SetUserId(res.data.userId));
          setMessage(res?.data.message);
          if (rememberMe) {
            localStorage.setItem("email", userInfo.email);
            localStorage.setItem("password", userInfo.password);
          } else {
            localStorage.removeItem("email");
            localStorage.removeItem("password");
          }

          // عرض الـ Modal عند النجاح
          setIsModalVisible(true);
        })
        .catch((err) => {
          setMessage(err.response?.data?.message);

          // عرض الـ Modal عند الخطأ
          setIsModalVisible(true);
        });
    } else {
      setMessage("please fill the required fields");

      // عرض الـ Modal عند الخطأ
      setIsModalVisible(true);
    }
  };

  const isLoggedIn = useSelector((auth) => {
    return auth.auth.isLoggedIn;
  });

  const handleRemMe = (e) => {
    if (e.target.checked) {
      setRememberMe(true);
    } else {
      setRememberMe(false);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    // يمكنك الانتقال إلى الصفحة المطلوبة بعد إغلاق الـ Modal
    if (role === 2) {
      navigate("/home");
    } else if (role === 1) {
      navigate("/Admin/Panel");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (isLoggedIn && role == 2) {
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } else if (isLoggedIn && role == 1) {
      setTimeout(() => {
        navigate("/Admin/Panel");
      }, 1000);
    }
  }, [isLoggedIn, role]);

  return (
    <div className="Body-Login">
      <div className="frame">
        <div className="plane-container">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="1131.53px"
            height="379.304px"
            viewBox="0 0 1131.53 379.304"
            enable-background="new 0 0 1131.53 379.304"
            xml:space="preserve"
            className="plane"
          >
            <polygon
              fill="#D8D8D8"
              points="72.008,0 274.113,140.173 274.113,301.804 390.796,221.102 601.682,367.302 1131.53,0.223  "
            />
            <polygon
              fill="#C4C4C3"
              points="1131.53,0.223 274.113,140.173 274.113,301.804 390.796,221.102   "
            />
          </svg>
        </div>
      </div>

      <div className="clouds">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="762px"
          height="331px"
          viewBox="0 0 762 331"
          enable-background="new 0 0 762 331"
          xml:space="preserve"
          className="cloud big front slowest"
        >
          <path
            fill="#FFFFFF"
            d="M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z"
          />
        </svg>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="762px"
          height="331px"
          viewBox="0 0 762 331"
          enable-background="new 0 0 762 331"
          xml:space="preserve"
          className="cloud distant smaller"
        >
          <path
            fill="#FFFFFF"
            d="M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z"
          />
        </svg>

        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="762px"
          height="331px"
          viewBox="0 0 762 331"
          enable-background="new 0 0 762 331"
          xml:space="preserve"
          className="cloud small slow"
        >
          <path
            fill="#FFFFFF"
            d="M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z"
          />
        </svg>

        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="762px"
          height="331px"
          viewBox="0 0 762 331"
          enable-background="new 0 0 762 331"
          xml:space="preserve"
          className="cloud distant super-slow massive"
        >
          <path
            fill="#FFFFFF"
            d="M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z"
          />
        </svg>

        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="762px"
          height="331px"
          viewBox="0 0 762 331"
          enable-background="new 0 0 762 331"
          xml:space="preserve"
          className="cloud slower"
        >
          <path
            fill="#FFFFFF"
            d="M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z"
          />
        </svg>
      </div>

      <div className="loginPage" style={{ backgroundColor: "unset" }}>
        <br></br>
        <div className="Login-Form">
          <div className="loginInputs">
            <input
              className="Email-Input"
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={(e) => {
                setUserInfo({ ...userInfo, email: e.target.value });
              }}
              defaultValue={localStorage.getItem("email") || ""}
            />
            <br></br>
            <input
              className="Password-Input"
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setUserInfo({ ...userInfo, password: e.target.value });
              }}
              defaultValue={localStorage.getItem("password") || ""}
            />
          </div>
          <br></br>
          <a href="/forget" className="forget">
            forget password?{" "}
          </a>
          <br></br>
          <label className="Remember-Label">
            <input
              type="checkbox"
              onChange={handleRemMe}
              defaultChecked="true"
            />
            <span className="Remember-span"> Remember me </span>
          </label>
          <br></br>
          <button onClick={handleLogin} className="Login-Button">
            login
          </button>
          <br></br>
          <h4 className="Register-Login">
            Don't have an account? <a href="/register">Sign Up</a>
          </h4>
          <p className="OR">OR</p>
          <div className="google-L">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decode = jwtDecode(credentialResponse.credential);
                const data = { email: decode.email, password: decode.sub };
                axios
                  .post("https://moltaqa-it.onrender.com/users/login", data)
                  .then((res) => {
                    const decoded = jwtDecode(res.data.token);
                    setRole(decoded.role_id);
                    axios
                      .put(
                        `https://moltaqa-it.onrender.com/users/islogin/true/${res.data.userId}`,
                        {}
                      )
                      .then((result) => {})
                      .catch((err) => {
                        console.log(err, "here");
                      });
                    dispatch(login(res.data.token));
                    dispatch(SetUserId(res.data.userId));
                    setMessage(res?.data.message);
                    if (rememberMe) {
                      localStorage.setItem("email", userInfo.email);
                      localStorage.setItem("password", userInfo.password);
                    } else {
                      localStorage.removeItem("email");
                      localStorage.removeItem("password");
                    }

                    // عرض الـ Modal عند النجاح
                    setIsModalVisible(true);
                  })
                  .catch((err) => {
                    console.log("here");
                    setMessage(err.response?.data?.message);

                    // عرض الـ Modal عند الخطأ
                    setIsModalVisible(true);
                  });
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
          {isLoggedIn
            ? message && <LoadingOutlined className="Loading"></LoadingOutlined>
            : null}
        </div>
        <div className="Welcome-Div-L">
          <h4 className="Welcome-Login">Welcome to</h4>
          <img src="https://res.cloudinary.com/dniaphcwx/image/upload/v1733703537/mzt9fapx5pjcnrkczcqr.jpg"  className="Moltaqa-Logo" />
          <p className="Description-Login">
            In This Application You Can Contact With Any Person Using This App
            And Talk About Your Opinions By Creating Posts Or Comments, Also You
            Can Follow Any User And See His Activities , Thank You For Choosing
            Us.
          </p>
        </div>
      </div>

      {/* Modal Popup للنجاح أو الخطأ */}
      <Modal
        title="Login Status"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <button key="back" onClick={handleCancel}>
            Close
          </button>,
        ]}
        centered
      >
        <p>{message}</p>
      </Modal>
    </div>
  );
};

export default Login;
