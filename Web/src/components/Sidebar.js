import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import Dashboard from './Dashboard';


export default function Sidebar({ children }) {
    const [open, setOpen] = useState(false);
  return (
    <>

    <div id="top-left">OMS</div>

    <div id="top-right">Admin</div>

    <div className="dashboard-body">
    <div className="sidebar">
      <ul>
        <li><Link to="/Dashboard">Dashboard</Link></li>
        <li>
      {/* Dropdown Toggle */}
      <div
        className="dropdown-toggle"
        onClick={() => setOpen(!open)}
      >
        User Management
      </div>

      {/* Dropdown Menu */}
      {open && (
        <ul className="dropdown-list">
          <li>
            <Link to="">Manage Role</Link>
          </li>
          <li>
            <Link to="/App_User">App Users</Link>
          </li>
        </ul>
      )}
    </li>
        <li><Link to="">Sales</Link></li>
        <li><Link to="">Pricelist</Link></li>
        <li><Link to="">Reports</Link></li>
      </ul>
    </div>

    <div className="content-area">
          {children}
        </div>
   
    </div>

    <style>{
      `
    /* Page Background */
body {
  margin: 0;
  font-family: "Poppins", sans-serif;
  background: #f5f7ff;
}

/* Top Bar Left */
#top-left {
  width: 20%;
  display: inline-block;
  text-align: center;
  padding: 15px;

  font-size: 20px;
  font-weight: bold;

background: linear-gradient(to right, #3a61a0, #0a0b41);
  color: white;
}

/* Top Bar Right */
#top-right {
  width: 80%;
  display: inline-block;
  text-align: center;
  padding: 15px;

  font-size: 20px;
  font-weight: bold;

  background: linear-gradient(to right, #3a61a0, #0a0b41);
  color: white;


  // background: white;
  // color: #111827;

 
}

/* Wrapper */
.dashboard-body {
  display: flex;
   background: #f5f7ff;
    min-height: 95vh;
}

/* Sidebar */
.sidebar {
  width: 20%;
  height: 95vh;
 background: linear-gradient(to right, #12346b, #06063bb8);

  border-right: 1px solid #e5e7eb;
  box-shadow: 4px 0px 15px rgba(0, 0, 0, 0.05);

  padding: 20px;
}

/* Sidebar List */
.sidebar ul {
  padding: 0;
  margin: 0;
}

/* Sidebar Items */
.sidebar ul li {
  list-style: none;
  margin: 12px 0;

  padding: 12px 15px;
  border-radius: 12px;

  font-size: 15px;
  font-weight: 500;

  color: #fffcfc;
  cursor: pointer;

  transition: 0.3s;
}

/* Hover Effect */
.sidebar ul li:hover {
  // background: #f2f4ff;
 color: #3b82f6;
  padding-left: 20px;
}

/* Dropdown Nested Menu */
.sidebar ul li ul {
  margin-top: 10px;
  margin-left: 15px;
}

.sidebar ul li ul li {
  font-size: 14px;
  padding: 8px 12px;
  background: transparent;
  color: #ffffff;
}

.sidebar ul li ul li:hover {
  color: #6366f1;
}



.sidebar a{
color: white;
text-decoration: none;
}

.content-area {
  width: 80%;
  padding: 30px;
}

        
      `
}</style>

    </>
  );
}

