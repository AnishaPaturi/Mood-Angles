import React, { useEffect, useState } from "react";
import UserWrapper2 from "../components/UserWrapper2";

export default function PDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalCases: 0,
    todaysAppointments: 0,
  });

  const [todayList, setTodayList] = useState([]);

  // Create dynamic dashboard data
  useEffect(() => {
    const randomPatients = Math.floor(Math.random() * 40) + 20;
    const randomCases = Math.floor(Math.random() * 80) + 30;
    const randomAppointments = Math.floor(Math.random() * 8) + 2;

    setStats({
      totalPatients: randomPatients,
      totalCases: randomCases,
      todaysAppointments: randomAppointments,
    });

    const names = ["Aarav", "Vihaan", "Advika", "Isha", "Rohan", "Saanvi", "Meera", "Kabir", "Riya", "Krishna"];
    const reasons = ["Anxiety", "Stress", "Check-up", "Therapy Follow-up", "New Consultation", "Medication Review"];

    const appointments = Array.from({ length: randomAppointments }).map(() => ({
      name: names[Math.floor(Math.random() * names.length)],
      time: `${Math.floor(Math.random() * 8) + 9}:00 AM`,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
    }));

    setTodayList(appointments);
  }, []);

  return (
    <UserWrapper2>
      <div className="dashContainer">
        <h1 className="heading">Welcome, Doctor 👋</h1>

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

      {/* CSS */}
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
