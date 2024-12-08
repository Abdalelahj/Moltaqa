import React, { useEffect, useState } from "react";
import axios from "axios";
import "./chat.css";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing } from "../redux/reducers/sliceFollowers";
import ChatMessages from "./ChatMessages";


const Chat = ({socket}) => {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const dispatch = useDispatch();
  const [to, setTo] = useState("");
  const [show, setShow] = useState(false);
  const users = useSelector((state) => {
    return state.followers.following;
  });
 
  
  useEffect(() => {
    axios
      .get(`https://moltaqa-it.onrender.com/followers/${user_id}/following`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(setFollowing(result.data.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [users]);

  

  return (
    <div>
    <h5 className="Head-Chat">Chat messages</h5>
      <div className="Chat-Con">
      {users?.map((user) => {
        return (
          <div
            key={user.user_id}
            onClick={() => {
              setTo(user.user_id);
              setShow(true);
            }}
          >
            <img
              src={user?.profile_image}
              className="userPic"
              alt="userPicture"
              width={30}
              height={60}
            />
           
            <p className="User-Name-Chat">{user.user_name}</p>
          </div>
        );
      })}
</div>
      {show && <ChatMessages socket={socket} to={to} setShow={setShow} />}
    </div>
  );
};

export default Chat;
