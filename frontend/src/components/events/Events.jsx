import "./event.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "antd";

const Events = ({ socket }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    axios
      .get("https://moltaqa-it.onrender.com/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const users = response.data.Users || [];
        const owner = users.find((user) => user.user_id == userId);
        setLoggedInUser(owner);

        filterTodaysBirthdays(users);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [token]);

  const filterTodaysBirthdays = (users) => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    const birthdaysToday = users.filter((user) => {
      const birthDate = new Date(user.birth_date);
      return (
        birthDate.getMonth() + 1 === todayMonth &&
        birthDate.getDate() === todayDay
      );
    });

    setTodaysBirthdays(birthdaysToday);
  };

  const handleGreetingChange = (event) => {
    setGreeting(event.target.value);
  };

  const sendGreeting = (recipientId) => {
    if (greeting.trim()) {
      console.log(recipientId);

      axios
        .post(
          `https://moltaqa-it.onrender.com/greeting/send`,
          { recipientId, greeting },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          socket.emit("notification", { message: `${greeting} from ${loggedInUser.user_name}`, to: recipientId ,from:userId});
          showModal("Success", "Your greeting has been sent successfully!");
          setGreeting("");
        })
        .catch((error) => {
          console.error("Error sending greeting:", error);
          showModal("Error", "Failed to send greeting.");
        });
    } else {
      showModal("Warning", "Please write a greeting first.");
    }
  };

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="birthdays-section">
      <p className="HB">🎉 Happy Birthday! 🎉</p>
      {todaysBirthdays.length > 0 ? (
        todaysBirthdays.map((user) => (
          <div key={user.user_id} className="birthday-card-container">
            <div className="birthday-card">
              <h3>{user.user_name}</h3>
              {user.user_id !== localStorage.getItem("user_id") ? (
                <>
                  <textarea
                    value={greeting}
                    onChange={handleGreetingChange}
                    placeholder="Write a greeting..."
                  />
                  <button onClick={() => sendGreeting(user.user_id)}>
                    Send Greeting
                  </button>
                </>
              ) : (
                <p>🎉 Happy Birthday! 🎉</p> 
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="no-birthdays">No birthdays today</p>
      )}

      <Modal
        title={modalTitle}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        centered
        okText="Ok"
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default Events;
