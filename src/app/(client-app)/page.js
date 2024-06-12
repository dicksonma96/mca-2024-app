import Image from "next/image";
import "@/app/style.scss";
import getDatabase from "@/app/lib/mongo/mongoConnection";
import Banner from "@/app/lib/assets/banner.png";
import Voting from "../components/voting";
import Quiz from "../components/quiz";
import Schedule from "../components/schedule";

export default function Home() {
  const Test = async () => {
    try {
      const db = await getDatabase();
      const collection = db.collection("users");
      const data = await collection.find().toArray();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };
  // Test();

  return (
    <>
      <Image className="main_banner" src={Banner} alt="MCA 2024" />
      <div className="welcome_panel col">
        <h1>WELCOME TO</h1>
        <h5>Motherhood Choice Award 2024</h5>
        <Schedule />
      </div>
      <Voting status={1} />
      <Quiz />
    </>
  );
}
