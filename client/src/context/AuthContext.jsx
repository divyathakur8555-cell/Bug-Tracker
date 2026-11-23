
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser
} from "../services/authService";

const C = createContext(null);

export const useAuthContext = () => useContext(C);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("trackwise_token");

    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((data) => {
        setUser(data.user || data);
      })
      .catch(() => {
        localStorage.removeItem("trackwise_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = (data) => {
    const token = data.token || data.data?.token;
    const loggedInUser = data.user || data.data?.user;

    if (!token || !loggedInUser) {
      throw new Error("Authentication response is incomplete.");
    }

    localStorage.setItem("trackwise_token", token);
    setUser(loggedInUser);
  };

  const login = async (formData) => {
    const data = await loginUser(formData);
    save(data);
    return data;
  };

  const register = async (formData) => {
    const data = await registerUser(formData);
    save(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("trackwise_token");
    setUser(null);
  };

  return (
    <C.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </C.Provider>
  );
}
