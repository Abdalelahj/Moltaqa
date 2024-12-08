import React, { useState } from "react";
import axios from "axios";

const UpdateSecuritySettings = () => {
  const [formData, setFormData] = useState({
    two_factor_auth: false,
  });


  // Handle change for toggling two-factor authentication
  const handleToggle = (e) => {
    setFormData({ ...formData, two_factor_auth: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put("https://moltaqa-it.onrender.com/settings/security", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        alert("Security settings updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating security settings:", error);
        alert("Error updating security settings.");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Security Settings</h2>

      {/* Two-Factor Authentication */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.two_factor_auth}
            onChange={handleToggle}
          />
          Enable Two-Factor Authentication
        </label>
      </div>

      {/* Submit Button */}
      <button type="submit">Update Security Settings</button>
    </form>
  );
};

export default UpdateSecuritySettings;
