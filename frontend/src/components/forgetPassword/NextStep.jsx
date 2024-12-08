import axios from "axios";
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const NextStep = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [newPassword, setNewPassword] = useState({});
  const [message, setMessage] = useState("");
  const handleReset = () => {
    if (newPassword.newPass === newPassword.confirm) {
      axios
        .put(
          `https://moltaqa-it.onrender.com/users/login/re/?email=${email}`,
          {password:newPassword.newPass}
        )
        .then((res) => {
          setMessage(
            "password changed successfully , now transferring you to login page please wait...  "
          );
          localStorage.removeItem("next")
          setTimeout(() => {
            navigate("/");
          }, 4000);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      setMessage("password must match");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  return (
    <div>
      <h1>Reset your password</h1>
      <label>
        <span>insert new password</span>
        <input
          type="password"
          onChange={(e) => {
            setNewPassword({ ...newPassword, newPass: e.target.value });
          }}
        />
      </label>
      <span>confirm password</span>
      <input
        type="password"
        onChange={(e) => {
          setNewPassword({ ...newPassword, confirm: e.target.value });
        }}
      />
      <button onClick={handleReset}>submit</button>
      <br></br>
      {message ? <p>{message}</p> : null}
    </div>
  );
};

export default NextStep;
