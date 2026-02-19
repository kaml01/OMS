import React from 'react'

export default function Dashboard() {
  return (
    <div>
      <>
         <div className="main-area">
      <p className="main-area1">Users</p>
      <p className="main-area1">Products</p>
      <p className="main-area1">Total Sales</p>

    </div>

    <style>
      {
        `
        /* Main Area */
.main-area {
  width: 100%;
  padding: 30px;

   background: #f1f5f9;

  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

/* Dashboard Cards */
.main-area1 {
  width: 280px;
  height: 120px;

  // background: white;
  border-radius: 16px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18px;
  font-weight: 600;
  color: #475569;
  background: #ffffff;
  border: 2px solid #e2e8f0;

  box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.06);

  transition: 0.3s;
}

/* Card Hover */
.main-area1:hover {
  transform: translateY(-6px);
  border: 1px solid #1e293b;
}

/* Different Card Accent Colors */
.main-area1:nth-child(1) {
  border-left: 6px solid #1e293b;
}

.main-area1:nth-child(2) {
  border-left: 6px solid #1e293b;
}

.main-area1:nth-child(3) {
  border-left: 6px solid #1e293b;
}

.dashboard-body {
  display: flex;
   background: #f1f5f9;
    min-height: 95vh;
}
        `
      }
    </style>
      </>
    </div>
  )
}
