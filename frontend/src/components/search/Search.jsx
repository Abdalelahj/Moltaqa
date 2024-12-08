import React, { useEffect, useState } from "react";
import axios from "axios";
import './search.css'
// import { Input, List, message } from "antd";
import { Input, List, Avatar, Button, FloatButton ,message} from "antd";
import VirtualList from 'rc-virtual-list';
const fakeDataUrl =
'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 400;
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../redux/reducers/sliceUser";
import { useNavigate } from "react-router-dom";
const Search = ({searchTerm}) => {
  const [display , setdisplay] = useState(true)
  const navigate = useNavigate()
  const arrStr = searchTerm.split('')
  const userArr = searchTerm.split('')
  const [data, setData] = useState([]);
  const dispatch = useDispatch()
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

    const token = localStorage.getItem("token");
    const users = useSelector((reducers)=>{

      return reducers.users.users
    })
    const searchFun = ()=>{
      users.map((elem,ind)=>{
          console.log(data);
          console.log(elem);
          
        if ((elem.user_name == searchTerm || elem.first_name == searchTerm || elem.last_name == searchTerm) && !data.includes(elem)
        ) {
          setData([...data , elem])  
           
        }   
        
         
           
          
        
      })
     }
   useEffect(()=>{
    axios 
    .get(`https://moltaqa-it.onrender.com/users/userName/search/${searchTerm}` ,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((result)=>{
      console.log(result.data.User);
       setData(result.data.User)
      // dispatch(getAllUsers(result.data.Users))
      
    }).catch((err)=>{ 
      console.log(err);
      
    })  


   } ,[])
   

 
  
  
  const onScroll = (e) => {
    // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
    if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
      appendData();
    }
  };
  
  return (
    <div className={display ? "List-Users" : 'List-Users-Non'}>
    
    
      <List >
      <VirtualList
        data={data}
        height={ContainerHeight}
        itemHeight={47}
        itemKey="email"
        onScroll={onScroll}
      >
        {(item) => (
          
          <List.Item key={item.email}>
            
            
            
            <List.Item.Meta
            
              avatar={<Avatar src={item.profile_image} />}
              title={<p onClick={(e)=>{
                navigate(`/home/profile/${item.user_id}`)
                setdisplay(false)
              }} className="last_Name_Search">{item.last_name}</p>}
              description={item.user_name}
            />
           
          </List.Item>
        )}
      </VirtualList>
    </List>
     </div>
  );
};

export default Search;
