import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Owner() {

  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user;

  const [retreats, setRetreats] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    capacity: "",
    facilities: "",
    description: "",
    availableFrom: "",
    availableTo: "",
    contact: user?.phone || ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // GET OWNER'S RETREATS
  // -----------------------------

  async function getMyRetreats() {

    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/my-retreats/${encodeURIComponent(user.email)}`
      );

      const data = await response.json();

      if (data.success) {
        setRetreats(data.retreats || []);
      }

    } catch (error) {

      console.error("Could not fetch retreats:", error);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {
    getMyRetreats();
  }, [user?.email]);


  // -----------------------------
  // FORM CHANGE
  // -----------------------------

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  }


  // -----------------------------
  // ADD RETREAT
  // -----------------------------

  async function addRetreat(e) {

    e.preventDefault();

    const retreat = {

      name: form.name,

      location: form.location,

      price: Number(form.price),

      capacity: Number(form.capacity),

      facilities: form.facilities
        .split(",")
        .map(item => item.trim()),

      description: form.description,

      availableFrom: form.availableFrom,

      availableTo: form.availableTo,

      contact: form.contact,

      ownerEmail: user?.email

    };

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/add-retreat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(retreat)
        }
      );

      const data = await response.json();

      if (data.success) {

        setMessage("Retreat added successfully! ✅");

        setForm({
          name: "",
          location: "",
          price: "",
          capacity: "",
          facilities: "",
          description: "",
          availableFrom: "",
          availableTo: "",
          contact: user?.phone || ""
        });

        // Refresh owner's retreats
        getMyRetreats();

        // Close form
        setShowForm(false);

      } else {

        setMessage(
          data.message || "Something went wrong"
        );

      }

    } catch (error) {

      setMessage("Could not connect to FastAPI");

    }

  }


  // -----------------------------
  // LOGOUT
  // -----------------------------

  function logout() {
    navigate("/");
  }


  // -----------------------------
  // BACK
  // -----------------------------

  function goBack() {
    navigate(-1);
  }


  return (
    <div className="owner-page">

      {/* HEADER */}

      <div className="owner-header">

        <div>

          <h1>
            Welcome, {user?.name || "Owner"} 👋
          </h1>

          <p>
            Manage your retreat centers
          </p>

        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>


      {/* DASHBOARD */}

      {!showForm && (

        <div className="owner-form-box">

          <h2>
            My Retreat Centers
          </h2>

          <p className="form-subtitle">
            View the retreat centers you have listed.
          </p>


          {loading && (
            <p>
              Loading your retreat centers...
            </p>
          )}


          {!loading && retreats.length === 0 && (

            <div>

              <p>
                You haven't listed any retreat centers yet.
              </p>

              <button
                className="add-btn"
                onClick={() => setShowForm(true)}
              >
                + Add Retreat Center
              </button>

            </div>

          )}


          {!loading && retreats.length > 0 && (

            <>

              {retreats.map((center) => (

                <div
                  className="center-card"
                  key={center._id}
                >

                  <h3>
                    {center.name}
                  </h3>

                  <p>
                    📍 Location: {center.location}
                  </p>

                  <p>
                    👥 Capacity: {center.capacity}
                  </p>

                  <p>
                    💰 Price: ₹{center.price}
                  </p>

                  <p>
                    🧘 Facilities:{" "}
                    {center.facilities?.join(", ")}
                  </p>

                  <p>
                    📅 Available:{" "}
                    {center.availableFrom}
                    {" "}to{" "}
                    {center.availableTo}
                  </p>

                  <p>
                    📞 Contact:{" "}
                    {center.contact || "Not provided"}
                  </p>

                  {center.description && (
                    <p>
                      📝 {center.description}
                    </p>
                  )}

                </div>

              ))}


              <button
                className="add-btn"
                onClick={() => {
                  setMessage("");
                  setShowForm(true);
                }}
              >
                + Add Retreat Center
              </button>

            </>

          )}

        </div>

      )}


      {/* ADD RETREAT FORM */}

      {showForm && (

        <div className="owner-form-box">

          <button
            className="back-btn"
            onClick={() => {
              setShowForm(false);
              setMessage("");
            }}
          >
            ← Back
          </button>

          <h2>
            Add Retreat Center
          </h2>

          <p className="form-subtitle">
            Enter your retreat center details below.
          </p>


          <form onSubmit={addRetreat}>

            <div className="form-grid">


              <div className="input-group">

                <label>
                  Retreat Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Green Valley Retreat"
                  required
                />

              </div>


              <div className="input-group">

                <label>
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Kerala"
                  required
                />

              </div>


              <div className="input-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="50000"
                  required
                />

              </div>


              <div className="input-group">

                <label>
                  Capacity
                </label>

                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="30"
                  required
                />

              </div>


              <div className="input-group full">

                <label>
                  Facilities
                </label>

                <input
                  name="facilities"
                  value={form.facilities}
                  onChange={handleChange}
                  placeholder="Food, Accommodation, Yoga, Meditation Hall"
                  required
                />

                <small>
                  Separate facilities using commas
                </small>

              </div>


              <div className="input-group full">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your retreat center..."
                  rows="3"
                />

              </div>


              <div className="input-group">

                <label>
                  Available From
                </label>

                <input
                  type="date"
                  name="availableFrom"
                  value={form.availableFrom}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="input-group">

                <label>
                  Available To
                </label>

                <input
                  type="date"
                  name="availableTo"
                  value={form.availableTo}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="input-group full">

                <label>
                  Contact Number
                </label>

                <input
                  type="tel"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                />

              </div>

            </div>


            <button
              className="add-btn"
              type="submit"
            >
              Add Retreat Center
            </button>

          </form>


          {message && (
            <div className="form-message">
              {message}
            </div>
          )}

        </div>

      )}

    </div>
  );
}

export default Owner;