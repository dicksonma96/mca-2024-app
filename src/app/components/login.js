"use client";

import { useState } from "react";
import { SignIn } from "../actions";
import SubmitButton from "./submitButton";
import Loader from "./loader";
import { useAppContext } from "../context/clientAppContext";

function Login() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const { setUserInfo, userLoading } = useAppContext();

  const handleSignIn = async (formData) => {
    let res = await SignIn(formData);

    if (res.success) setUserInfo(res.data);
    else {
      setError(res.message);
    }
  };

  return (
    <div className="login_popup col">
      {userLoading ? (
        <Loader />
      ) : (
        <form action={handleSignIn} className="login_window col">
          <h1 className="color1">Please enter your seat number</h1>
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
  );
}

export default Login;
