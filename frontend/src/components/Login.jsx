import { useState } from "react";

function Login({ type, onLogin, onRegister }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function loginUser() {

    setError("");

    const user = {
      email: email,
      password: password,
      role: type.toLowerCase()
    };

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }
      );

      const data = await response.json();

      if (data.success) {

        onLogin(data.user);

      } else {

        setError(
          data.message || "Invalid email or password"
        );

      }

    } catch (error) {

      setError("Could not connect to FastAPI");

    }
  }

  return (
    <div className="login-box">

      <h2>{type} Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
        }}
      />

      {error && (
        <p style={{ color: "red" }}>
          ❌ {error}
        </p>
      )}

      <button onClick={loginUser}>
        Login
      </button>

      <p>Don't have an account?</p>

      <button onClick={onRegister}>
        Create Account
      </button>

    </div>
  );
}

export default Login;