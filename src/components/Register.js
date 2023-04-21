import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFormValidation from "../utils/useFormValidation";

import AuthForm from "./AuthForm";
import * as auth from "../utils/auth.js";

function Register({
  handleLogin,
  handleTooltipOpen,
  handleRegistered,
  handleLoading,
  onLoading,
}) {
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
      auth
        .register(password, email)
        .then((data) => {
          navigate("/sign-in");
          handleRegistered(true);
          handleTooltipOpen();
          reset();
        })
        .catch((err) => {
          handleRegistered(false);
          handleTooltipOpen();
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
      title="Регистрация"
      name="register"
      buttonText="Зарегистрироваться"
      buttonTextOnLoading="Реристрируюсь"
      linkText="Уже зарегистрированы? Войти"
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

export default Register;
