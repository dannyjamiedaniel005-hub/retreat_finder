import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  function findRetreat() {
    navigate("/customer-login");
  }

  function listRetreat() {
    navigate("/owner-login");
  }

  return (
    <div className="home">

      <h1>🌿 Retreat Finder</h1>

      <p>
        Find the perfect retreat or list your own center.
      </p>

      <div className="choice-box">

        <button onClick={findRetreat}>
          👤 Find a Retreat
        </button>

        <button onClick={listRetreat}>
          🏢 List Your Retreat Center
        </button>

      </div>

    </div>
  );
}

export default Home;