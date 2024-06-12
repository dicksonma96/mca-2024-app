"use client";

import Image from "next/image";
import Banner from "@/app/lib/assets/best_dress_banner.jpg";
import { useState } from "react";
import toTwoDigits from "../lib/utils/toTwoDigits";

function Voting({ status }) {
  // Status
  //   0 = Not open yet,
  //   1 = Open for voting,
  //   2 = Ended, result in review,
  //   3 = Ended with result
  return (
    <>
      <Image
        className="main_banner"
        src={Banner}
        alt="MCA Best Dress Award 2024"
      />

      <div className="voting row">
        {status == 0 && (
          <div className="message color1">
            "Voting will Begin Shortly, Get Ready to Cast Your Vote: Who Will
            Win the Best Dressed Award?"
          </div>
        )}
        {status == 2 && (
          <div className="message color1">
            "The Excitement Builds: Results Are Currently Being Tallied!"
          </div>
        )}
        {status == 1 && <VotingForm />}
      </div>
    </>
  );
}

function VotingForm() {
  const sample = {
    male: [
      {
        id: 1,
        name: "Jinny Tiow",
      },
      {
        id: 5,
        name: "Jinny Wong",
      },
      {
        id: 15,
        name: "Jinny Tan",
      },
    ],
    female: [
      {
        id: 3,
        name: "Jimmy 1",
      },
      {
        id: 7,
        name: "Jimmy 2",
      },
      {
        id: 20,
        name: "Jimmy 3",
      },
    ],
  };
  const [nominee, setNominee] = useState([]);
  const [selected, setSelected] = useState();

  return (
    <div className="vote_form col">
      <h1>Best Dressed Male</h1>
      {sample.male.map((item, index) => (
        <div
          className={`nominee color1 row ${
            selected?.male == item.id ? "selected_nominee" : ""
          }`}
          key={index}
          onClick={() => {
            setSelected((prev) => ({
              ...prev,
              male: item.id,
            }));
          }}
        >
          {toTwoDigits(item.id)} - {item.name}
          <span
            className="check_icon material-symbols-outlined color5"
            style={{ fontSize: "1.5em", marginLeft: "auto" }}
          >
            check
          </span>
        </div>
      ))}

      <hr />

      <h1>Best Dressed Female</h1>
      {sample.female.map((item, index) => (
        <div
          className={`nominee color1 row ${
            selected?.female == item.id ? "selected_nominee" : ""
          }`}
          key={index}
          onClick={() => {
            setSelected((prev) => ({
              ...prev,
              female: item.id,
            }));
          }}
        >
          {toTwoDigits(item.id)} - {item.name}
          <span
            className="check_icon material-symbols-outlined color5"
            style={{ fontSize: "1.5em", marginLeft: "auto" }}
          >
            check
          </span>
        </div>
      ))}
      <br />
      {selected && selected.male && selected.female && (
        <button className="cta_btn">Submit</button>
      )}
    </div>
  );
}

export default Voting;
