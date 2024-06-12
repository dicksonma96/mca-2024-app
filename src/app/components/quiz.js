"use client";

import Image from "next/image";
import Banner from "@/app/lib/assets/quiz_banner.jpg";
import { Flipper, Flipped } from "react-flip-toolkit";
import { useState } from "react";
import getAlphabetByNumber from "../lib/utils/getAlphabetByNumber";

function Quiz() {
  const [expand, setExpand] = useState(false);
  return (
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
              <Image className="banner" src={Banner} alt="MCA 2024 Quiz" />
            </Flipped>
            <QuizContent />
          </div>
        </div>
      ) : (
        <Flipped flipId="flip_banner">
          <Image
            onClick={() => setExpand(true)}
            className="banner"
            src={Banner}
            alt="MCA 2024 Quiz"
          />
        </Flipped>
      )}
    </Flipper>
  );
}
function QuizContent() {
  const questions = [
    {
      id: 1,
      question:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
      options: [
        "Answer A Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        "Answer B",
        "Answer C",
        "Answer D",
      ],
    },
    {
      id: 2,
      question: "Lorem ipsum dolor sit amet 22?",
      options: ["Answer A", "Answer B", "Answer C", "Answer D"],
    },
    {
      id: 3,
      question:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem, tempore magni deleniti ut consectetur repudiandae eius rem quis corporis ullam.",
      options: ["Answer A", "Answer B", "Answer C", "Answer D"],
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});

  const NavigateQuestion = (nav) => {
    setCurrent((prev) => {
      if (prev + nav > questions.length - 1) return prev;

      if (prev + nav < 0) return prev;

      return prev + nav;
    });
  };

  return (
    <div className="quiz_content col">
      <h1>
        Question {current + 1}/{questions.length}
      </h1>
      <div className="progress_bar row">
        {questions.map((item, index) => (
          <div
            style={{
              background:
                index == current ? "#e9c394" : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>

      <div className="question color2">{questions[current].question}</div>

      <div className="options col">
        {questions[current].options.map((option, index) => (
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

      <div className="nav_btns row">
        {current > 0 && (
          <div className="nav_btn prev" onClick={() => NavigateQuestion(-1)}>
            Previous
          </div>
        )}
        {current < questions.length - 1 && (
          <div className="nav_btn next" onClick={() => NavigateQuestion(1)}>
            Next
          </div>
        )}

        {current == questions.length - 1 && (
          <button className="cta_btn" style={{ marginLeft: "auto" }}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;
