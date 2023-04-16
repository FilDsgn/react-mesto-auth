import AuthForm from "./AuthForm";

function Login() {
  return (
    <AuthForm
      title="Вход"
      name="login"
      buttonText="Войти"
      buttonTextOnLoading="Вхожу"
    />
  );
}

export default Login;
