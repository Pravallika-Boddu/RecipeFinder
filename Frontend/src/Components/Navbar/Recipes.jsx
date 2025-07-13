import React from "react";
const Recipes = ({ userType }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "24px" }}>
      {userType === "chef" ? "Welcome, Chef!" : "Welcome, User!"}
    </div>
  );
};

export default Recipes;
