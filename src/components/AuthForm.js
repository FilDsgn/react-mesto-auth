import { Link } from "react-router-dom";

function AuthForm(
  { title, name, onSubmit, buttonText, buttonTextOnLoading, linkText = "" },
  ref
) {
  return (
    <form
      action="#"
      name={name}
      onSubmit={onSubmit}
      noValidate
      className="auth-form"
      // ref={ref}
    >
      <h2 className="auth-form__title">{title}</h2>
      <input
        type="text"
        minLength="2"
        maxLength="30"
        required
        placeholder="Email"
        className="auth-form__input"
      />
      <span className="auth-form__input-error"></span>
      <input
        type="password"
        minLength="5"
        maxLength="30"
        required
        placeholder="Пароль"
        className="auth-form__input"
      />
      <span className="auth-form__input-error"></span>
      <button type="submit" aria-label="" className="auth-form__button">
        {buttonText}
      </button>
      <Link to="" className="auth-form__link">
        {linkText}
      </Link>
    </form>
  );
}

export default AuthForm;
