import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerRegister from "./pages/OwnerRegister";

import Customer from "./Customer";
import Owner from "./Owner";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* CUSTOMER */}
        <Route
          path="/customer-login"
          element={<CustomerLogin />}
        />

        <Route
          path="/customer-register"
          element={<CustomerRegister />}
        />

        <Route
          path="/customer"
          element={<Customer />}
        />

        {/* OWNER */}
        <Route
          path="/owner-login"
          element={<OwnerLogin />}
        />

        <Route
          path="/owner-register"
          element={<OwnerRegister />}
        />

        <Route
          path="/owner"
          element={<Owner />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;