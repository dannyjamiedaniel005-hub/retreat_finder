import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

function OwnerLogin() {

  const navigate = useNavigate();

  function goBack() {
    navigate("/");
  }

  function login(user) {
    navigate("/owner", {
      state: {
        user: user
      }
    });
  }

  function register() {
    navigate("/owner-register");
  }

  return (
    <div className="login-page">

      <div>

        <button onClick={goBack}>
          ← Back
        </button>

        <Login
          type="Owner"
          onLogin={login}
          onRegister={register}
        />

      </div>

    </div>
  );
}

export default OwnerLogin;