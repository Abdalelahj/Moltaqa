import React, { useEffect } from "react";
import "./dashBoard.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AdminSide from "./AdminSide";

const AdminDashBoard = () => {
  const navigate = useNavigate();
 
  const users = useSelector((users) => {
    return users.users.users;
  });
  const isLoggedIn = useSelector((auth) => {
    return auth.auth.isLoggedIn;
  });
  const AdminProfile = users.find((user) => {
    return user?.role_id === 1;
  });
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div className="parentDash">
      <div className="AdNav">
        {" "}
        <img src="https://res.cloudinary.com/dniaphcwx/image/upload/v1733703537/mzt9fapx5pjcnrkczcqr.jpg" className="Icon" />
        <h3>Hi {AdminProfile?.user_name}</h3>
      </div>
      <div className="orgAdmin">
        <div className="sidebarAdmin">
          <AdminSide />
        </div>
        <div className="contentAdmin">
          <Outlet />
        </div>
      </div>

      <br></br>
    </div>
  );
};

export default AdminDashBoard;
