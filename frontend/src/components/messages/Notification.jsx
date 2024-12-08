import axios from "axios";
import React, { useEffect, useState } from "react";
import { Avatar, Badge } from "antd";
import { AiFillBell } from "react-icons/ai";
import "./notify.css";
import moment from "moment-timezone";

const Notification = ({ socket }) => {
  const token = localStorage.getItem("token");
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket?.on("notification", (data) => {      
      setNote((prev) => [...prev, data].reverse());
      setCount((prev) => prev + 1);
    });

    return () => {
      socket?.off("notification");
    };
  }, [socket]);

  useEffect(() => {
    axios
      .get("https://moltaqa-it.onrender.com/notify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setNote(result.data.result);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
    };
  }, []);
  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    const localTime = moment.utc(date);

    return localTime.fromNow();
  };
  return (
    <div>
      <Badge count={count}>
        <Avatar
          shape="circle"
          size="large"
          icon={<AiFillBell />}
          className="notification-icon"
          onClick={() => {            
            setCount(0);
            setShowNote(!showNote);
          }}
        />
      </Badge>

      {showNote && (
        <div className="notification-window">
          <div className="notification-header">
            <h2>Notifications</h2>
          </div>
          <div className="notification-list">
            {note?.map((notify) => {
              return (
                <div key={notify.notification_id} className="notification-item">
                  <span className="img">
                    {" "}
                    <img
                      src={notify.profile_image || "default-profile.png"}
                      style={{
                        height: "50px",
                        width: "50px",
                        borderRadius: "50%",
                      }}
                    />
                  </span>
                  <span className="notification-message">{notify.action}</span>

                  <span className="notification-time">
                    {formatRelativeTime(notify.notification_time)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
