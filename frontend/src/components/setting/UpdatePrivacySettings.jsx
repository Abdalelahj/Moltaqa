import React, { useState, useEffect } from "react";
import { Form, Select, Input, Button, List, message, Typography } from "antd";
import axios from "axios";

const { Option } = Select;
const { Title } = Typography;

const UpdatePrivacySettings = () => {
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: "public",
    blocked_accounts: [],
  });
  const [BlockPe , setBlockPe] = useState({})
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [unblockUserName, setUnblockUserName] = useState("");
  const [searchUserName, setSearchUserName] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch current privacy settings
  useEffect(() => {
    axios
      .get("https://moltaqa-it.onrender.com/settings/privacy", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const fetchedSettings = response.data.privacySettings;
        setPrivacySettings({
          profile_visibility: fetchedSettings?.profile_visibility || "public", // Default to "public" if undefined
          blocked_accounts: fetchedSettings?.blocked_accounts || [],
        });
      })
      .catch((error) => {
        message.error("Failed to load privacy settings.");
        console.error(error);
      });
  }, []);





  const handleSearchChange = async (value) => {
    setSearchUserName(value); // تحديث النص المدخل في حقل البحث

    // التحقق من أن النص المدخل غير فارغ
    if (value.trim() === "") {
      setAllUsers([]); // إذا كان النص فارغًا، إفراغ قائمة المستخدمين
      return;
    }

    try {
      // إرسال طلب GET للبحث عن المستخدمين بناءً على الاسم
      const response = await axios.get(
        `https://moltaqa-it.onrender.com/users/userName/search/${value}`
      ,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
 
      
      if (response.data.success) {
        setAllUsers(response.data.User); // تحديث قائمة المستخدمين
      } else {
        setAllUsers([]); // إذا لم يتم العثور على مستخدمين
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setAllUsers([]); // إفراغ القائمة إذا حدث خطأ
    }
  };

  // Update privacy settings
  const updateSettings = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://moltaqa-it.onrender.com/settings/privacy",
        {
          profile_visibility: values.profile_visibility,
          blocked_accounts: values.blocked_accounts || undefined,
          unblock_user_name: unblockUserName || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrivacySettings(response.data.privacySettings);
      setUnblockUserName("");
      message.success("Privacy settings updated successfully!");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update settings."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Title level={3}>Update Privacy Settings (Under Editing)</Title>
      <Form
        layout="vertical"
       
        initialValues={{
          profile_visibility: privacySettings.profile_visibility,
        }}
      >
        <Form.Item
          label="Profile Visibility"
          name="profile_visibility"
          rules={[
            { required: true, message: "Please select profile visibility!" },
          ]}
        >
          <Select
            defaultValue={privacySettings.profile_visibility} // Set default value to prevent null warning
          >
            <Option value="public">Public</Option>
            <Option value="private">Private</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Block Accounts" name="blocked_accounts">
          <Select
            mode="multiple" // السماح باختيار عدة مستخدمين
            placeholder="Select users to block" // نص التلميح داخل القائمة
            showSearch // تفعيل البحث داخل القائمة
            filterOption={
              (input, option) =>{

                option.children.toLowerCase().includes(input.toLowerCase()) // تصفية النتائج بناءً على النص المدخل
               
                // setBlockPe({blocked_accounts:input})
              }
              
            }
            
            allowClear // السماح بإلغاء الاختيارات
            value={selectedUsers} // تعيين القيمة المختارة من الحالة
             // استدعاء دالة عند تغيير الاختيار
          >
            {allUsers.length > 0 ? (
              allUsers.map((user) => (
                <Option key={user.user_name} value={user.user_name}>
                  {user.user_name}
                </Option>
              ))
            ) : (
              <Option disabled>No users found</Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item label="Unblock User">
          <Input
            placeholder="Enter username to unblock"
            value={unblockUserName}
            onChange={(e) => setUnblockUserName(e.target.value)}
          
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} onClick={(e)=>{
            // updateSettings
          }}>
            Update Privacy Settings
          </Button>
        </Form.Item>
      </Form>

      <Title level={4}>Blocked Accounts</Title>
      <List
        bordered
        dataSource={privacySettings.blocked_accounts || []} // Safe check for undefined
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </div>
  );
};

export default UpdatePrivacySettings;
