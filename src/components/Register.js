import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AuthForm from "./AuthForm";
import * as auth from "../utils/auth.js";

function Register({ handleLogin, handleTooltipOpen, handleRegistered }) {
  const [formValue, setFormValue] = useState({ password: "", email: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
    console.log(formValue);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const { password, email } = formValue;
    auth
      .register(password, email)
      .then((data) => {
        navigate("/sign-in");
        handleRegistered(true);
        handleTooltipOpen();
      })
      .catch((err) => {
        handleRegistered(false);
        handleTooltipOpen();
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
      title="Регистрация"
      name="register"
      buttonText="Зарегистрироваться"
      buttonTextOnLoading="Реристрируюсь"
      linkText="Уже зарегистрированы? Войти"
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      formValue={formValue}
    />
  );
}

export default Register;
