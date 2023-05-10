import { Menu } from "antd";
import "./AppHeader.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";

const AppHeader = () => {
  const [current, setCurrent] = useState("/");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const menuItems: any = [
    {
      label: "Home",
      key: "/",
      onClick: () => {
        navigate("/");
      },
      style: { float: "right" },
    },
    {
      label: "Logout",
      key: "/logout",
      onClick: () => {
        navigate("/logout");
      },
      style: { float: "right" },
    },
    {
      label: `${user?.email}`,
      key: `${user?.email}`,
      style: { float: "left" },
    },
  ].reverse();
  return user ? (
    <Menu
      style={{ display: "block" }}
      onClick={(e) => setCurrent(e.key)}
      mode="horizontal"
      selectedKeys={["/"]}
      items={menuItems}
    ></Menu>
  ) : (
    <></>
  );
};
export default AppHeader;
