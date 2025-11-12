import React, { useEffect, useState } from "react";
import UserWrapper2 from "../components/UserWrapper2";

export default function PDashboard() {
  const [stats, setStats] = useState(null);
  const [todayList, setTodayList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch dashboard data dynamically
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Mock API or real API endpoint
        // Example: const res = await fetch("/api/doctor/dashboard");
        // const data = await res.json();

        // Mock dynamic data (replace with actual API)
        const mockData = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              totalPatients: 54,
              totalCases: 112,
              todaysAppointments: [
                { name: "Aarav", time: "9:00 AM", reason: "Anxiety" },
                { name: "Saanvi", time: "10:30 AM", reason: "Therapy Follow-up" },
                { name: "Rohan", time: "12:00 PM", reason: "Medication Review" },
              ],
            });
          }, 1000);
        });

        setStats({
          totalPatients: mockData.totalPatients,
          totalCases: mockData.totalCases,
          todaysAppointments: mockData.todaysAppointments.length,
        });

        setTodayList(mockData.todaysAppointments);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ✅ Loading State
  if (loading) {
    return (
      <UserWrapper2>
        <div className="loadingScreen">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
          <style>{`
            .loadingScreen {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 80vh;
              color: #334155;
              font-family: 'Inter', sans-serif;
            }
            .spinner {
              width: 40px;
              height: 40px;
              border: 4px solid #e2e8f0;
              border-top-color: #2563eb;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </UserWrapper2>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <UserWrapper2>
        <div className="errorBox">
          <h3>⚠️ {error}</h3>
        </div>
        <style>{`
          .errorBox {
            text-align: center;
            color: #dc2626;
            margin-top: 60px;
            font-family: 'Inter', sans-serif;
          }
        `}</style>
      </UserWrapper2>
    );
  }

  // ✅ Main Dashboard
  return (
    <UserWrapper2>
      <div className="dashContainer">
        <h1 className="heading">Welcome back, Doctor 👩‍⚕️</h1>

        {/* Stats Cards */}
        <div className="statsRow">
          <div className="statCard">
            <h2>{stats.totalPatients}</h2>
            <p>Total Patients</p>
          </div>

          <div className="statCard">
            <h2>{stats.totalCases}</h2>
            <p>Total Cases Handled</p>
          </div>

          <div className="statCard">
            <h2>{stats.todaysAppointments}</h2>
            <p>Appointments Today</p>
          </div>
        </div>

        {/* Appointment Section */}
        <div className="apptSection">
          <h2>Today's Appointments</h2>

          {todayList.length === 0 ? (
            <p className="empty">No appointments today</p>
          ) : (
            <table className="apptTable">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Time</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {todayList.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.time}</td>
                    <td>{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ✅ Styles */}
      <style>{`
        .dashContainer {
          padding: 40px;
          color: #1e293b;
          font-family: 'Inter', sans-serif;
        }

        .heading {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 35px;
          color: #0f172a;
        }

        .statsRow {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }

        .statCard {
          background: linear-gradient(135deg, #eef7ff, #d8eaff);
          flex: 1;
          padding: 24px;
          border-radius: 14px;
          text-align: center;
          min-width: 220px;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s;
        }

        .statCard:hover {
          transform: translateY(-6px);
        }

        .statCard h2 {
          font-size: 36px;
          margin: 0;
          color: #2563eb;
        }

        .statCard p {
          margin: 6px 0 0;
          color: #475569;
          font-size: 15px;
        }

        .apptSection {
          background: white;
          padding: 26px;
          border-radius: 14px;
          box-shadow: 0 10px 35px rgba(0,0,0,0.08);
        }

        .apptSection h2 {
          margin-bottom: 12px;
          color: #0f172a;
          font-size: 20px;
        }

        .apptTable {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }

        .apptTable th,
        .apptTable td {
          padding: 14px;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
        }

        .apptTable th {
          background: #e8f1ff;
          color: #1e40af;
          font-weight: 600;
        }

        .apptTable tr:hover td {
          background: #f6faff;
        }

        .empty {
          color: #64748b;
          padding: 14px 0;
        }
      `}</style>
    </UserWrapper2>
  );
}
