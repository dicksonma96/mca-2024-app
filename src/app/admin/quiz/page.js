"use client";

import { useAdminContext } from "../adminContext";
import getAlphabetByNumber from "@/app/lib/utils/getAlphabetByNumber";
import { useState, useRef, useEffect } from "react";
import { UpdateQuiz, UpdateQuizStatus, ResetQuizAnswer } from "@/app/actions";
import UserTable from "../components/userTable";
import Popup from "../components/popup";

function Quizzes() {
  const { currentConfig, GetConfig, users, GetUser, usersLoading } =
    useAdminContext();
  const [loading, setLoading] = useState(false);
  const [openResetData, setOpenResetData] = useState(false);
  const status = [
    'Not Open Yet: "Coming Soon"',
    'Can Play Now: "Play Now"',
    'Ended, Choosing Winner: "Results Pending"',
    'Show Winner: "Winner Announced"',
  ];
  const [quizStatus, setQuizStatus] = useState(currentConfig?.quizzes.status);
  const [quizWinner, setQuizWinner] = useState([]);
  const handleUpdateQuizStatus = async () => {
    if (quizStatus == "3" && quizWinner.length == 0) {
      alert("Please choose a winner");
      return;
    }

    let formdata = new FormData();

    formdata.append("winner", quizWinner[0]?.seat);
    formdata.append("status", quizStatus);
    try {
      setLoading(true);
      let res = await UpdateQuizStatus(formdata);
      await GetConfig();
      await GetUser();
      if (res.success) {
        alert("Successfully updated");
      } else throw res.message;
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  const ResetData = async () => {
    try {
      setLoading(true);
      let res = await ResetQuizAnswer();
      await GetConfig();
      await GetUser();
      if (res.success) {
        alert("Vote reset successful");
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setOpenResetData(false);
      setLoading(false);
    }
  };

  const RandomUser = () => {
    let highest_score = users?.sort((a, b) => b.quiz_score - a.quiz_score)[0]
      .quiz_score;
    let highscorer = users?.filter((user) => user.quiz_score == highest_score);

    setQuizWinner([highscorer[Math.floor(Math.random() * highscorer.length)]]);
  };

  return (
    <>
      <div className="section_module col">
        <h2>Quizzes</h2>
        <hr />
        <div className="current_config col">
          <div className="current_status">
            Current Quizzes Status:{" "}
            <strong>{status[currentConfig?.quizzes.status]}</strong>
          </div>
          <br />
          {currentConfig?.quizzes.status == 3 && (
            <div className="current_status">
              Displayed Winner:{" "}
              <strong>{currentConfig?.quizzes.winner[0].seat}</strong>
              {" - "}
              <strong>{currentConfig?.quizzes.winner[0].name}</strong>
            </div>
          )}
        </div>
        {loading ? (
          <div className="loader"></div>
        ) : (
          <div className="input col">
            <span className="label">Quiz Status:</span>
            <select
              name="status"
              defaultValue={quizStatus}
              onChange={(e) => setQuizStatus(e.target.value)}
            >
              {status.map((state, index) => {
                return (
                  <option key={index} value={`${index}`}>
                    {state}
                  </option>
                );
              })}
            </select>
            <br />
            {quizStatus == "3" && (
              <>
                <div className="input col">
                  <div className="label">Select a Winner:</div>
                  <div className="nominee_item row">
                    {quizWinner[0]?.name || "Choose a winner"}

                    <span
                      className="material-symbols-outlined"
                      style={{
                        marginLeft: "auto",
                        color: "grey",
                        cursor: "pointer",
                      }}
                      onClick={RandomUser}
                    >
                      casino
                    </span>
                  </div>
                </div>
                <UserTable
                  thead={"Partipants & score out of 5"}
                  data={users?.sort((a, b) => b.quiz_score - a.quiz_score)}
                  selected={quizWinner}
                  setSelected={setQuizWinner}
                  limit={1}
                  additionalCol={[
                    {
                      field_name: "quiz_score",
                      width: "20px",
                    },
                  ]}
                />
                <br />
              </>
            )}
            <div className="row" style={{ gap: 10 }}>
              <button
                disabled={loading}
                className="cta_btn"
                style={{ alignSelf: "flex-start" }}
                onClick={handleUpdateQuizStatus}
              >
                {loading ? "Updating" : "Update"}
              </button>

              <button
                disabled={usersLoading}
                className="cta_btn"
                style={{ alignSelf: "flex-start" }}
                onClick={GetUser}
              >
                {usersLoading ? "Refreshing..." : "Refresh"}
              </button>

              <button
                className="cta_btn"
                style={{ background: "red" }}
                onClick={() => {
                  setOpenResetData(true);
                }}
              >
                Reset Guest's Answer
              </button>
            </div>
          </div>
        )}

        <br />
        <hr />

        {currentConfig?.quizzes.quiz.map((ques, index) => (
          <Quiz key={index} index={index} info={ques} />
        ))}
      </div>
      {openResetData && (
        <Popup
          title="Reset Guest's Quiz Answer"
          onClose={() => {
            setOpenResetData(false);
          }}
          onConfirm={ResetData}
        >
          <p>All guest's quiz answer will be removed, are you sure? </p>
        </Popup>
      )}
    </>
  );
}

function Quiz({ info, index }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(info);
  const { GetConfig } = useAdminContext();

  const handleOnChange = (e, target) => {
    setData((prev) => ({
      ...prev,
      [target]: e.target.value,
    }));
  };

  const handleCancel = () => {
    setEditing(false);
    setData(info);
  };

  const handleUpdateQuiz = async () => {
    let formdata = new FormData();
    formdata.append("_id", info._id);
    formdata.append("question", data.question);
    formdata.append("options", JSON.stringify(data.options));
    formdata.append("answer", data.answer);

    try {
      setLoading(true);
      let res = await UpdateQuiz(formdata);
      if (res.success) {
        alert("Successfully updated");
        GetConfig();
        setEditing(false);
      } else throw res.message;
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form action={handleUpdateQuiz} className="quiz col">
      <div className="input col">
        <span className="label">Question {index + 1}:</span>
        <textarea
          value={data.question}
          readOnly={!editing}
          onChange={(e) => handleOnChange(e, "question")}
          required
        />
      </div>
      {editing && (
        <div className="options col">
          {data.options.map((option, index) => (
            <div
              className={`option row ${
                index == data.answer ? "answer_option" : ""
              }`}
              key={index}
            >
              <span>{getAlphabetByNumber(index)}.</span>
              <textarea
                value={option}
                onChange={(e) => {
                  let temp = [...data.options];
                  temp[index] = e.target.value;
                  setData((prev) => ({
                    ...prev,
                    options: temp,
                  }));
                }}
                required
              />

              <div className="btns row">
                {data.answer == index ? (
                  <div className="btn">Answer</div>
                ) : (
                  <>
                    <div
                      className="btn answer_btn"
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          answer: index,
                        }))
                      }
                    >
                      Set this as Answer
                    </div>
                    {data.options.length > 2 && (
                      <div
                        className="btn remove"
                        onClick={() => {
                          setData((prev) => ({
                            ...prev,
                            options: data.options.filter((x, i) => i != index),
                          }));
                        }}
                      >
                        Remove
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div
            className="add_option"
            onClick={() => {
              setData((prev) => ({
                ...prev,
                options: [...data.options, ""],
              }));
            }}
          >
            Add Option
          </div>
        </div>
      )}
      <div className="row" style={{ marginTop: "20px", gap: "10px" }}>
        <div className="col" style={{ flex: 1 }}>
          <span style={{ color: "grey", fontSize: "0.75em" }}>
            * Required at least two option
          </span>
          <span style={{ color: "grey", fontSize: "0.75em" }}>
            * Option cannot be blank
          </span>
        </div>

        {editing ? (
          <>
            <div className="cta_btn2" onClick={handleCancel}>
              Cancel
            </div>
            <button className="cta_btn">Update</button>
          </>
        ) : (
          <>
            <div className="cta_btn" onClick={() => setEditing(true)}>
              Edit
            </div>
          </>
        )}
      </div>
    </form>
  );
}

export default Quizzes;
