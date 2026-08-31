import { useNavigate } from "react-router-dom";
import Register from "../components/Register";

function CustomerRegister() {

  const navigate = useNavigate();

  function goBack() {
    navigate("/customer-login");
  }

  function login() {
    navigate("/customer-login");
  }

  return (
    <div className="login-page">

      <div>

        <Register
          type="Customer"
          goBack={goBack}
          onRegister={login}
        />

      </div>

    </div>
  );
}

export default CustomerRegister;