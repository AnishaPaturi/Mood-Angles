import React, { useState, useEffect } from "react";
import UserWrapper from "../components/UserWrapper";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profilePic, setProfilePic] = useState(null);
  const [mood, setMood] = useState("");
  const [history, setHistory] = useState([]);

  const userId = localStorage.getItem("userId");

  // ✅ Fetch User Data
  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error("Fetch user failed:", err));

    // Load previous mood history from localStorage
    const saved = localStorage.getItem("moodHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, [userId]);

  // ✅ Save updated profile
  const handleProfileUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/profile/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName || "",
          city: user.city || "",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Profile Updated");
        setUser(data.user);
        setEditMode(false);
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Server error");
    }
  };

  // ✅ Upload Profile Picture
//   const handlePhotoUpload = async () => {
//     if (!profilePic) return alert("Please select an image first!");

//     const base64 = await convertToBase64(profilePic);
//     try {
//       const res = await fetch(`http://localhost:5000/api/profile/uploadPhoto/${userId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ profilePic: base64 }),
//       });

//       const data = await res.json();
//  if (res.ok) {
//   alert("✅ Profile Updated");
//   setUser(data.user);
//   localStorage.setItem("firstName", data.user.firstName);
//   localStorage.setItem("lastName", data.user.lastName || "");
//   setEditMode(false);
//   window.dispatchEvent(new Event("storage")); // triggers re-render in wrapper
// } else {
//   alert(data.error || "Update failed");
// }


//     } catch (err) {
//       console.error("Upload failed:", err);
//     }
//   };
const handlePhotoUpload = async () => {
  if (!profilePic) return alert("Please select an image first!");

  const base64 = await convertToBase64(profilePic);

  try {
    const res = await fetch(`http://localhost:5000/api/profile/uploadPhoto/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profilePic: base64 }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Photo updated!");

      // ✅ Update the state with new picture manually
      setUser((prev) => ({ ...prev, profilePic: base64 }));
      setProfilePic(null);

      // ✅ Keep the name sync as before
      localStorage.setItem("firstName", user.firstName);
      localStorage.setItem("lastName", user.lastName || "");
      window.dispatchEvent(new Event("storage"));
    } else {
      alert(data.error || "Photo upload failed");
    }
  } catch (err) {
    console.error("Upload failed:", err);
    alert("Upload failed. Check console.");
  }
};


  // Convert file to base64
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // ✅ Mood Check-in
  const handleMoodCheckin = () => {
    if (!mood) return alert("Please select your mood!");
    const entry = {
      date: new Date().toLocaleDateString(),
      mood,
    };
    const updatedHistory = [entry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("moodHistory", JSON.stringify(updatedHistory));
    alert("✅ Mood check-in saved!");
    setMood("");
    setActiveTab("history");
  };

  if (!user)
    return (
      <div style={{ fontSize: 22, textAlign: "center", padding: 60 }}>
        Loading...
      </div>
    );

  return (
    <UserWrapper>
      <div style={styles.page}>
        <div style={styles.card}>
          {/* Header Banner */}
          <div style={styles.banner}>
            <div style={styles.avatarBox}>
              <img
                src={
                  profilePic
                    ? URL.createObjectURL(profilePic)
                    : user.profilePic || "https://via.placeholder.com/120"
                }
                style={styles.avatar}
                alt="profile"
              />
              <div>
                <h3 style={{ color: "#fff", fontSize: "22px", marginBottom: 5 }}>
                  {user.firstName} {user.lastName}
                </h3>
                <p style={{ color: "#fff", opacity: 0.9 }}>{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            {["profile", "medical", "wellness", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={activeTab === tab ? styles.activeTab : styles.tab}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Content Section */}
          <div style={styles.section}>
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <>
                <label>Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
                {profilePic && (
                  <button
                    onClick={handlePhotoUpload}
                    style={{
                      ...styles.editBtn,
                      background: "orange",
                      marginBottom: "10px",
                    }}
                  >
                    Upload Photo 📷
                  </button>
                )}

                <label>First Name</label>
                <input
                  style={styles.input}
                  disabled={!editMode}
                  value={user.firstName}
                  onChange={(e) =>
                    setUser({ ...user, firstName: e.target.value })
                  }
                />

                <label>Last Name</label>
                <input
                  style={styles.input}
                  disabled={!editMode}
                  value={user.lastName || ""}
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
                  }
                />

                <label>City</label>
                <input
                  style={styles.input}
                  disabled={!editMode}
                  value={user.city || ""}
                  onChange={(e) => setUser({ ...user, city: e.target.value })}
                />

                <label>Phone</label>
                <input
                  style={{ ...styles.input, background: "#eee" }}
                  disabled
                  value={user.phone}
                />

                <button
                  onClick={() =>
                    editMode ? handleProfileUpdate() : setEditMode(true)
                  }
                  style={editMode ? styles.saveBtn : styles.editBtn}
                >
                  {editMode ? "Save ✅" : "Edit ✏"}
                </button>
              </>
            )}

            {/* Wellness Tab */}
            {activeTab === "wellness" && (
              <div>
                <h3>🌤️ Daily Mood Check-in</h3>
                <select
                  style={styles.input}
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                >
                  <option value="">Select your mood</option>
                  <option value="Happy 😀">Happy 😀</option>
                  <option value="Sad 😔">Sad 😔</option>
                  <option value="Calm 😌">Calm 😌</option>
                  <option value="Tired 😴">Tired 😴</option>
                  <option value="Energetic ⚡">Energetic ⚡</option>
                  <option value="Stressed 😣">Stressed 😣</option>
                </select>
                <button style={styles.saveBtn} onClick={handleMoodCheckin}>
                  Save Check-in ✅
                </button>
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div>
                <h3>📅 Mood Check-in History</h3>
                {history.length === 0 ? (
                  <p>No mood check-ins yet.</p>
                ) : (
                  <ul>
                    {history.map((entry, i) => (
                      <li key={i}>
                        {entry.date} — <b>{entry.mood}</b>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === "medical" && <p>Medical info coming soon</p>}
          </div>
        </div>
      </div>
    </UserWrapper>
  );
}

const styles = {
  page: { padding: "30px", background: "#f0f4ff", minHeight: "100vh" },
  card: {
    width: "90%",
    maxWidth: "600px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },
  banner: {
    height: "160px",
    background: "linear-gradient(45deg,#8e44ad,#6c5ce7)",
    display: "flex",
    alignItems: "flex-end",
    padding: "20px",
  },
  avatarBox: { display: "flex", gap: "15px", alignItems: "center" },
  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    border: "4px solid white",
    objectFit: "cover",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    padding: "12px",
  },
  tab: {
    padding: "8px 14px",
    background: "#ddd",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
  },
  activeTab: {
    padding: "8px 14px",
    background: "#6c5ce7",
    color: "#fff",
    borderRadius: "20px",
    border: "none",
  },
  section: { padding: "20px" },
  input: {
    width: "100%",
    padding: "10px",
    margin: "6px 0 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  editBtn: {
    background: "#6c5ce7",
    color: "#fff",
    padding: "10px",
    width: "100%",
    borderRadius: "8px",
    cursor: "pointer",
  },
  saveBtn: {
    background: "green",
    color: "#fff",
    padding: "10px",
    width: "100%",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Profile;
