function CenterCard({ center }) {
  return (
    <div className="center-card">
      <h3>{center.name}</h3>

      <p>📍 {center.location}</p>

      <p>💰 ₹{center.price}</p>

      <p>👥 Capacity: {center.capacity}</p>

      <p>🏠 {center.facilities?.join(", ")}</p>

      <p>📞 {center.contact}</p>
    </div>
  );
}

export default CenterCard;