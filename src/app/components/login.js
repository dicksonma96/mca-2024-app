"use client";

import { useState } from "react";
import { SignIn } from "../actions";
import SubmitButton from "./submitButton";
import Loader from "./loader";
import { useAppContext } from "../context/clientAppContext";

function Login() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const { userInfo, setUserInfo, userLoading, showLogin, setShowLogin } =
    useAppContext();

  const handleSignIn = async (formData) => {
    let res = await SignIn(formData);
    setShowLogin(false);
    if (res.success) setUserInfo(res.data);
    else {
      setError(res.message);
    }
  };

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
            <input
              onInput={(e) => {
                setError(null);
              }}
              type="text"
              name="seat"
              required
            />
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

export default Login;
