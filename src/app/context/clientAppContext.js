"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { SignIn } from "../actions";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [eventConfig, setEventConfig] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [configLoading, setConfigLoading] = useState(false);
  const [error, setError] = useState(null);

  const GetEventInfo = async () => {
    try {
      setConfigLoading(true);
      await GetUserInfo();
      let res = await fetch("/api/getEventInfo").then((r) => r.json());
      console.log(res);
      if (res.success) setEventConfig(res.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setConfigLoading(false);
    }
  };

  const GetUserInfo = async () => {
    let user_seat = localStorage.getItem("mca-2024-seat");
    if (user_seat == null) {
      setUserInfo(null);
      setUserLoading(false);
      return;
    }
    let formData = new FormData();
    formData.append("seat", user_seat);
    setUserLoading(true);
    let res = await SignIn(formData);
    setUserLoading(false);
    if (res.success) setUserInfo(res.data);
  };

  useEffect(() => {
    GetEventInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("mca-2024-seat", userInfo.seat);
    }
    console.log(userInfo);
  }, [userInfo]);

  return (
    <AppContext.Provider
      value={{
        userInfo,
        setUserInfo,
        eventConfig,
        configLoading,
        GetEventInfo,
        GetUserInfo,
        userLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
