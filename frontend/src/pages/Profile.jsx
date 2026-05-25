import React, { useState, useEffect } from "react";
import UserWrapper from "../components/UserWrapper";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profilePic, setProfilePic] = useState(null);
  const [mood, setMood] = useState("");
  const [history, setHistory] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const userId = localStorage.getItem("userId");

  const API_BASE =
    (import.meta.env.DEV
      ? import.meta.env.VITE_LOCAL_BACKEND
      : import.meta.env.VITE_PROD_BACKEND) || "http://localhost:5000";

  // ✅ Fetch User Data + Mood History
  useEffect(() => {
    if (!userId) return;

    // Fetch profile data
    fetch(`${API_BASE}/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        // Load mood history from backend if available
        if (data.user?.moodHistory) {
          setHistory(data.user.moodHistory);
          localStorage.setItem("moodHistory", JSON.stringify(data.user.moodHistory));
        } else {
          const saved = localStorage.getItem("moodHistory");
          if (saved) setHistory(JSON.parse(saved));
        }
      })
      .catch((err) => console.error("Fetch user failed:", err));
  }, [userId]);

// ✅ Fetch test results
   useEffect(() => {
     if (!userId) {
       console.warn("⚠️ No userId found in localStorage");
       return;
     }

     console.log("🔍 Fetching test results for userId:", userId);
     fetch(`${API_BASE}/api/profile/test-results/${userId}`)
       .then((res) => res.json())
       .then((data) => {
         console.log("📊 Test results response:", data);
         setTestResults(data.testResults || []);
       })
       .catch((err) => console.error("Fetch test results failed:", err));
   }, [userId]);

   // ✅ Fetch uploaded documents
   useEffect(() => {
     if (!userId) return;
     fetch(`${API_BASE}/api/uploads?userId=${userId}`)
       .then((res) => res.json())
       .then((data) => setUploadedDocuments(data))
       .catch((err) => console.error("Error fetching uploaded documents:", err));
   }, [userId]);

  // ✅ Load saved photo when returning to page
  useEffect(() => {
    const storedPhoto = localStorage.getItem("profilePhoto");
    if (storedPhoto) setProfilePic(storedPhoto);
  }, []);

  // ✅ Save updated profile
  const handleProfileUpdate = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/profile/update/${userId}`, {
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

   // ✅ Fixed + Safe + Compressed Profile Photo Upload
   const handlePhotoUpload = async (event) => {
     const file = event?.target?.files?.[0];
     if (!file) {
       console.warn("⚠️ No file selected.");
       return;
     }

     const reader = new FileReader();
     reader.onload = async (e) => {
       const img = new Image();
       img.src = e.target.result;
       img.onload = async () => {
         const canvas = document.createElement("canvas");
         const ctx = canvas.getContext("2d");
         const MAX_WIDTH = 300;
         const scale = MAX_WIDTH / img.width;
         canvas.width = MAX_WIDTH;
         canvas.height = img.height * scale;
         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
         const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);

         try {
           // Persist to backend for cross-session persistence
           const res = await fetch(`${API_BASE}/api/profile/uploadPhoto/${userId}`, {
             method: "PUT",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ profilePic: compressedDataUrl }),
           });
           const data = await res.json();
           if (!res.ok) throw new Error(data.error || "Failed to save photo");

           // Save to localStorage for quick access only after success
           localStorage.setItem("profilePhoto", compressedDataUrl);
           setProfilePic(compressedDataUrl);

           // Update user state with backend response
           if (data.user) setUser(data.user);

           // Notify other components (like UserWrapper) of photo update
           window.dispatchEvent(new Event("profilePhotoUpdated"));

           alert("✅ Profile photo updated successfully!");
         } catch (err) {
           console.error("Upload failed:", err);
           alert("⚠️ Upload failed: " + err.message);
         }
       };
     };
     reader.readAsDataURL(file);
   };

   // ✅ Remove profile photo
   const handlePhotoRemove = async () => {
     try {
       console.log("🗑️ Attempting to remove photo for userId:", userId);

       // Update backend first
       const res = await fetch(`${API_BASE}/api/profile/removePhoto/${userId}`, {
         method: "DELETE",
       });

       console.log("📥 Response status:", res.status);
       const data = await res.json();
       console.log("📥 Response data:", data);

       if (!res.ok) {
         throw new Error(data.error || `Server returned ${res.status}`);
       }

       // Clear from localStorage only after success
       localStorage.removeItem("profilePhoto");
       setProfilePic(null);

       // Update user state with backend response (clear profilePhoto)
       if (data.user) {
         setUser({ ...data.user, profilePhoto: "" });
       } else {
         // If backend doesn't return user, still clear local state
         setUser((prev) => (prev ? { ...prev, profilePhoto: "" } : prev));
       }

       // Notify other components of photo update
       window.dispatchEvent(new Event("profilePhotoUpdated"));

       alert("✅ Profile photo removed successfully!");
     } catch (err) {
       console.error("❌ Remove failed:", err);
       alert("⚠️ Failed to remove photo: " + err.message);
     }
   };

  // ✅ Mood Check-in (now saved to backend + local)
  const handleMoodCheckin = async () => {
    if (!mood) return alert("Please select your mood!");

    const entry = {
      date: new Date().toLocaleDateString(),
      mood,
    };

    const updatedHistory = [entry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("moodHistory", JSON.stringify(updatedHistory));

    // Save mood to backend too ✅
    try {
      const res = await fetch(`${API_BASE}/api/profile/mood/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moodHistory: updatedHistory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save mood history");
    } catch (err) {
      console.error("Failed to sync mood history:", err);
    }

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
        {/* Header Banner */}
        <div style={styles.banner}>
          <div style={styles.avatarBox}>
            <img
              src={
                localStorage.getItem("profilePhoto") ||
                profilePic ||
                user?.profilePhoto ||
                "https://via.placeholder.com/120"
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
          {["profile", "medical", "wellness", "history", "tests"].map((tab) => (
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
               <label style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>
                 Profile Picture
               </label>

               {/* Hidden file input - always present */}
               <input
                 id="photo-upload"
                 type="file"
                 accept="image/*"
                 onChange={handlePhotoUpload}
                 style={{ display: "none" }}
               />

               {/* Current Photo Preview or Add Button */}
               {(profilePic || user?.profilePhoto) ? (
                 <div style={{ marginBottom: "16px", textAlign: "center" }}>
                   <img
                     src={
                       profilePic ||
                       user?.profilePhoto ||
                       "https://via.placeholder.com/120"
                     }
                     alt="Current profile"
                     style={{
                       width: "120px",
                       height: "120px",
                       borderRadius: "50%",
                       border: "4px solid #6c5ce7",
                       objectFit: "cover",
                       marginBottom: "10px",
                       cursor: "pointer",
                     }}
                     onClick={() => document.getElementById("photo-upload").click()}
                     title="Click to change photo"
                   />
                   <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                     <label
                       htmlFor="photo-upload"
                       style={{
                         ...styles.saveBtn,
                         background: "#6c5ce7",
                         width: "auto",
                         padding: "8px 16px",
                         fontSize: "14px",
                         cursor: "pointer",
                         textDecoration: "none",
                       }}
                     >
                       ✏️ Change Photo
                     </label>
                     <button
                       onClick={handlePhotoRemove}
                       style={{
                         ...styles.saveBtn,
                         background: "#e74c3c",
                         width: "auto",
                         padding: "8px 16px",
                         fontSize: "14px",
                       }}
                     >
                       🗑️ Remove Photo
                     </button>
                   </div>
                 </div>
               ) : (
                 <div style={{ marginBottom: "16px", textAlign: "center" }}>
                   <label
                     htmlFor="photo-upload"
                     style={{
                       display: "inline-block",
                       ...styles.saveBtn,
                       background: "#6c5ce7",
                       cursor: "pointer",
                       width: "auto",
                       padding: "10px 20px",
                       textAlign: "center",
                       textDecoration: "none",
                     }}
                   >
                     ➕ Add Photo
                   </label>
                   <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
                     Click to upload a profile picture
                   </p>
                 </div>
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

{/* Medical Tab */}
           {activeTab === "medical" && (
             <div>
               <h3>📄 Uploaded Medical Documents</h3>
               {uploadedDocuments.length === 0 ? (
                 <p>No documents uploaded yet.</p>
               ) : (
                 <div>
                   {uploadedDocuments.map((doc, i) => {
                     const filename = typeof doc === "string" ? doc.split("/").pop() : (doc.filename || doc.filePath?.split("/").pop() || "unknown");
                     const filePath = typeof doc === "string" ? doc : (doc.filePath || `/uploads/${filename}`);
                     const fileCategory = typeof doc === "string" ? "Other" : (doc.category || "Other");
                     
                     return (
                       <div key={i} style={styles.docItem}>
                         <div>
                           <a href={`${API_BASE}${filePath}`} target="_blank" rel="noopener noreferrer">
                             {filename}
                           </a>
                           <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", color: "#d08b8b" }}>
                             [{fileCategory}]
                           </span>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               )}
             </div>
           )}

          {/* Tests Tab */}
          {activeTab === "tests" && (
            <div>
              <h3>📋 Test History</h3>
              {testResults.length === 0 ? (
                <p>No tests taken yet.</p>
              ) : (
                <div>
                  {testResults.map((test, i) => (
                    <div key={i} style={styles.testItem}>
                      <h4 style={{ margin: "0 0 8px 0" }}>{test.testType}</h4>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Score:</strong> {test.score}%
                      </p>
                      <p style={{ margin: "4px 0" }}>
                        <strong>Result:</strong> {test.level}
                      </p>
                      <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
                        Taken: {new Date(test.createdAt).toLocaleDateString()}
                      </p>
                      {test.agents?.agentJ?.decision && (
                        <p style={{ margin: "8px 0", fontSize: "13px", color: "#555" }}>
                          <strong>Assessment:</strong> {test.agents.agentJ.decision === "Likely" ? "Likely present" : test.agents.agentJ.decision === "Possible" ? "Possibly present" : "Unlikely present"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </UserWrapper>
  );
}

const styles = {
  page: {
    padding: "30px",
    background: "#f8c8dc",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  banner: {
    height: "160px",
    background: "linear-gradient(45deg,#8e44ad,#6c5ce7)",
    display: "flex",
    alignItems: "flex-end",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    maxWidth: "800px",
    width: "100%",
    marginBottom: "20px",
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
    width: "100%",
    maxWidth: "800px",
    marginBottom: "10px",
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

  section: {
    padding: "20px",
    width: "100%",
    maxWidth: "800px",
    background: "transparent",
    boxShadow: "none",
    borderRadius: "0",
  },

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

  testItem: {
     background: "#fff",
     padding: "15px",
     marginBottom: "12px",
     borderRadius: "8px",
     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
   },

   docItem: {
     background: "#fff8f5",
     padding: "10px 15px",
     marginBottom: "8px",
     borderRadius: "8px",
     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
     display: "flex",
     justifyContent: "space-between",
     alignItems: "center",
   },
 };


export default Profile;