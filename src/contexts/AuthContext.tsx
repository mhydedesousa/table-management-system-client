import { ReactNode, createContext, useEffect, useState } from "react";
import { LoginUserDTO, User } from "../interfaces/user";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { loginUser } from "../util/APIUtil";
import jwt from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface AuthContextInterface {
  user: User | null;
  loading: boolean;
  error?: any;
  login: (loginUserDTO: LoginUserDTO) => Promise<void>;
  register: (email: string, name: string, password: string) => void;
  logout: () => void;
  refresh: () => void;
}

interface Props {
  children?: ReactNode;
}

export const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface
);

export const AuthContextProvider = ({ children, ...props }: Props) => {
  const [user, setUser, refresh] = useLocalStorage("user", null);

  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  // add event listener in case something changes in a separate tab
  useEffect(() => {
    window.addEventListener("storage", () => {
      refresh();
    });
  }, []);

  const login = async (loginUserDTO: LoginUserDTO) => {
    setLoading(true);
    try {
      const loginUserResult = await loginUser(loginUserDTO);
      const decodedUser = jwt(loginUserResult.token) as User;
      setUser({
        ...decodedUser,
        token: loginUserResult.token,
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      throw e;
    }
  };

  const register = (email: string, password: string) => {
    setUser({ email });
  };
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};
