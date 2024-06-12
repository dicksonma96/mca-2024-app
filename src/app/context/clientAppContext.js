"use client";
import { useState, createContext, useContext } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  return (
    <AppContext.Provider
      value={{
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
