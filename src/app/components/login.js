"use client";

import { useEffect, useState } from "react";
import { SignIn } from "../actions";
import SubmitButton from "./submitButton";
import Loader from "./loader";
import { useAppContext } from "../context/clientAppContext";

function Login() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const { userInfo, setUserInfo, userLoading, showLogin, setShowLogin } =
    useAppContext();
  const [tableNo, setTableNo] = useState("");
  const [seatNo, setSeatNo] = useState("");

  const handleSignIn = async () => {
    let formData = new FormData();
    formData.append("seat", `${tableNo}-${seatNo}`);
    let res = await SignIn(formData);
    if (res.success) {
      setUserInfo(res.data);
      setShowLogin(false);
    } else {
      setError(res.message);
    }
  };

  useEffect(() => {
    setError(null);
    setSeatNo("");
    setTableNo("");
  }, []);
  useEffect(() => {
    setError(null);
  }, [tableNo, seatNo]);

  return showLogin ? (
    <div className="login_popup col">
      {userLoading ? (
        <Loader />
      ) : (
        <form action={handleSignIn} className="login_window col">
          <span
            className="material-symbols-outlined close_btn"
            onClick={() => {
              setShowLogin(false);
            }}
          >
            close
          </span>

          <h1 className="color1">
            Please enter your <br /> seat number
          </h1>
          {error && <div className="error">{error}</div>}

          {pending ? (
            <Loader />
          ) : (
            <div className="seat_input row">
              <div className="col">
                <em>Table Number:</em>
                <TwoDigitInput value={tableNo} setValue={setTableNo} />
              </div>
              <strong>-</strong>
              <div className="col">
                <em>Seat Number:</em>
                <TwoDigitInput value={seatNo} setValue={setSeatNo} />
              </div>
            </div>
          )}
          <br />
          <SubmitButton setLoading={setPending} text={"Confirm"} />
        </form>
      )}
    </div>
  ) : (
    <></>
  );
}

const TwoDigitInput = ({ value, setValue }) => {
  const handleChange = (e) => {
    let inputValue = e.target.value;

    // Remove any non-numeric characters
    inputValue = inputValue.replace(/[^0-9]/g, "");

    // Trim to two digits
    if (inputValue.length > 2) {
      inputValue = inputValue.slice(0, 2);
    }

    setValue(inputValue);
  };

  const handleBlur = () => {
    // Prepend 0 if necessary and ensure the value is exactly two digits
    if (value.length === 1) {
      setValue("0" + value);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      maxLength={2}
      required
    />
  );
};

export default Login;
