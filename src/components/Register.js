import AuthForm from "./AuthForm";

function Register() {
  return (
    <AuthForm
      title="Регистрация"
      name="register"
      buttonText="Зарегистрироваться"
      buttonTextOnLoading="Реристрируюсь"
      linkText="Уже зарегистрированы? Войти"
    />
  );
}

export default Register;
