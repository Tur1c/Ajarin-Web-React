import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "./useLocalStorage";

interface AuthContextType {
  user: string;
}

const AuthContext = createContext<AuthContextType>({
  user: "",
});

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useSessionStorage("jwt", "");
  const [user, setUser] = useSessionStorage("user", "");
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data: any) => {
    setUser(data.accountLogin.email);
    setToken(data.token);
    navigate("/");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser("");
    setToken("");
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
