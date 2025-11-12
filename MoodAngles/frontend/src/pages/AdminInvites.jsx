import React, { useEffect, useState } from "react";

export default function AdminInvites() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/invite/requests")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching requests:", err);
        setLoading(false);
      });
  }, []);

  const approveInvite = async (id) => {
    setMsg("");
    try {
      const res = await fetch(`http://localhost:5000/api/invite/approve/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) setMsg(`✅ Invite sent to ${data.link}`);
      else setMsg(`❌ ${data.error || data.msg}`);
    } catch (err) {
      console.error("Approve error:", err);
      setMsg("Server error while approving invite");
    }
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div style={styles.container}>
      <h2>Pending Psychiatrist Requests</h2>
      {msg && <p style={styles.msg}>{msg}</p>}
      {requests.length === 0 && <p>No requests found.</p>}
      {requests.map((r) => (
        <div key={r._id} style={styles.card}>
          <p><strong>Name:</strong> {r.fullName}</p>
          <p><strong>Email:</strong> {r.email}</p>
          <p><strong>Qualification:</strong> {r.qualification}</p>
          <p><strong>Experience:</strong> {r.experience} years</p>
          <p><strong>Status:</strong> {r.status}</p>
          {r.status === "pending" && (
            <button onClick={() => approveInvite(r._id)} style={styles.button}>
              Approve & Send Invite
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    fontFamily: "Poppins, sans-serif",
  },
  card: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    background: "#fafafa",
  },
  button: {
    background: "#6e8efb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  msg: {
    color: "green",
  },
};
