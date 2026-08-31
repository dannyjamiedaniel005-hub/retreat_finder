import { useState } from "react";

function Register({ type, onRegister, goBack }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  async function registerUser() {

    const user = {
      name: name,
      email: email,
      password: password,
      role: type.toLowerCase()
    };

    if (type === "Owner") {
      user.phone = phone;
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }
      );

      const data = await response.json();

      alert(data.message);

      if (data.success) {
        onRegister();
      }

    } catch (error) {

      alert("Could not connect to FastAPI");

    }
  }

  return (
    <div className="login-box">

      <button onClick={goBack}>← Back</button>

      <h2>{type} Registration</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {type === "Owner" && (
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      )}

      <button onClick={registerUser}>
        Register
      </button>

    </div>
  );
}

export default Register;