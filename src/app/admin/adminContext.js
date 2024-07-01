"use client";
import { useState, useEffect, createContext, useContext } from "react";

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [users, setUsers] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(null);

  const GetUser = async () => {
    try {
      setUsersLoading(true);
      let res = await fetch("/api/getUsers").then((r) => r.json());
      if (res.success) setUsers(res.data);
    } catch (e) {
      alert(e.message);
    } finally {
      setUsersLoading(false);
    }
  };

  const GetConfig = async () => {
    try {
      setConfigLoading(true);
      let res = await fetch("/api/getEventInfo?role=admin");
      let resJson = await res.json();
      if (resJson.success) {
        setCurrentConfig(resJson.data);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setConfigLoading(false);
    }
  };

  useEffect(() => {
    GetUser();
    GetConfig();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        users,
        usersLoading,
        GetUser,
        configLoading,
        currentConfig,
        GetConfig,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  return useContext(AdminContext);
};
