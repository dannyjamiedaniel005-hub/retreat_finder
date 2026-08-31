import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Customer() {

  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user;

  const [file, setFile] = useState(null);

  const [matches, setMatches] = useState([]);

  const [centers, setCenters] = useState([]);

  const [search, setSearch] = useState("");

  const [showCenters, setShowCenters] = useState(false);

  const [loading, setLoading] = useState(false);

  const [loadingCenters, setLoadingCenters] = useState(false);


  // =============================
  // GET ALL CENTERS
  // =============================

  async function getCenters() {

    setLoadingCenters(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/retreats"
      );

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      console.log("ALL CENTERS:", data);

      setCenters(data);

    } catch (error) {

      console.error(error);

      alert("Could not load retreat centers");

    } finally {

      setLoadingCenters(false);

    }
  }


  // =============================
  // VIEW ALL CENTERS
  // =============================

  function viewAllCenters() {

    setShowCenters(true);

    getCenters();

  }


  // =============================
  // SEARCH CENTERS
  // =============================

  const filteredCenters = centers.filter((center) => {

    const searchText = search.toLowerCase();

    const name =
      center.name?.toLowerCase() || "";

    const centerLocation =
      center.location?.toLowerCase() || "";

    const facilities =
      center.facilities?.join(" ").toLowerCase() || "";

    return (
      name.includes(searchText) ||
      centerLocation.includes(searchText) ||
      facilities.includes(searchText)
    );

  });


  // =============================
  // UPLOAD PDF
  // =============================

  async function uploadPDF() {

    if (!file) {

      alert("Please select a PDF first");

      return;
    }

    setLoading(true);

    setMatches([]);

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/upload-requirements",
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      console.log("PDF RESPONSE:", data);

      if (data.success) {

        setMatches(data.matches || []);

        if (
          !data.matches ||
          data.matches.length === 0
        ) {

          alert(
            "No matching retreat centers found."
          );

        }

      } else {

        alert(
          data.message ||
          "Could not analyze PDF"
        );

      }

    } catch (error) {

      console.error(error);

      alert("Could not connect to FastAPI");

    } finally {

      setLoading(false);

    }
  }


  // =============================
  // LOGOUT
  // =============================

  function logout() {

    navigate("/");

  }


  return (

    <div className="customer-page">


      {/* =============================
          HEADER
      ============================= */}

      <div className="dashboard-header">

        <div>

          <h1>
            Welcome, {user?.name || "Customer"} 👋
          </h1>

          <p>
            Find the perfect retreat for your requirements.
          </p>

        </div>

        <button onClick={logout}>
          Logout
        </button>

      </div>


      {/* =============================
          PDF UPLOAD
      ============================= */}

      <div className="upload-box">

        <h2>
          Find a Retreat
        </h2>

        <p>
          Upload your requirements PDF and we'll
          find matching retreat centers.
        </p>


        {/* DOWNLOAD TEMPLATE */}

        <button
          onClick={() => {

            window.open(
              "http://127.0.0.1:8000/download-template",
              "_blank"
            );

          }}
        >
          Download PDF Template
        </button>


        <br />
        <br />


        {/* SELECT PDF */}

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />


        {/* ANALYZE PDF */}

        <button
          onClick={uploadPDF}
          disabled={loading}
        >

          {loading
            ? "Analyzing..."
            : "Analyze PDF"}

        </button>

      </div>


      {/* =============================
          MATCHING CENTERS
      ============================= */}

      {matches.length > 0 && (

        <div className="matches">

          <h2>
            Matching Retreat Centers
          </h2>


          {matches.map((center) => (

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

            </div>

          ))}

        </div>

      )}


      {/* =============================
          VIEW ALL CENTERS
      ============================= */}

      <div className="upload-box">

        <h2>
          Browse Retreat Centers
        </h2>

        <p>
          Explore all retreat centers available on the platform.
        </p>


        {!showCenters && (

          <button onClick={viewAllCenters}>
            View All Centers
          </button>

        )}

      </div>


      {/* =============================
          ALL CENTERS
      ============================= */}

      {showCenters && (

        <div className="matches">

          <h2>
            All Retreat Centers
          </h2>


          {/* SEARCH */}

          <div class="search-bar">
            <input
            class="search-input"
              type="text"
              placeholder="Search by name, location or facility..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>


          {/* LOADING */}

          {loadingCenters ? (

            <p>
              Loading retreat centers...
            </p>

          ) : filteredCenters.length === 0 ? (

            <p>
              No retreat centers found.
            </p>

          ) : (

            filteredCenters.map((center) => (

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
                  📝 {center.description}
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

              </div>

            ))

          )}

        </div>

      )}

    </div>

  );

}

export default Customer;