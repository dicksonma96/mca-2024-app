"use client";

import "./admin.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminContextProvider } from "./adminContext";

function Admin({ children }) {
  const pathname = usePathname();
  return (
    <AdminContextProvider>
      <main className="admin">
        <h1 style={{ fontSize: "2em" }}>MCA 2024 ADMIN PANEL</h1>
        <hr
          style={{ border: "1px dashed rgb(220,220,220)", margin: "1em 0" }}
        />
        <nav className="row">
          <Link
            className={`link ${pathname === "/admin" ? "active" : ""}`}
            href={"/admin"}
          >
            Users
          </Link>
          <Link
            className={`link ${
              pathname === "/admin/best_dress" ? "active" : ""
            }`}
            href={"/admin/best_dress"}
          >
            Best Dress Award
          </Link>
          <Link
            className={`link ${pathname === "/admin/quiz" ? "active" : ""}`}
            href={"/admin/quiz"}
          >
            Quiz
          </Link>
        </nav>
        {children}
      </main>
    </AdminContextProvider>
  );
}

export default Admin;
