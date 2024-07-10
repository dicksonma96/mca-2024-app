"use client";

import "./admin.scss";
import { useEffect, useState, useRef } from "react";
import { useAdminContext } from "./adminContext";
import { UpdateUser, DeleteUser, CreateUser, UploadUser } from "../actions";
import Sample from "@/app/lib/assets/csv-data-sample.jpg";
import Image from "next/image";
import Popup from "./components/popup";

function UserListing() {
  const [loading, setLoading] = useState(false);
  const { usersLoading, users, GetUser } = useAdminContext();
  const [fileInput, setFileInput] = useState(null);
  const [openImport, setOpenImport] = useState(false);
  const [search, setSearch] = useState(null);

  const ImportData = async () => {
    try {
      setLoading(true);
      let formdata = new FormData();
      formdata.append("file", fileInput);
      let res = await UploadUser(formdata);
      if (res.success) {
        alert("Successfully updated");
        GetUser();
      } else throw res.message;
    } catch (e) {
      alert(e);
    } finally {
      setOpenImport(false);
      setLoading(false);
    }
  };

  const FilteredData = () => {
    if (search)
      return users?.filter((item) => {
        let _search = search.toLowerCase();

        if (item.seat.toLowerCase().includes(_search)) return item;

        if (item.name.toLowerCase().includes(_search)) return item;
      });

    return users;
  };

  return (
    <>
      <div className="section_module col">
        <h2>MCA 2024 Guests</h2>
        <hr />
        <div className="admin_btns row">
          <div
            className="user_file data_btn"
            onClick={() => {
              setOpenImport(true);
            }}
          >
            Import Data (CSV file)
          </div>

          <input
            style={{ marginLeft: "auto" }}
            type="text"
            placeholder="Search"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        <br />
        <div className="user_table col">
          <div className="thead row">
            <div className="th">Seat</div>
            <div className="th">Title</div>
            <div className="th">Name</div>
            <div className="th">Brand</div>
            <div className="th"></div>
          </div>
          {usersLoading ? (
            <div
              className="row"
              style={{
                width: "100%",
                justifyContent: "center",
                height: "200px",
              }}
            >
              <div className="loader"></div>
            </div>
          ) : (
            <div className="tbody col">
              <AddUser />
              {FilteredData()?.map((user, index) => (
                <User key={index} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
      {openImport && (
        <Popup
          title={"Import"}
          confirmText="Import"
          onClose={() => {
            setOpenImport(false);
          }}
          confirmDisable={!fileInput || loading}
          onConfirm={ImportData}
        >
          <br />
          <input
            onInput={(e) => {
              setFileInput(e.target.files[0]);
            }}
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <br />
          <a
            href="https://docs.google.com/spreadsheets/d/1DmPXEbvT_uzbhAEwVXo1FPXgfFmt_aIwNfCBr9Ta_Pw/copy"
            target="_blank"
          >
            Get A Data Template
          </a>
        </Popup>
      )}
    </>
  );
}

function User({ user }) {
  const titleOptions = ["Mr", "Ms", "Mdm"];
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(user);
  const { GetUser } = useAdminContext();

  const handleUpdateUser = async () => {
    let formdata = new FormData();
    formdata.append("_id", user._id);
    formdata.append("seat", userData.seat);
    formdata.append("title", userData.title);
    formdata.append("name", userData.name);
    formdata.append("brand", userData.brand);

    try {
      setLoading(true);
      let res = await UpdateUser(formdata);
      if (res.success) {
        alert("Successfully updated");
        GetUser();
        setEditing(false);
      } else throw res.message;
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserData(user);
    setEditing(false);
  };

  const handleOnChange = (e, target) => {
    setUserData((prev) => ({
      ...prev,
      [target]: e.target.value,
    }));
  };

  const handleDelete = async () => {
    let formdata = new FormData();
    formdata.append("seat", userData.seat);

    try {
      setLoading(true);
      let res = await DeleteUser(formdata);
      if (res.success) {
        alert("Successfully updated");
        GetUser();
        setEditing(false);
      } else throw res.message;
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="tr row" style={{ padding: "5px" }}>
      <div
        className="loader"
        style={{ fontSize: "0.5em", margin: "0 auto", gridColumn: "1 / -1" }}
      ></div>
    </div>
  ) : (
    <form action={handleUpdateUser} className="tr row">
      <div className="td">
        {
          <input
            type="text"
            value={userData.seat}
            readOnly={!editing}
            onChange={(e) => handleOnChange(e, "seat")}
            required
          />
        }
      </div>
      <div className="td">
        <select
          disabled={!editing}
          onChange={(e) => handleOnChange(e, "title")}
          defaultValue={userData.title}
        >
          {titleOptions.map((opt, index) => (
            <option key={index} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="td">
        <input
          type="text"
          onChange={(e) => handleOnChange(e, "name")}
          readOnly={!editing}
          value={userData.name}
          required
        />
      </div>
      <div className="td">
        <input
          type="text"
          onChange={(e) => handleOnChange(e, "brand")}
          readOnly={!editing}
          value={userData.brand}
          required
        />
      </div>

      <div className="td row btns">
        {editing ? (
          <>
            <button className="btn">Update</button>
            <div className="btn btn2" onClick={handleCancel}>
              Cancel
            </div>
          </>
        ) : deleting ? (
          <>
            <div
              className="btn"
              onClick={handleDelete}
              style={{ background: "red" }}
            >
              Confirm Delete
            </div>
            <div className="btn btn2" onClick={() => setDeleting(false)}>
              Cancel
            </div>
          </>
        ) : (
          <>
            <div className="btn" onClick={() => setEditing(true)}>
              Edit
            </div>
            <div className="btn btn2" onClick={() => setDeleting(true)}>
              Delete
            </div>
          </>
        )}
      </div>
    </form>
  );
}

function AddUser() {
  const titleOptions = ["Mr", "Ms", "Mdm"];
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    seat: "",
    title: "Mr",
    name: "",
    brand: "",
  });
  const { GetUser } = useAdminContext();

  const handleAddUser = async () => {
    let formdata = new FormData();
    formdata.append("seat", userData.seat);
    formdata.append("title", userData.title);
    formdata.append("name", userData.name);
    formdata.append("brand", userData.brand);

    try {
      setLoading(true);
      let res = await CreateUser(formdata);
      if (res.success) {
        alert("Successfully added");
        GetUser();
      } else throw res.message;
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserData(null);
    setConfirm(false);
  };

  const handleOnChange = (e, target) => {
    setUserData((prev) => ({
      ...prev,
      [target]: e.target.value,
    }));
  };

  return loading ? (
    <div className="tr row" style={{ padding: "5px" }}>
      <div
        className="loader"
        style={{ fontSize: "0.5em", margin: "0 auto", gridColumn: "1 / -1" }}
      ></div>
    </div>
  ) : (
    <form action={handleAddUser} className="tr row">
      <div className="td">
        {
          <input
            type="text"
            value={userData?.seat}
            onChange={(e) => handleOnChange(e, "seat")}
            required
          />
        }
      </div>
      <div className="td">
        <select
          onChange={(e) => handleOnChange(e, "title")}
          defaultValue={userData?.title}
        >
          {titleOptions.map((opt, index) => (
            <option key={index} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="td">
        <input
          type="text"
          onChange={(e) => handleOnChange(e, "name")}
          value={userData?.name}
          required
        />
      </div>
      <div className="td">
        <input
          type="text"
          onChange={(e) => handleOnChange(e, "brand")}
          value={userData?.brand}
          required
        />
      </div>

      <div className="td row btns">
        {confirm ? (
          <>
            <button className="btn">Confirm</button>
            <div className="btn btn2" onClick={handleCancel}>
              Cancel
            </div>
          </>
        ) : (
          <>
            <div className="btn" onClick={() => setConfirm(true)}>
              Add New Guest
            </div>
          </>
        )}
      </div>
    </form>
  );
}

export default UserListing;
