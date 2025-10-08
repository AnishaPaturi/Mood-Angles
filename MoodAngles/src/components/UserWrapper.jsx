import React, { useState, useRef, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserWrapper({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [username, setUsername] = useState("User");
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Fetch username from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("firstName");
    if (storedName) setUsername(storedName);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dashboard">
      <style>{`
        :root {
          --accent: #7b61ff;
        }
        .layout {
          display: flex;
          height: 100vh;
          width: 100vw;
        }
        .sidebar {
          width: 260px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 30px rgba(20,20,40,0.08);
          transform: translateX(0);
          transition: transform 300ms ease-in-out;
          padding: 24px;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 20;
        }
        .sidebar.closed {
          transform: translateX(-280px);
        }
        .brand {
          font-weight: 700;
          font-size: 20px;
          color: #3b3b4a;
          margin-bottom: 18px;
        }
        .nav a {
          display: block;
          color: #4b4b59;
          text-decoration: none;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .nav a:hover {
          background: rgba(123,97,255,0.1);
          color: var(--accent);
          transform: translateX(5px);
        }
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: auto;
          transition: margin-left 300ms ease-in-out;
          margin-left: 260px;
        }
        .main.expanded {
          margin-left: 0;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          background: white;
          box-shadow: 0 4px 18px rgba(20,20,40,0.06);
          position: relative;
          z-index: 10;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(180deg,#b894ff,#9b6bff);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .userMenu {
          position: absolute;
          right: 22px;
          top: 60px;
          background: white;
          border-radius: 10px;
          padding: 8px 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          font-size: 14px;
          color: #333;
        }
      `}</style>

      <div className="layout">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
          <div className="brand">MoodAngels</div>
          <nav className="nav">
            <a onClick={() => navigate("/dashboard")}>Dashboard</a>
            <a onClick={() => navigate("/profile")}>Profile</a>
            <a onClick={() => navigate("/settings")}>Settings</a>
          </nav>
        </aside>

        {/* Main Area */}
        <div className={`main ${sidebarOpen ? "" : "expanded"}`}>
          <header className="header">
            <button
              className="toggleBtn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>
            <div className="title" style={{ fontWeight: 600 }}>
              Welcome Back 💜
            </div>

            <div ref={userMenuRef} className="relative">
              <div
                className="avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User color="white" size={22} />
              </div>
              {showUserMenu && (
                <div className="userMenu">
                  Hello, <b>{username}</b>! <br />
                  <button
                    onClick={() => {
                      localStorage.clear();
                      navigate("/");
                    }}
                    style={{
                      marginTop: "8px",
                      padding: "6px 12px",
                      background: "red",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserWrapper;
