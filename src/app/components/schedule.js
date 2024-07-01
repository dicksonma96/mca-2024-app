"use client";

import { Flipper, Flipped } from "react-flip-toolkit";
import { useState } from "react";
import agenda from "../lib/data/agenda.js";

function Schedule() {
  const [expand, setExpand] = useState(false);
  return (
    <Flipper flipKey={expand}>
      {expand ? (
        <div className="schedule col">
          <div className="schedule_header row">
            <span
              className="material-symbols-outlined color1"
              style={{
                fontSize: "2.5em",
                marginRight: "auto",
                cursor: "pointer",
              }}
              onClick={() => setExpand(false)}
            >
              chevron_left
            </span>
            <div className="col">
              <span className="color1" style={{ fontWeight: "300" }}>
                Motherhood Choice Awards
              </span>
              <Flipped flipId="flip_schedule">
                <h1 className="color2" style={{ fontSize: "1.9em" }}>
                  EVENT SCHEDULE
                </h1>
              </Flipped>
            </div>
            <Flipped flipId="flip_schedule_date">
              <div className="year">
                20
                <br />
                24
              </div>
            </Flipped>
          </div>
          <div className="agenda_listing col">
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
          <h3
            className="color1"
            style={{ fontWeight: 300, alignSelf: "center", fontSize: "2em" }}
          >
            FIN
          </h3>
        </div>
      ) : (
        <div className="schedule_btn row" onClick={() => setExpand(true)}>
          <Flipped flipId="flip_schedule_date">
            <div className="date col">
              <strong className="color1" style={{ fontSize: "1.5em" }}>
                13
              </strong>
              <span className="color3">AUG</span>
            </div>
          </Flipped>

          <div className="col">
            <Flipped flipId="flip_schedule">
              <h1 className="color2">Event Schedule</h1>
            </Flipped>

            <span className="color3">Checkout today agendas</span>
          </div>
          <span
            className="material-symbols-outlined color1"
            style={{ fontSize: "2em", marginLeft: "auto" }}
          >
            chevron_right
          </span>
        </div>
      )}
    </Flipper>
  );
}

export default Schedule;
