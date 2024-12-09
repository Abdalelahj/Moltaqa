import "./App.css";
import Login from "./components/login/Login";
import { Route, Routes, useRoutes } from "react-router-dom";
import Register from "./components/register/Register";
import Home from "./components/dashboard/Home";
import Profile from "./components/profile/Profile";
import Forget from "./components/forgetPassword/Forget";
import Posts from "./components/posts/Posts";
import { useState,useEffect, useId } from "react";
import Comments from "./components/comments/Comments";

import SearchBar from "./components/search/Search";
import Followers from "./components/profile/Followers";
import NextStep from "./components/forgetPassword/NextStep";
import SavedPost from "./components/saved Post/SavedPost";
import Edit from "./components/profile/Edit";
import AdminDashBoard from "./components/AdminPanel/AdminDashBoard/AdminDashBoard";
import AdminUsers from "./components/AdminPanel/AdminUsers/AdminUsers";
import AdminPosts from "./components/AdminPanel/AdminPosts/AdminPosts";
import AdminReports from "./components/AdminPanel/AdminReports/AdminReports";
import AdminIsLogin from "./components/AdminPanel/AdminIsLogin/AdminIsLogin";
import AdminHome from "./components/AdminPanel/AdminDashBoard/Admin Home/AdminHome";
import Events from "./components/events/Events";

import HowToUse from "./components/setting/HowToUse";
import GeneralSettings from "./components/setting/UpdateGeneralSettings";
import PrivacySettings from "./components/setting/UpdatePrivacySettings";
import SecuritySettings from "./components/setting/UpdateSecuritySettings";
import ContactUs from "./components/setting/ContactUs";
import AdminComments from "./components/AdminPanel/AdminPosts/adminComments/AdminComments";
import Explore from "./components/explore/Explore";
import NotFound from "./components/404/NotFound"
import io from "socket.io-client";


function App() {
  const themes = ["light", "dark", "blue", "green"];
  const [theme, setTheme] = useState("light");
  const [socket, setSocket] = useState(null);
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const toggleTheme = (e) => {
    setTheme(e.target.value);
  };
  useEffect(() => {    
    const socketConnection = io("https://moltaqa-it.onrender.com", {
      extraHeaders: {
        user_id,
        token,
      },
    });
    setSocket(socketConnection);

    socketConnection?.on("connect", () => {
      console.log("io connected");
    });
    socketConnection?.on("connect_error", (error) => {
      console.log("problem", error.message);
    }); 
    return () => {
      socketConnection?.removeAllListeners();
      socketConnection?.disconnect();
    };
  }, [user_id]);


  let element = useRoutes([
    {
      path: "/",
      children: [
        {
          index: true,
          element: <Login />,
        },
        {
          path: "forget",
          element: <Forget />,
          children: [
            {
              path: "claim/",
              element: <NextStep />,
            },
          ],
        },
      ],
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home socket={socket} />,
      children: [
        {
          path: "",
          element: <Posts />,
        },
        {
          path: "profile/:id",
          element: <Profile />,
        },
        {
          path: "/home/profile/edit",
          element: <Edit />,
        },
        {
          path: "/home/profile/f/:id",
          element: <Followers />,
        },
        {
          path: "/home/comments/:id",
          element: <Comments />,
        },
        {
          path: "/home/explore",
          element: <Explore socket={socket} />,
        },
        {
          path: "/home/search",
          element: <SearchBar />,
        },
        {
          path: "bookmark",
          element: <SavedPost />,
        },

        
        {
          path: "events",
          element: <Events socket={socket} />,
        },

      ],
    },
    {
      path: "/home/setting",
      children: [
        {
          path: "howToUse",
          element: <HowToUse />,
        },
        {
          path: "general",
          element: <GeneralSettings />,
        },
        {
          path: "privacy",
          element: <PrivacySettings />,
        },
        {
          path: "security",
          element: <SecuritySettings />,
        },
        {
          path: "contact",
          element: <ContactUs />,
        },
      ],
    },

    {
      path: "Admin/Panel",
      element: <AdminDashBoard />,
      children: [
        { path: "", element: <AdminHome /> },
        { path: "users", element: <AdminUsers /> },
        {
          path: "posts",
          element: <AdminPosts />,
          children: [
            {
              path: "comments/:postId",
              element: <AdminComments />,
            },
          ],
        },
        { path: "reports", element: <AdminReports /> },
        {
          path: "Is/Login",
          element: <AdminIsLogin />,
        },
      ],
    },
   {
    path:"*",
    element: <NotFound />
   }
  ]);

  return <div className={`app ${theme}`}>{element}</div>;

  return (
    <div className={`app ${theme}`}>
      {/* <header className="app-header">
        <label htmlFor="theme-select">Choose Theme: </label>
        <select id="theme-select" value={theme} onChange={toggleTheme}>
          {themes.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </header> */}
      {element}
    </div>
  );
}

export default App;
