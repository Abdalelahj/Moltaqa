import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaSearch,
  FaHome,
  FaCalendarAlt,
  FaBookmark,
  FaCog,
  FaLock,
  FaPhoneAlt,
} from "react-icons/fa";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import "./sideStyle.css";
import { Logout, setVisitId } from "../redux/reducers/auth";
import { useDispatch } from "react-redux";
import axios from "axios";

const Side = () => {
  const userId = localStorage.getItem("user_id");
  const dispatch = useDispatch();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    axios
      .put(`https://moltaqa-it.onrender.com/users/isNotlogin/false/${userId}`, {})
      .then((result) => {
    dispatch(Logout());

      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleSettings = () => {
    setShowSettings((prevState) => !prevState);
  };

  return (
    <div className="sidebar1">
      {/* Feeds Link */}
      <Link
        to={"/home/"}
        onClick={() => {
          dispatch(setVisitId(null))
          if (localStorage.getItem("postId")) {
            localStorage.removeItem("postId");
          }
        }}
      >
        <FaHome className="sidebar-icon" /> Feeds
      </Link>

      {/* Profile Link */}
      <Link
        to={`/home/profile/${userId}`}
        onClick={() => {
          if (localStorage.getItem("postId")) {
            localStorage.removeItem("postId");
          }
        }}
      >
        <FaUser className="sidebar-icon" /> Profile
      </Link>

      {/* Explore Link */}
      <Link to={"/home/explore"}>
        <FaSearch className="sidebar-icon" /> Explore
      </Link>

   
      {/* Events Link */}
      <Link
        to={"/home/events"}
        onClick={() => {
          if (localStorage.getItem("eventId")) {
            localStorage.removeItem("eventId");
          }
        }}
      >
        <FaCalendarAlt className="sidebar-icon" /> Events
      </Link>

      <Link to={"/home/bookmark"}>
        <FaBookmark className="sidebar-icon" /> Bookmarks
      </Link>

      {/* Settings Link */}
      <div className="settings-container">
        <button className="settingsToggle" onClick={toggleSettings}>
          <FaCog className="sidebar-icon" /> Settings
        </button>

        {/* Submenu */}
        {showSettings && (
          <div className="settingsMenu">
            <Link to={"/home/setting/howToUse"}>
              <FaLock className="sidebar-icon" /> How To Use
            </Link>
            <Link to={"/home/setting/general"}>
              <FaCog className="sidebar-icon" /> General Settings
            </Link>
            <Link to={"/home/setting/privacy"}>
              <FaLock className="sidebar-icon" /> Privacy Settings
            </Link>
            <Link to={"/home/setting/contact"}>
              <FaPhoneAlt className="sidebar-icon" /> Contact Us
            </Link>
          </div>
        )}
      </div>

      {/* Logout Link */}
      <Link to="#" onClick={handleLogout} className="LogoutLink">
        <FaLock className="sidebar-icon" /> Logout
      </Link>
    </div>
  );
};

export default Side;
