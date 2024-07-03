"use client";

import Image from "next/image";
import Banner from "@/app/lib/assets/best_dress_banner.jpg";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/clientAppContext";
import Skeleton from "./skeleton";
import SubmitButton from "./submitButton";
import { SubmitVote } from "../actions";
import ConfettiExplosion from "react-confetti-explosion";

function Voting() {
  // Status
  //   0 = Not open yet,
  //   1 = Open for voting,
  //   2 = Ended, result in review,
  //   3 = Ended with result
  const { eventConfig, configLoading, userInfo, userLoading, setShowLogin } =
    useAppContext();
  return (
    <>
      <Image
        className="main_banner"
        src={Banner}
        alt="MCA Best Dress Award 2024"
      />

      {configLoading || userLoading ? (
        <div
          className="row"
          style={{ justifyContent: "center", padding: "2em" }}
        >
          <div className="loader"></div>
        </div>
      ) : (
        <div className="voting row">
          {eventConfig?.best_dress.status == 0 && (
            <div className="message color1">
              "Voting will Begin Shortly, Get Ready to Cast Your Vote: Who Will
              Win the Best Dressed Award?"
            </div>
          )}
          {eventConfig?.best_dress.status == 2 && (
            <div className="message color1">
              "Voting Ended. The Excitement Builds: Results Are Currently Being
              Tallied!"
            </div>
          )}
          {eventConfig?.best_dress.status == 1 && userInfo ? (
            <VotingForm />
          ) : (
            <div
              className="message color1 col"
              style={{ width: "100%", alignItems: "center" }}
            >
              <span>
                "Voting is Happening Now! Enter your seat number to
                participate."
              </span>
              <br />
              <div className="cta_btn" onClick={() => setShowLogin(true)}>
                Enter
              </div>
            </div>
          )}
          {eventConfig?.best_dress.status == 3 && (
            <div className="winner_list col">
              <h1 className="winner_title ">CONGRATULATIONS TO THE WINNERS</h1>
              <div className="col winner">
                <h2 className="color1">BEST DRESS FEMALE WINNER</h2>

                <h1 className="color2">
                  "{eventConfig?.best_dress.winner.female[0].name}"
                </h1>
              </div>
              <div className="col winner">
                <h2 className="color1">BEST DRESS MALE WINNER</h2>

                <h1 className="color2">
                  "{eventConfig?.best_dress.winner.male[0].name}"
                </h1>
              </div>
              <div className="confetti">
                <ConfettiExplosion
                  colors={[
                    "#3C1F13",
                    "#954F2B",
                    "#D8853E",
                    "#FAC972",
                    "#FCF0D6",
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function VotingForm() {
  const [selected, setSelected] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const { eventConfig, userInfo, GetEventInfo, setShowLogin } = useAppContext();

  useEffect(() => {
    setErrorMessage(null);
  }, [selected]);

  useEffect(() => {
    setSelected((prev) => ({
      ...userInfo?.bestDressVote[0],
    }));
  }, [userInfo]);

  const HandleSubmitVote = async () => {
    if (userInfo == null) {
      setShowLogin(true);
      return;
    }

    let formdata = new FormData();
    formdata.append("seat", userInfo.seat);
    formdata.append("male", selected.male);
    formdata.append("female", selected.female);

    let res = await SubmitVote(formdata);

    if (res.success == false) {
      setErrorMessage(res.message);
    } else {
      GetEventInfo();
    }
  };

  return (
    <form
      action={HandleSubmitVote}
      className={`vote_form col ${
        userInfo?.bestDressVote.length ? "voted" : ""
      }`}
    >
      <h1>Best Dressed Male</h1>
      {eventConfig?.best_dress.nominee.male.map((item, index) => (
        <div
          className={`nominee color1 row ${
            selected?.male == item.seat ? "selected_nominee" : ""
          }`}
          key={index}
          onClick={() => {
            setSelected((prev) => ({
              ...prev,
              male: item.seat,
            }));
          }}
        >
          {item.seat} - {item.name}
          <em>You Voted</em>
          <span className="check_icon material-symbols-outlined color5">
            check
          </span>
        </div>
      ))}

      <hr />

      <h1>Best Dressed Female</h1>
      {eventConfig?.best_dress.nominee.female.map((item, index) => (
        <div
          className={`nominee color1 row ${
            selected?.female == item.seat ? "selected_nominee" : ""
          }`}
          key={index}
          onClick={() => {
            setSelected((prev) => ({
              ...prev,
              female: item.seat,
            }));
          }}
        >
          {item.seat} - {item.name}
          <em>You Voted</em>
          <span className="check_icon material-symbols-outlined color5">
            check
          </span>
        </div>
      ))}
      <br />
      {selected && selected.male && selected.female && (
        <>
          {errorMessage ? (
            <p className="color1 warning_message">{errorMessage}</p>
          ) : (
            <p className="color1 warning_message">
              {userInfo?.bestDressVote.length ? (
                "Thank you for your participation. The results will be announced soon."
              ) : (
                <>
                  Please ensure that you are voting as{" "}
                  <strong>
                    {userInfo?.title} {userInfo?.name}
                  </strong>
                </>
              )}
            </p>
          )}

          <br />

          <SubmitButton />
        </>
      )}
    </form>
  );
}

export default Voting;
