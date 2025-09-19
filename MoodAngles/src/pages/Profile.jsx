import React, { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [checkinForm, setCheckinForm] = useState({
    sleepQuality: "",
    energyLevel: "",
    physicalDiscomfort: "",
    mood: "",
    notes: "",
  });

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return;

    fetch(`http://localhost:5000/api/auth/profile?email=${email}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  const handleCheckinSubmit = (e) => {
    e.preventDefault();
    // Mock submit; in real app, send to API
    alert("Daily check-in submitted!");
    setCheckinForm({
      sleepQuality: "",
      energyLevel: "",
      physicalDiscomfort: "",
      mood: "",
      notes: "",
    });
  };

  if (!user) return <div className="flex justify-center items-center h-screen"><p className="text-lg">Loading profile...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">My Profile</h1>

        {/* 1. Personal Details */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Personal Details</h2>
          <div className="flex items-center mb-4">
            <img
              src={user.profilePic || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-24 h-24 rounded-full mr-4"
            />
            <div>
              <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Phone: {user.phone}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>City:</strong> {user.city}</p>
            <p><strong>Date of Birth:</strong> {user.dob ? new Date(user.dob).toDateString() : "N/A"}</p>
          </div>
        </div>

        {/* 2. Medical Overview */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Medical Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Blood Type:</strong> {user.medical?.bloodType || "N/A"}</p>
            <p><strong>Allergies:</strong> {user.medical?.allergies?.join(", ") || "None"}</p>
            <p><strong>Medications:</strong> {user.medical?.medications?.join(", ") || "N/A"}</p>
            <p><strong>Primary Diagnosis:</strong> {user.medical?.primaryDiagnosis || "N/A"}</p>
            <p className="col-span-2"><strong>Last Check-up:</strong> {user.medical?.lastCheckup ? new Date(user.medical.lastCheckup).toDateString() : "N/A"}</p>
          </div>
        </div>

        {/* 3. Medical History & Records */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Medical History & Records</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Diagnoses</h3>
              <ul className="list-disc list-inside">
                {user.history?.diagnoses?.map((d, i) => (
                  <li key={i}>{d.condition} (on {new Date(d.diagnosedAt).toDateString()})</li>
                )) || <p>No diagnoses recorded</p>}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Treatments</h3>
              <ul className="list-disc list-inside">
                {user.history?.treatments?.map((t, i) => (
                  <li key={i}>
                    {t.treatment} ({t.startDate ? new Date(t.startDate).toDateString() : "?"} -{" "}
                    {t.endDate ? new Date(t.endDate).toDateString() : "Present"})
                  </li>
                )) || <p>No treatments recorded</p>}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Symptoms</h3>
              <ul className="list-disc list-inside">
                {user.history?.symptoms?.map((s, i) => (
                  <li key={i}>
                    {s.symptom} — {s.severity} ({new Date(s.reportedAt).toDateString()})
                  </li>
                )) || <p>No symptom logs yet</p>}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Medication History</h3>
              <ul className="list-disc list-inside">
                {user.history?.medicationHistory?.map((m, i) => (
                  <li key={i}>
                    {m.name} - {m.dosage} ({new Date(m.startDate).toDateString()} -{" "}
                    {m.endDate ? new Date(m.endDate).toDateString() : "Present"})
                  </li>
                )) || <p>No medication history</p>}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Documents</h3>
              <ul className="list-disc list-inside">
                {user.history?.documents?.map((doc, i) => (
                  <li key={i}>
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-blue-500">Document {i + 1}</a>
                  </li>
                )) || <p>No documents uploaded</p>}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Daily Wellness Check/Questionnaire */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">Daily Wellness Check</h2>
          <form onSubmit={handleCheckinSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">How did you sleep last night?</label>
              <select
                value={checkinForm.sleepQuality}
                onChange={(e) => setCheckinForm({ ...checkinForm, sleepQuality: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select</option>
                <option value="Poor">Poor</option>
                <option value="Fair">Fair</option>
                <option value="Excellent">Excellent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">What is your energy level today? (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={checkinForm.energyLevel}
                onChange={(e) => setCheckinForm({ ...checkinForm, energyLevel: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Are you experiencing any physical discomfort?</label>
              <input
                type="text"
                value={checkinForm.physicalDiscomfort}
                onChange={(e) => setCheckinForm({ ...checkinForm, physicalDiscomfort: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mood Tracker</label>
              <input
                type="text"
                placeholder="e.g., Happy, Sad, Anxious"
                value={checkinForm.mood}
                onChange={(e) => setCheckinForm({ ...checkinForm, mood: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Journal/Notes</label>
              <textarea
                value={checkinForm.notes}
                onChange={(e) => setCheckinForm({ ...checkinForm, notes: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                rows="3"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Submit Check-in
            </button>
          </form>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Past Check-ins</h3>
            <ul className="space-y-2">
              {user.dailyCheckins?.map((d, i) => (
                <li key={i} className="border-b pb-2">
                  {new Date(d.date).toDateString()} — Mood: {d.mood}, Sleep: {d.sleepQuality}, Energy: {d.energyLevel}, Notes: {d.notes}
                </li>
              )) || <p>No daily check-ins</p>}
            </ul>
          </div>
        </div>

        {/* 5. Analysis & Insights */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Analysis & Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium">Data Visualization</h3>
              <p className="text-sm text-gray-600">Placeholder for Mood Trends Chart</p>
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded">Chart Placeholder</div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Sleep Patterns</h3>
              <p className="text-sm text-gray-600">Placeholder for Sleep Patterns Chart</p>
              <div className="bg-gray-200 h-32 flex items-center justify-center rounded">Chart Placeholder</div>
            </div>
          </div>
          <div className="mt-4">
            <p><strong>Diagnosis Confidence Score:</strong> {user.insights?.diagnosisConfidence || "N/A"}%</p>
            <p><strong>Recommendations:</strong> {user.insights?.recommendations?.join(", ") || "N/A"}</p>
            <p><strong>Related Cases:</strong> {user.insights?.relatedCases?.map((c) => c.summary).join("; ") || "N/A"}</p>
          </div>
        </div>

        {/* 6. Upcoming Appointments */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-teal-600">Upcoming Appointments</h2>
          <ul className="space-y-2">
            {user.appointments?.map((a, i) => (
              <li key={i} className="flex justify-between items-center border-b pb-2">
                <div>
                  {a.date ? new Date(a.date).toDateString() : "TBD"} at {a.time || "N/A"} — {a.purpose || "No purpose"}
                </div>
                {a.link && (
                  <a href={a.link} target="_blank" rel="noreferrer" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Join
                  </a>
                )}
              </li>
            )) || <p>No upcoming appointments</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Profile;
