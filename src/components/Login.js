import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AuthForm from "./AuthForm";
import * as auth from "../utils/auth.js";

function Login({ handleLogin }) {
  const [formValue, setFormValue] = useState({ password: "", email: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const { password, email } = formValue;

    if (!password || !email) {
      return;
    }

    auth
      .authorize(password, email)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          handleLogin(email);
          console.log(email);
          navigate("/");
        }
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  }

  function tokenCheck() {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    auth.getContent(token).then((res) => {
      if (res) {
        handleLogin(res.data.email);
        navigate("/");
      }
    });
  }

  useEffect(() => {
    tokenCheck();
  }, []);

  return (
    <AuthForm
      title="Вход"
      name="login"
      buttonText="Войти"
      buttonTextOnLoading="Вхожу"
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      formValue={formValue}
    />
  );
}

export default Login;
