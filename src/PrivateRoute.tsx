import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

interface Props {
  children?: ReactNode;
}
const PrivateRoute = ({ children, ...props }: Props) => {
  const { user } = useContext(AuthContext);
  return !!user ? <>{children}</> : <Navigate to={"/login"} />;
};

export default PrivateRoute;
