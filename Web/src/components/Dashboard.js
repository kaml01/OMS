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

   background: #f9fbff;

  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

/* Dashboard Cards */
.main-area1 {
  width: 280px;
  height: 120px;

  background: white;
  border-radius: 16px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18px;
  font-weight: 600;
  color: #111827;

  box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.06);

  transition: 0.3s;
}

/* Card Hover */
.main-area1:hover {
  transform: translateY(-6px);
  border: 1px solid #3b82f6;
}

/* Different Card Accent Colors */
.main-area1:nth-child(1) {
  border-left: 6px solid #3b82f6;
}

.main-area1:nth-child(2) {
  border-left: 6px solid #22c55e;
}

.main-area1:nth-child(3) {
  border-left: 6px solid #f97316;
}

.dashboard-body {
  display: flex;
   background: #f5f7ff;
    min-height: 95vh;
}
        `
      }
    </style>
      </>
    </div>
  )
}
