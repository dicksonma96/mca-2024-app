"use client";

import Image from "next/image";
import Banner from "@/app/lib/assets/quiz_banner.jpg";
import { Flipper, Flipped } from "react-flip-toolkit";
import { useEffect, useState } from "react";
import getAlphabetByNumber from "../lib/utils/getAlphabetByNumber";
import { useAppContext } from "../context/clientAppContext";
import { SubmitAnswer } from "@/app/actions";

function Quiz() {
  const [expand, setExpand] = useState(false);
  const { userInfo, eventConfig, setShowLogin } = useAppContext();
  const status = [
    "Coming Soon",
    "Play Now",
    "Ended, Choosing Winner",
    "Winner Announced",
  ];

  const openQuiz = () => {
    if (eventConfig?.quizzes.status == 1) {
      if (userInfo) {
        setExpand(true);
        return;
      }
      setShowLogin(true);
    }
  };
  return (
    <>
      <Flipper flipKey={expand} className="quiz col">
        {expand ? (
          <div
            className="quiz_popup col"
            onClick={(e) => {
              setExpand(false);
            }}
          >
            <div className="quiz_body col" onClick={(e) => e.stopPropagation()}>
              <Flipped flipId="flip_banner">
                <Image
                  onClick={(e) => {
                    setExpand(false);
                  }}
                  className="banner"
                  src={Banner}
                  alt="MCA 2024 Quiz"
                />
              </Flipped>
              <QuizContent />
            </div>
          </div>
        ) : (
          <Flipped flipId="flip_banner">
            <div className="banner_container">
              <div
                className={`quiz_status ${
                  eventConfig?.quizzes.status == 1 ? "status_active" : ""
                }`}
              >
                {status[eventConfig?.quizzes.status]}
              </div>
              <Image
                onClick={openQuiz}
                src={Banner}
                alt="MCA 2024 Quiz"
                className="banner"
              />
            </div>
          </Flipped>
        )}
      </Flipper>
      {eventConfig?.quizzes.status == 3 && (
        <div
          className="winner_list col"
          style={{ padding: "1em 2em", background: "#2d1e1b" }}
        >
          <h1 className="winner_title ">CONGRATULATIONS TO THE WINNER</h1>
          <div className="col winner">
            <h2 className="color1" style={{ background: "#2d1e1b" }}>
              MCA 2024 QUIZZES WINNER
            </h2>
            <h1 className="color2">"{eventConfig?.quizzes.winner[0].name}"</h1>
          </div>
        </div>
      )}
    </>
  );
}
function QuizContent() {
  const {
    eventConfig,
    GetEventInfo,
    configLoading,
    userInfo,
    userLoading,
    GetUserInfo,
  } = useAppContext();

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setErrorMessage(null);
  }, [selected]);

  const NavigateQuestion = (nav) => {
    setCurrent((prev) => {
      if (prev + nav > eventConfig.quizzes.quiz.length - 1) return prev;

      if (prev + nav < 0) return prev;

      return prev + nav;
    });
  };

  const HandleSubmitAnswer = async () => {
    if (Object.keys(selected).length === 0) {
      setCurrent(0);
      setErrorMessage(
        "Make sure to answer all the question before you submit :)"
      );
      return;
    }

    if (
      eventConfig.quizzes.quiz.some((value, index) => {
        if (!Object.keys(selected).includes(index.toString())) {
          setCurrent(index);
          setErrorMessage(
            "Make sure to answer all the question before you submit :)"
          );
          return true;
        }
      })
    )
      return;

    let selected_array = Object.keys(selected).map((key) => selected[key]);
    let formdata = new FormData();
    formdata.append("seat", userInfo.seat);
    formdata.append("answer", JSON.stringify(selected_array));
    setLoading(true);
    let res = await SubmitAnswer(formdata);
    setLoading(false);
    if (res.success == false) {
      setErrorMessage(res.message);
    } else {
      GetEventInfo();
      GetUserInfo();
    }
  };

  return configLoading && userLoading ? (
    <div
      className="row"
      style={{ justifyContent: "center", alignItems: "center", height: "10em" }}
    >
      <div className="loader"></div>
    </div>
  ) : userInfo.quiz_answer.length ? (
    <div className="quiz_content col">
      {eventConfig.quizzes.quiz.map((ques, index) => (
        <div className="col" key={index}>
          <div
            className="question color2 row"
            style={{ alignItems: "flex-start" }}
          >
            <span style={{ marginRight: "0.5em" }}>Q{index + 1 + "."}</span>
            <p>{ques.question}</p>
          </div>
          <div className="options col">
            {ques.options.map((option, i) => (
              <div
                className={`option row ${
                  userInfo.quiz_answer[0].answer[index] == i
                    ? "selected_option"
                    : ""
                }`}
                key={i}
              >
                <span>{getAlphabetByNumber(i)} -</span>
                <p>{option}</p>
                <em style={{ marginLeft: "auto" }}>Your Answer</em>
              </div>
            ))}
          </div>
          <br />
          <br />
        </div>
      ))}

      <div className="message">
        "Thank you for participating. We have received your submission"
      </div>
    </div>
  ) : (
    <div className="quiz_content col">
      <h1>
        Question {current + 1}/{eventConfig.quizzes.quiz.length}
      </h1>
      <div className="progress_bar row">
        {eventConfig.quizzes.quiz.map((item, index) => (
          <div
            key={index}
            style={{
              background:
                index == current ? "#e9c394" : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>

      <div className="question color2">
        {eventConfig.quizzes.quiz[current].question}
      </div>

      <div className="options col">
        {eventConfig.quizzes.quiz[current].options.map((option, index) => (
          <div
            className={`option row ${
              selected[current] == index ? "selected_option" : ""
            }`}
            key={index}
            onClick={() => {
              setSelected((prevState) => ({
                ...prevState,
                [current]: index,
              }));
            }}
          >
            <span>{getAlphabetByNumber(index)} -</span>
            <p>{option}</p>
          </div>
        ))}
      </div>
      {errorMessage && <div className="message">{errorMessage}</div>}

      <div className="nav_btns row">
        {current > 0 && (
          <div className="nav_btn prev" onClick={() => NavigateQuestion(-1)}>
            Previous
          </div>
        )}
        {current < eventConfig.quizzes.quiz.length - 1 && (
          <div className="nav_btn next" onClick={() => NavigateQuestion(1)}>
            Next
          </div>
        )}

        {current == eventConfig.quizzes.quiz.length - 1 && (
          <button
            onClick={HandleSubmitAnswer}
            className="cta_btn"
            style={{ marginLeft: "auto" }}
            disabled={loading}
          >
            {loading ? "Submiting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;
