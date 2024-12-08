import React from "react";
import "./users.css";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button } from "antd";
import axios from "axios";
import {
  SoftDeleteUserById,
  updateUserById,
} from "../../redux/reducers/sliceUser";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
const { confirm } = Modal;

const AdminUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector((users) => {
    return users.users.users;
  });
  const token = localStorage.getItem("token");


  // deactivate user
  const handleDeactivate = async (id) => {
    try {
      const deactivate = await axios.put(
        `https://moltaqa-it.onrender.com/users/sd/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(deactivate.data);
      dispatch(updateUserById(deactivate.data.result[0]));
    } catch (error) {
      console.log(error);
    }
  };
  // permanent delete
  const handleDelete = async (id) => {
    try {
      const deleteSUers = await axios.delete(
        `https://moltaqa-it.onrender.com/users/hd/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(SoftDeleteUserById(deleteSUers.data.result[0]));
    } catch (error) {
      console.log(error);
    }
  };
  // activate user
  const handleActivate = async (id) => {
    try {
      const activate = await axios.put(
        `https://moltaqa-it.onrender.com/users/${id}`,
        { is_deleted: "0" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(updateUserById(activate.data.result[0]));
    } catch (error) {
      console.log(error);
    }
  };
  const showedUser = users.filter((user) => {
    return user.role_id != 1;
  });
  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure delete this user?",
      icon: <ExclamationCircleFilled />,
      content: "user will be deleted permanently",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        console.log("ok");
        handleDelete(id)
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const showDeActivateConfirm = (id) => {
    confirm({
      title: "Are you sure deactivate this user?",
      icon: <ExclamationCircleFilled />,
      content: "user will be deactivated",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeactivate(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  return (
    <div className="parentRenderUserAdmin">
      {showedUser?.map((elem) => {
        return (
          <div key={elem?.user_id}>
            {elem.user_id != localStorage.getItem("user_id") && (
              <div className="parentUserAdmin">
                <div
                 className="adminUserHeader"
                >
                  <Avatar src={elem?.profile_image} className="image" />
                  <h3>@{elem?.user_name}</h3>
                </div>
                <p>online: {elem?.is_login ? "true" : "false"}</p>
                <div>
                  {elem?.is_deleted ? (
                    <Button
                      onClick={() => {
                        handleActivate(elem?.user_id);
                      }}
                    >
                      activate
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        showDeActivateConfirm(elem?.user_id);
                      }}
                    >
                      deactivate
                    </Button>
                  )}

                  <Button
                    onClick={() => {
                      showDeleteConfirm(elem?.user_id);
                    }}
                  >
                    delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminUsers;
