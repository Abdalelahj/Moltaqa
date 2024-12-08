import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { AiOutlineUsergroupDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts } from "../../../redux/reducers/slicePosts";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveFunnel } from "@nivo/funnel";
import { AiTwotoneFileAdd } from "react-icons/ai";
import { BsPersonLinesFill } from "react-icons/bs";
import { BiSolidReport } from "react-icons/bi";

import "./AdminHome.css";
import { useNavigate } from "react-router-dom";
const AdminHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [followers, setFollowers] = useState({});
  const [growth, setGrowth] = useState([]);
  const token = localStorage.getItem("token");
  const users = useSelector((users) => {
    return users.users.users;
  });
  const posts = useSelector((posts) => {
    return posts.posts.posts;
  });
  const isLogin = users.filter((elem) => {
    return elem.is_login == true;
  });
  
  useEffect(() => {
    axios
      .get("https://moltaqa-it.onrender.com/reacts/likesAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setLikes(result.data.likes);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("https://moltaqa-it.onrender.com/comments/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setComments(result.data.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get("https://moltaqa-it.onrender.com/followers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setGrowth(result.data.data);
        setFollowers(
          result.data.data[result.data.data.length - 1].cumulative_followers
        );
        
      })
      .catch((err) => {
        console.log(err);
      });

      axios
      .get("https://moltaqa-it.onrender.com/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.Posts.length) {
          dispatch(setPosts(res.data.Posts));
        } else {
          dispatch(setPosts([]));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [posts]);


  const FemaleUsers = users.filter((user) => {
    return user.gender == "female";
  });
  const MaleUsers = users.filter((user) => {
    return user.gender == "male";
  });

  const Engagement_Rate =
    (likes.length + posts.length + comments.length) / followers;

  const Follower_Growth =
    (growth[growth.length - 1]?.new_followers -
      growth[growth.length - 2]?.new_followers) /
    growth[growth.length - 2]?.new_followers;

  const data = [
    {
      id: "users",
      label: "users",
      value: users.length,
      color: "hsl(153, 70%, 50%)",
    },
    {
      id: "posts",
      label: "posts",
      value: posts.length,
      color: "hsl(344, 70%, 50%)",
    },
    {
      id: "Post Frequency",
      label: "Post Frequency",
      value: posts.length / 24,
      color: "hsl(183, 70%, 50%)",
    },
    {
      id: "Female Users",
      label: "Female",
      value: FemaleUsers.length,
      color: "hsl(260, 70%, 50%)",
    },
    {
      id: "Male Users",
      label: "Male",
      value: MaleUsers.length,
      color: "hsl(43, 70%, 50%)",
    },
  ];

  const data2 = [
    {
      id: "Active users",
      value: isLogin.length,
      label: "Online",
    },
    {
      id: "Likes/Reactions",
      value: likes.length,
      label: "Likes",
    },
    {
      id: "Comments",
      value: comments.length,
      label: "comments",
    },
    {
      id: "Engagement Rate",
      value: Engagement_Rate || 0,
      label: "Rate",
    },
    {
      id: "Follower Growth",
      value: Math.abs(Follower_Growth) || 0,
      label: "Follower Growth",
    },
  ];
  return (
    <div className="parentHomeAdmin">
      <div className="cards">
        <Card title="Users" bordered={true} hoverable className="card">
          <div className="innerCard">
          <AiOutlineUsergroupDelete className="logosIcon"/>

            <p>{users.length}</p>
            <p>users</p>
          </div>
          <Button
            onClick={() => {
              navigate("./users");
            }}
          >
            show users
          </Button>
        </Card>
        <Card title="Posts" bordered={true} hoverable className="card">
          <div className="innerCard">
          <AiTwotoneFileAdd  className="logosIcon"/>
            <p>{posts.length}</p>
            <p>posts</p>
          </div>

          <Button
            onClick={() => {
              navigate("./posts");
            }}
          >
            show posts
          </Button>
        </Card>
        <Card title="Online" bordered={true} className="card" hoverable>
          <div className="innerCard">
          <BsPersonLinesFill className="logosIcon"/>

            <p>{isLogin.length}</p>
            <p>online users</p>
          </div>
          <Button
            onClick={() => {
              navigate("./Is/Login");
            }}
          >
            show online users
          </Button>
        </Card>
        <Card
         title={'Reports'}
        bordered={true} className="card" hoverable>
          <div className="innerCard">
          <BiSolidReport  className="logosIcon"/>
            <p>2</p>
            <p>reports pending</p>
          </div>
          <Button
            onClick={() => {
              navigate("./Reports");
            }}
          >
            show reports
          </Button>
        </Card>
      </div>
      <div className="statistics">
        <div style={{ height: "400px", width: "600px" }}>
          <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2]],
            }}
            defs={[
              {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            fill={[
              {
                match: {
                  id: "ruby",
                },
                id: "dots",
              },
              {
                match: {
                  id: "c",
                },
                id: "dots",
              },
              {
                match: {
                  id: "go",
                },
                id: "dots",
              },
              {
                match: {
                  id: "python",
                },
                id: "dots",
              },
              {
                match: {
                  id: "scala",
                },
                id: "lines",
              },
              {
                match: {
                  id: "lisp",
                },
                id: "lines",
              },
              {
                match: {
                  id: "elixir",
                },
                id: "lines",
              },
              {
                match: {
                  id: "javascript",
                },
                id: "lines",
              },
            ]}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: "#999",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
          />
        </div>
        <div style={{ height: "400px", width: "400px" }}>
          <ResponsiveFunnel
            data={data2}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            valueFormat=">-.4s"
            colors={{ scheme: "spectral" }}
            borderWidth={20}
            labelColor={{
              from: "color",
              modifiers: [["darker", 3]],
            }}
            beforeSeparatorLength={100}
            beforeSeparatorOffset={20}
            afterSeparatorLength={100}
            afterSeparatorOffset={20}
            currentPartSizeExtension={10}
            currentBorderWidth={40}
            motionConfig="wobbly"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
