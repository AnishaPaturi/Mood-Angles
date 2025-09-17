import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, you've been redirected to the dashboard 🎉</h1>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "50px" }}>
        {/* User Section */}
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", width: "40%" }}>
          <h2>User</h2>
          <div style={{ marginTop: "20px" }}>
            <Link to="/login">
              <button style={{ marginRight: "10px", padding: "10px 20px" }}>Login</button>
            </Link>
            <Link to="/signup">
              <button style={{ padding: "10px 20px" }}>Signup</button>
            </Link>
          </div>
        </div>

        {/* Psychiatrist Section */}
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", width: "40%" }}>
          <h2>Psychiatrist</h2>
          <div style={{ marginTop: "20px" }}>
            <Link to="/plogin">
              <button style={{ marginRight: "10px", padding: "10px 20px" }}>Login</button>
            </Link>
            <Link to="/psignup">
              <button style={{ padding: "10px 20px" }}>Signup</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
