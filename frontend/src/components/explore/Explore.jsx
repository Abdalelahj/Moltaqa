import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../redux/reducers/sliceUser";
import "./Explore.css";

const Explore = ({socket}) => {
  const dispatch = useDispatch();
  const [following, setFollowing] = useState([]);

  const { token } = useSelector((state) => {
    return state.auth;
  });

  const AllUsers = useSelector((state) => {
    return state.users.users;
  });
const userId=localStorage.getItem("user_id")
  const users = AllUsers.filter((user) => {
    return user.role_id !== 1;
  });
  useEffect(() => {
    axios
      .get("https://moltaqa-it.onrender.com/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(getAllUsers(result.data.Users));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://moltaqa-it.onrender.com/followers/${userId}/following`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        const found = result.data.data.map((elem) => elem.following_id);
        setFollowing(found);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handFollow = (id) => {

    axios
      .post(
        `https://moltaqa-it.onrender.com/followers/${id}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setFollowing([...following, id]);
        const noteTo =AllUsers.find((user=>{
          return user.user_id==userId
        }))  
        console.log(noteTo.user_name);
        console.log(id);
        
        socket.emit("notification",{message:`${noteTo.user_name} started following you` , from:userId, to:id})
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="explore-container">
      <h2 className="explore-title">Discover Amazing People</h2>
      <div className="users-list">
        {users?.map((user) => {
          return (
            user.user_id != userId &&
            !following.includes(user.user_id) && (
              <div key={user.user_id} className="user-card">
                <img
                  src={user.profile_image || "/default-avatar.png"}
                  alt={`${user.user_name} ${user.last_name }`}
                  className="user-avatar"
                />
                <div className="user-info">
                  <h3 className="user-name">{`${user.user_name} ${user.last_name==null ? "" :user.last_name}`}</h3>
                  <p className="user-username">@{user.user_name}</p>
                </div>
                <button
                  onClick={() => handFollow(user.user_id)}
                  className="follow-button"
                >
                  Follow
                </button>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
