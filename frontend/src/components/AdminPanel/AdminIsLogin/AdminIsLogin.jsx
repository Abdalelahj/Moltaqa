import React from "react";
import "./islogin.css";
import {  useSelector } from "react-redux";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const AdminIsLogin = () => {
  const navigate = useNavigate();
  const users = useSelector((users) => {
    return users.users.users;
  });

  const isLogin = users.filter((elem) => {
    return elem.is_login == true;
  });

  return (
    <div className="parentLoginAdmin">
      {isLogin?.map((user) => {
        return (
          <div key={user.user_id} className="innerLoginAdmin">
            <div className="infoAdminLogin">
              <img src={user.profile_image || "./default-profile.png"} />
              <h5>@{user.user_name}</h5>
            </div>

            <Button
              onClick={() => {
                navigate(`/home/profile/${user.user_id}`);
              }}
            >
              Visit user
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default AdminIsLogin;
