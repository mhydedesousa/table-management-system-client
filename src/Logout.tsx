import { Context, useContext, useEffect } from "react";
import "./App.css";

import { AuthContext } from "./contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";

function Logout() {
  const { logout } = useContext(AuthContext);
  useEffect(() => {
    logout();
  });
  return <Navigate to={"/login"} />;
}

export default Logout;
