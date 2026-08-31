import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

function CustomerLogin() {

  const navigate = useNavigate();

  function goBack() {
    navigate("/");
  }

  function login(user) {
    navigate("/customer", {
      state: {
        user: user
      }
    });
  }

  function register() {
    navigate("/customer-register");
  }

  return (
    <div className="login-page">

      <div>

        <button onClick={goBack}>
          ← Back
        </button>

        <Login
          type="Customer"
          onLogin={login}
          onRegister={register}
        />

      </div>

    </div>
  );
}

export default CustomerLogin;