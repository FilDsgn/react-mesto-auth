import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import useFormValidation from "../utils/useFormValidation";
import AuthForm from "./AuthForm";
import * as auth from "../utils/auth.js";

function Login({ handleLogin, handleLoading, onLoading }) {
  const navigate = useNavigate();

  const { values, errors, isValid, handleChange, setValue, reset, formRef } =
    useFormValidation();

  useEffect(() => {
    setValue("email", "");
    setValue("password", "");
  }, [setValue]);

  function handleSubmit(e) {
    handleLoading(true);

    e.preventDefault();

    if (isValid) {
      const { password, email } = values;

      if (!password || !email) {
        return;
      }

      auth
        .authorize(password, email)
        .then((data) => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            handleLogin(email);
            navigate("/");
            reset();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          handleLoading(false);
        });
    }
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
      handleSubmit={handleSubmit}
      onLoading={onLoading}
      isValid={isValid}
      ref={formRef}
    >
      <input
        type="email"
        minLength="2"
        maxLength="30"
        required
        placeholder="Email"
        className="auth-form__input"
        onChange={handleChange}
        name="email"
        value={values["email"] ?? ""}
      />
      <span className="auth-form__input-error">{errors.email}</span>
      <input
        type="password"
        minLength="5"
        maxLength="30"
        required
        placeholder="Пароль"
        className="auth-form__input"
        onChange={handleChange}
        name="password"
        value={values["password"] ?? ""}
      />
      <span className="auth-form__input-error">{errors.password}</span>
    </AuthForm>
  );
}

export default Login;
