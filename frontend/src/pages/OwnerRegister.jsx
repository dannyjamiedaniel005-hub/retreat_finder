import { useNavigate } from "react-router-dom";
import Register from "../components/Register";

function OwnerRegister() {

  const navigate = useNavigate();

  function goBack() {
    navigate("/owner-login");
  }

  function login() {
    navigate("/owner-login");
  }

  return (
    <div className="login-page">

      <div>

        <Register
          type="Owner"
          goBack={goBack}
          onRegister={login}
        />

      </div>

    </div>
  );
}

export default OwnerRegister;