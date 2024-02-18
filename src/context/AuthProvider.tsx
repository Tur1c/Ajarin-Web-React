import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

interface AuthContextType {
  user: string;
}

const AuthContext = createContext<AuthContextType>({
  user: "",
});

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useLocalStorage("jwt", "");
  const [user, setUser] = useLocalStorage("user", "");
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data: any) => {
    console.log(data);

    setUser(data.accountLogin.email);
    setToken(data.token);
    navigate("/");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    setToken(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
