"use client";

import { Flipper, Flipped } from "react-flip-toolkit";
import { useState } from "react";
import agenda from "../lib/data/agenda.js";

function Schedule() {
  const [expand, setExpand] = useState(true);
  return (
    <Flipper flipKey={expand} className="schedule">
      <div
        className="schedule_btn row"
        onClick={() => setExpand((prev) => !prev)}
      >
        <div className="date col">
          <strong className="color1" style={{ fontSize: "1.5em" }}>
            13
          </strong>
          <span className="color3">AUG</span>
        </div>

        <div className="col">
          <h1 className="color2">Event Schedule</h1>
          <span className="color3">Checkout today's agenda</span>
        </div>
        <span
          className="material-symbols-outlined color1"
          style={{
            fontSize: "2em",
            marginLeft: "auto",
            rotate: expand ? "180deg" : "0deg",
            transition: "0.2s",
          }}
        >
          keyboard_arrow_down
        </span>
        <Flipped flipId="flip_line">
          <hr />
        </Flipped>
      </div>
      {expand && (
        <div className="agenda_listing col">
          <Flipped flipId="flip_line">
            <hr />
          </Flipped>
          {agenda.map((agenda, index) => (
            <div className="agenda row" key={index}>
              <div className="time">{agenda?.time}</div>
              <div className="col">
                <strong className="color1">{agenda?.agenda}</strong>
                <ul>
                  {agenda?.description?.map((desc, index) => (
                    <li key={index}>{desc}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </Flipper>
  );
}

export default Schedule;
