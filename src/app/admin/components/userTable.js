import React, { useState } from "react";

function UserTable({
  data,
  selected,
  setSelected,
  limit = 3,
  thead = "Participants",
  additionalCol = [],
}) {
  const [search, setSearch] = useState(null);

  const FilteredData = () => {
    if (search)
      return data.filter((item) => {
        let _search = search.toLowerCase();

        if (item.seat.toLowerCase().includes(_search)) return item;

        if (item.name.toLowerCase().includes(_search)) return item;
      });

    return data;
  };

  return (
    <div className="admin_table">
      <div className="thead row">
        <div className="th">{thead}</div>
      </div>
      <div className="searchbox row">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <span className="material-symbols-outlined icon">search</span>
      </div>
      <div className="tbody col">
        {FilteredData()?.map((item, index) => (
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
            <div className="td" style={{ width: "25px" }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "15px" }}
              >
                {(selected || []).some((s) => s?.seat == item.seat)
                  ? "check_box"
                  : "check_box_outline_blank"}
              </span>
            </div>
            <div className="td" style={{ width: "60px" }}>
              {item.seat}
            </div>
            <div className="td" style={{ width: "170px" }}>
              {item.name}
            </div>
            {additionalCol.map((field, index) => (
              <div
                key={index}
                className="td"
                style={{ width: field.width ? field.width : "auto" }}
              >
                {item[field.field_name]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserTable;
