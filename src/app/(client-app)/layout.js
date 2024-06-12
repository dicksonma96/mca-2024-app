import React from "react";
import { AppContextProvider } from "../context/clientAppContext";

function Layout({ children }) {
  return (
    <AppContextProvider>
      <main className="client_app">{children}</main>
    </AppContextProvider>
  );
}

export default Layout;
