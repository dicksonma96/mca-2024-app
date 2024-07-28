"use client";
import Image from "next/image";
import "@/app/style.scss";
import Banner from "@/app/lib/assets/banner.png";
import Voting from "../components/voting";
import Quiz from "../components/quiz";
import Schedule from "../components/schedule";
import Login from "../components/login";
import { useAppContext } from "../context/clientAppContext";

export default function Home() {
  const { userInfo, userLoading, configLoading, setShowLogin } =
    useAppContext();

  return (
    <>
      {(userLoading || configLoading) && (
        <div
          className="row"
          style={{
            justifyContent: "center",
            zIndex: "999",
            background: "rgba(0,0,0,0.5)",
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <div className="loader"></div>
        </div>
      )}
      <Image className="main_banner" src={Banner} alt="MCA 2024" />
      <div className="welcome_panel col">
        {userInfo ? (
          <>
            <h1>
              {userInfo?.title} {userInfo?.name}
              {", "}
              {userInfo?.brand && `from ${userInfo?.brand}`} <br />{" "}
            </h1>
            <div className="row">
              <h5>
                Table {userInfo?.seat.split("-")[0]}, Seat{" "}
                {userInfo?.seat.split("-")[1]}
              </h5>
              <em onClick={() => setShowLogin(true)}>Edit Seat Number</em>
            </div>
          </>
        ) : (
          <>
            <h1>WELCOME TO</h1>
            <h5>Motherhood Choice Award 2024</h5>
          </>
        )}

        <Schedule />
      </div>
      <Voting />
      <Quiz />
      <Login />
    </>
  );
}
