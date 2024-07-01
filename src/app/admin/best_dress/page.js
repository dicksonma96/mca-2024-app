"use client";

import "../admin.scss";
import UserTable from "../components/userTable";
import { useEffect, useState } from "react";
import { updateConfig } from "@/app/actions";
import SubmitButton from "../components/submitButton";
import { useAdminContext } from "../adminContext";
import getGenderList from "@/app/lib/utils/getGenderList";
import Loader from "../components/loader";

const eventStatusText = [
  "Not Open Yet",
  "Open for Voting",
  "Ended, Result in Review",
  "Ended, Show Result",
];

function BestDress() {
  const { users, currentConfig, configLoading, GetConfig } = useAdminContext();

  const [eventStatus, setEventStatus] = useState(0);
  const [maleNominee, setMaleNominee] = useState([]);
  const [femaleNominee, setFemaleNominee] = useState([]);
  const [maleWinner, setMaleWinner] = useState([]);
  const [femaleWinner, setFemaleWinner] = useState([]);

  useEffect(() => {
    if (currentConfig) {
      setFemaleNominee(currentConfig.best_dress.nominee.female);
      setMaleNominee(currentConfig.best_dress.nominee.male);
      setFemaleWinner(currentConfig.best_dress.winner.female);
      setMaleWinner(currentConfig.best_dress.winner.male);
    }
  }, [eventStatus]);

  const SubmitUpdateConfig = async () => {
    let data = {
      status: eventStatus,
      nominee: {
        female: femaleNominee.map((item) => item.seat),
        male: maleNominee.map((item) => item.seat),
      },
      winner: {
        female: femaleWinner.map((item) => item.seat),
        male: maleWinner.map((item) => item.seat),
      },
    };
    try {
      const updateConfigData = updateConfig.bind(null, data);
      let res = await updateConfigData(data);
      if (res.success) {
        GetConfig();
      } else throw res.message;
    } catch (e) {
      alert(e.message);
    } finally {
    }
  };

  return configLoading ? (
    <span>Loading...</span>
  ) : (
    <>
      <div className="section_module col">
        <h2>Best Dress Award Voting</h2>
        <hr />
        <CurrentVoteStatus currentConfig={currentConfig} />
        <br />
        <form action={SubmitUpdateConfig}>
          <div className="inputs col">
            <div className="input col">
              <div className="label">Change status to:</div>
              <select
                name="status"
                defaultValue={eventStatus}
                onChange={(e) => {
                  setEventStatus(e.target.value);
                }}
              >
                {eventStatusText.map((item, index) => (
                  <option key={index} value={index}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <br />
          {eventStatus == 1 && (
            <div className="row" style={{ gap: "20px", alignItems: "stretch" }}>
              <div className="input col">
                <div className="label">Female Nominees:</div>
                <div className="nominee_item">1. {femaleNominee[0]?.name}</div>
                <div className="nominee_item">2. {femaleNominee[1]?.name}</div>
                <div className="nominee_item">3. {femaleNominee[2]?.name}</div>
                <div
                  onClick={() => setFemaleNominee([])}
                  style={{
                    alignSelf: "flex-end",
                    color: "grey",
                    fontSize: "1em",
                    cursor: "pointer",
                  }}
                >
                  Remove All
                </div>
                <br />
                <UserTable
                  data={getGenderList(users, "f")}
                  selected={femaleNominee}
                  setSelected={setFemaleNominee}
                />
              </div>
              <div className="input col">
                <div className="label">Male Nominees:</div>
                <div className="nominee_item">1. {maleNominee[0]?.name}</div>
                <div className="nominee_item">2. {maleNominee[1]?.name}</div>
                <div className="nominee_item">3. {maleNominee[2]?.name}</div>
                <div
                  onClick={() => setMaleNominee([])}
                  style={{
                    alignSelf: "flex-end",
                    color: "grey",
                    fontSize: "1em",
                    cursor: "pointer",
                  }}
                >
                  Remove All
                </div>
                <br />

                <UserTable
                  data={getGenderList(users, "m")}
                  selected={maleNominee}
                  setSelected={setMaleNominee}
                />
              </div>
            </div>
          )}
          {eventStatus == 3 && (
            <div className="row" style={{ gap: "20px", alignItems: "stretch" }}>
              <div className="input col">
                <div className="label">Female Winner:</div>
                <div className="nominee_item">1. {femaleWinner[0]?.name}</div>
                <div
                  onClick={() => setFemaleWinner([])}
                  style={{
                    alignSelf: "flex-end",
                    color: "grey",
                    fontSize: "1em",
                    cursor: "pointer",
                  }}
                >
                  Remove All
                </div>
                <br />
                <UserTable
                  data={currentConfig.best_dress.nominee.female}
                  selected={femaleWinner}
                  setSelected={setFemaleWinner}
                  limit={1}
                />
              </div>
              <div className="input col">
                <div className="label">Male Winner:</div>
                <div className="nominee_item">1. {maleWinner[0]?.name}</div>
                <div
                  onClick={() => setMaleWinner([])}
                  style={{
                    alignSelf: "flex-end",
                    color: "grey",
                    fontSize: "1em",
                    cursor: "pointer",
                  }}
                >
                  Remove All
                </div>
                <br />

                <UserTable
                  data={currentConfig.best_dress.nominee.male}
                  selected={maleWinner}
                  setSelected={setMaleWinner}
                  limit={1}
                />
              </div>
            </div>
          )}

          <br />
          <SubmitButton text={"Update"} pending={"Updating"} />
        </form>
      </div>
    </>
  );
}

function CurrentVoteStatus({ currentConfig }) {
  const [loading, setLoading] = useState(false);
  const [voteCount, setVoteCount] = useState(null);

  const GetVoteCount = async () => {
    try {
      setLoading(true);
      let res = await fetch("/api/getVoteCount");
      let resJson = await res.json();
      if (resJson.success) {
        setVoteCount(resJson.data);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentConfig) GetVoteCount();
  }, [currentConfig]);

  const getPercentage = (vote, gender = "m") => {
    let list = voteCount.male;
    if (gender == "f") list = voteCount.female;

    return (vote / list.map((i) => i.vote).reduce((a, b) => a + b)) * 100;
  };

  return (
    <div className="current_config col">
      <div className="current_status">
        Current Voting Event Status:{" "}
        <strong>{eventStatusText[currentConfig?.best_dress.status]}</strong>
      </div>
      {currentConfig?.best_dress.status != 0 && (
        <>
          <br />
          {loading ? (
            <div
              className="row"
              style={{
                height: "150px",
                width: "300px",
                justifyContent: "center",
              }}
            >
              <div className="loader"></div>
            </div>
          ) : (
            <div className="results row">
              <div className="result col">
                <h5>Female result</h5>
                <div className="graph row">
                  {voteCount?.female.map((item, index) => (
                    <div key={index} className="contestant col">
                      <div
                        className="bar"
                        style={{ height: `${getPercentage(item.vote, "f")}%` }}
                      >
                        {item.vote} votes
                      </div>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="result col">
                <h5>Male result</h5>
                <div className="graph row">
                  {voteCount?.male.map((item, index) => (
                    <div key={index} className="contestant col">
                      <div
                        className="bar"
                        style={{ height: `${getPercentage(item.vote, "m")}%` }}
                      >
                        {item.vote} votes
                      </div>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <br />
          <button
            onClick={GetVoteCount}
            className="cta_btn"
            style={{ alignSelf: "flex-start" }}
          >
            Refresh Vote Count
          </button>
        </>
      )}
    </div>
  );
}

export default BestDress;
