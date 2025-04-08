import React, { createContext, useState, useContext, useEffect } from "react";
import LoadingScreen from "../components/common/LoadingScreen";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      navigate(`/${user.userType}-home`);
    }
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (loggedUser && loggedUser.userType) {
      setUser(loggedUser);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      navigate(`/${loggedUser.userType}-home`);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [, navigate]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {loading ? <LoadingScreen message="בודק פרטי התחברות..." /> : children}
      {/* {children} */}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
