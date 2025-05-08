import React from "react";
import { useNavigate } from "react-router-dom";
import "./_notFoundPage.scss"

const NotFoundPage = () => {
  let navigate = useNavigate();

  const navBack = () => {
    navigate("/forumia");
  };

  return (
    <div className = {"errorDiv"}>
      <h1>error</h1>
      <button onClick={navBack}>Back</button>
    </div>
  );
};

export default NotFoundPage;
