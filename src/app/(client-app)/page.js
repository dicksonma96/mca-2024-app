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
  const { userInfo } = useAppContext();

  return (
    <>
      <Image className="main_banner" src={Banner} alt="MCA 2024" />
      <div className="welcome_panel col">
        {userInfo ? (
          <>
            <h1>WELCOME TO MCA 2024</h1>
            <h5>
              {userInfo?.title} {userInfo?.name} from {userInfo.brand}, Table
              Seat: {userInfo.seat}
            </h5>
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
      {userInfo == null && <Login />}
    </>
  );
}
