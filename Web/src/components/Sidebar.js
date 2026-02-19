import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ children }) {
  const [userOpen, setUserOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  const location = useLocation();

  // Close sidebar
  const closeSidebar = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
  fetchCurrentUser();
}, []);

const fetchCurrentUser = async () => {
  let response = await fetch("http://127.0.0.1:8000/api/auth/current-user/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });

  let data = await response.json();
  console.log("Logged in Role:", data);
  console.log("TOKEN:", localStorage.getItem("access"));

  setUserRole(data.role);

};

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="header">
        <div className="logo-area">
          {/* Hamburger Button (Only Mobile) */}
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <span className="logo-text">OMS</span>
        </div>

        <div className="header-right">
          <span className="admin-text">{userRole?.toUpperCase()}</span>
        </div>
      </header>

      {/* ================= OVERLAY ================= */}
      {menuOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          {/* Dashboard */}
          <li className={location.pathname === "/Dashboard" ? "active" : ""}>
            <Link to="/Dashboard" onClick={closeSidebar}>
              Dashboard
            </Link>
          </li>

          {/* User Management */}
          {(userRole === 'Admin' || userRole ==='admin' || userRole ==='ADMIN') && (  <li>
            <div
              className="dropdown-toggle"
              onClick={() => setUserOpen(!userOpen)}
            >
              User Management
            </div>

            {userOpen && (
              <ul className="dropdown-list">
                <li>
                  <Link to="/ManageRole" onClick={closeSidebar}>
                    Manage Role
                  </Link>
                </li>
                <li>
                  <Link to="/App_User" onClick={closeSidebar}>
                    App Users
                  </Link>
                </li>
              </ul>
            )}
          </li>)}
        

          {/* Sales */}
          {(userRole === 'Manager' || userRole === 'manager' || userRole === 'MANAGER') &&  <li>
            <div
              className="dropdown-toggle"
              onClick={() => setSalesOpen(!salesOpen)}
            >
              Sales
            </div>

            {salesOpen && (
              <ul className="dropdown-list">
                <li>
                  <Link to="/Add_Sales" onClick={closeSidebar}>
                    Add Sales
                  </Link>
                </li>
              </ul>
            )}
          </li>}
         

          {/* Other */}
          <li>
            <Link to="/Pricelist" onClick={closeSidebar}>
              Pricelist
            </Link>
          </li>

          <li>
            <Link to="/Reports" onClick={closeSidebar}>
              Reports
            </Link>
          </li>
        </ul>
      </aside>

      {/* ================= CONTENT ================= */}
      <main className="content-area">{children}</main>

      {/* ================= CSS ================= */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: system-ui;
        }

        body {
          background: #f8fafc;
        }

        /* HEADER */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 60px;
          background: #0f172a;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          z-index: 1000;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-text {
          font-size: 20px;
          font-weight: bold;
        }

        .admin-text {
          font-size: 16px;
        }

        /* Hamburger */
        .menu-btn {
          display: none;
          font-size: 26px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
        }

        /* SIDEBAR */
        .sidebar {
          position: fixed;
          top: 60px;
          left: 0;
          width: 250px;
          height: calc(100vh - 60px);
          background: #1e293b;
          padding: 20px;
          overflow-y: auto;
          transition: 0.3s;
          z-index: 999;
        }

        .sidebar ul {
          list-style: none;
        }

        .sidebar li {
          margin: 10px 0;
        }

        .sidebar a,
        .dropdown-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          border-radius: 10px;
          color: white;
          text-decoration: none;
          cursor: pointer;
          transition: 0.3s;
        }

        .sidebar a:hover,
        .dropdown-toggle:hover {
          background: #334155;
        }

        /* Active */
        // .active a {
        //   background: #2563eb;
        // }

        /* Dropdown */
        .dropdown-list {
          margin-left: 15px;
          margin-top: 5px;
        }

        .dropdown-list li a {
          font-size: 14px;
          padding: 10px;
          background: #273549;
        }

        /* CONTENT */
        .content-area {
          margin-left: 250px;
          margin-top: 60px;
          
          padding: 25px;
          min-height: calc(100vh - 60px);
        }

        /* Overlay */
        .overlay {
          position: fixed;
          top: 60px;
          left: 0;
          width: 100%;
          height: calc(100vh - 60px);
          background: rgba(0, 0, 0, 0.4);
          z-index: 998;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .menu-btn {
            display: block;
          }

          .sidebar {
            left: -260px;
          }

          .sidebar.open {
            left: 0;
          }

          .content-area {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
}
