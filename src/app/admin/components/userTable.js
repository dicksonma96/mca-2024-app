import React from "react";

function UserTable({
  data,
  selected,
  setSelected,
  limit = 3,
  thead = "Participants",
}) {
  return (
    <div className="admin_table">
      <div className="thead row">
        <div className="th">{thead}</div>
      </div>
      <div className="tbody col">
        {data?.map((item, index) => (
          <div
            className="tr"
            key={index}
            onClick={() => {
              setSelected((prev) => {
                if (prev?.some((s) => s?.seat == item.seat))
                  return prev?.filter((s) => s?.seat != item.seat);

                if (prev?.length >= limit) {
                  return prev;
                }

                return [...prev, item];
              });
            }}
          >
            <div className="td">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "15px" }}
              >
                {(selected || []).some((s) => s?.seat == item.seat)
                  ? "check_box"
                  : "check_box_outline_blank"}
              </span>
            </div>
            <div className="td">{item.seat}</div>
            <div className="td">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserTable;
