import React, { useState, useEffect } from "react";

export default function App_User() {
  const [users, setUsers] = useState([]);
  const [mainGroup, setMainGroup] = useState([]);
  const [state, setState] = useState([]);
  const [role, setRole] = useState([]);
  const [company, setCompany] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    mainGroup: "",
    state: "",
    role: "",
    company: "",
  });
  const [showForm, setShowForm] = useState(false);
const [showUsers, setShowUsers] = useState(true);


  useEffect(() => {
    fetchUsers();
    fetchMainGroup();
    fetchState();
    fetchRole();
    fetchCompany();
  }, []);

  const fetchUsers = async () => {
    try {
      let response = await fetch("http://127.0.0.1:8000/api/auth/users/list/");
      let data = await response.json();

      console.log("Users Data:", JSON.stringify(data));
      setUsers(data.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const fetchMainGroup = async () => {
    try {
      let response2 = await fetch("http://127.0.0.1:8000/api/auth/mainGroup/");
      let data2 = await response2.json();
      console.log("Users Data:", JSON.stringify(data2));
      setMainGroup(data2.data);
    } catch (error) {
      console.log("Error fetching main group:", error);
    }
  };

  const fetchState = async () => {
    try {
      let response3 = await fetch("http://127.0.0.1:8000/api/auth/states/");
      let data3 = await response3.json();
      console.log("Users Data:", JSON.stringify(data3));
      setState(data3.data);
    } catch (error) {
      console.log("Error fetching State:", error);
    }
  };

  const fetchRole = async () => {
    try {
      let response4 = await fetch("http://127.0.0.1:8000/api/auth/roles/");
      let data4 = await response4.json();
      console.log("Users Data:", JSON.stringify(data4));
      setRole(data4.data);
    } catch (error) {
      console.log("Error fetching User Role:", error);
    }
  };

  const fetchCompany = async () => {
    try {
      let response5 = await fetch("http://127.0.0.1:8000/api/auth/companies/");
      let data5 = await response5.json();
      console.log("Users Data:", JSON.stringify(data5));
      setCompany(data5.data);
    } catch (error) {
      console.log("Error fetching Company:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response = await fetch(
        "http://127.0.0.1:8000/api/auth/users/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      let result = await response.json();

      if (result.success) {
        alert("User Added Successfully ✅");
        setFormData({
              name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    mainGroup: "",
    state: "",
    role: "",
    company: "",
        });
        
        fetchUsers();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.log("Error creating user:", error);
    }
  };

  return (
    <div>
      <>
        <div className="top-bar">
          <div style={{ marginLeft: "20px" }}>{showForm ? "Add Users" : "Users"}</div>
         <button
  onClick={() => {
    setShowForm(!showForm);
    setShowUsers(showForm); 
  }}
>
  {showForm ? "Show Users" : "Add Users"}
</button>
        </div>

        {/* USERS TABLE */}
        
        <div className="table-container">
          {/* <h2>All Users List</h2> */}
{showUsers && (
  <div className="table_box">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {/* <th>Company</th> */}
                <th>Status</th>
                {/* <th>Last Login</th> */}
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role_name}</td>
                    {/* <td>{user.company}</td> */}
                    <td>{user.is_active ? "Active" : "Inactive"}</td>
                    {/* <td>{user.last_login}</td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No Users Found
                  </td>
                </tr>
              )}
            </tbody>
          </table> </div>
)}
        

          {/* Add new user form */}

{showForm &&(
  <div className="form_box">
          <form onSubmit={handleSubmit}>
            <h3>Add Users</h3>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <br />

            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <br />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <br />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <br />

             <label htmlFor="phone">Contact no</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Contact no"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <br />

            <label htmlFor="mainGroup">Main Group</label>
            <select
              value={formData.mainGroup}
              onChange={handleChange}
              name="mainGroup"
              required
            >
              <option value="">Select Main Group</option>
              {mainGroup.length > 0
                ? mainGroup.map((mainGroup) => (
                    <option key={mainGroup.id} value={mainGroup.id}>
                      {mainGroup.name}
                    </option>
                  ))
                : null}
            </select>
            <br />

            <label htmlFor="state">State</label>
            <select value={formData.state} onChange={handleChange} name="state" required>
              <option value="">Select State</option>
              {state.length > 0
                ? state.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))
                : null}
            </select>
            <br />

            <label htmlFor="role">User Role</label>
            <select value={formData.role} onChange={handleChange} name="role" required>
              <option value="">Select Role</option>
              {role.length > 0
                ? role.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))
                : null}
            </select>
            <br />

            <label htmlFor="company">Company</label>
            <select
              value={formData.company}
              onChange={handleChange}
              name="company"
              required
            >
              <option value="">Select Company</option>
              {company.length > 0
                ? company.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))
                : null}
            </select>
            <br />

            <button type="submit">Add User</button>
          </form> </div>
          )}
        </div>

        <style>
          {`
            .top-bar{
                border-bottom:2px solid #1f2038;
                display: flex;
                align-items: center;
                background: #1e293b;
                color: white;
                height:
                50px;
                // position: fixed;
                // right: 0;
                // left:30%;
            }

            button{
            margin-left:auto;
            background:
            #334155;
            color: white;
            border: none;
            margin-right: 10px
            }

           

          .table-container {
  padding: 20px;
  background: #f9f9f9;
 
}

/* Table Main Box */
.table_box{
position: fixed;
overflow-y: scroll;
height: 65vh;
width: 70vw;
margin: auto;


}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  margin-top: 15px;
  border: 1px solid #334155;
}

/* Table Header */
thead {
  background: #334155;
  
  color: white;
  position: sticky; 
  top: 0;

 
}

th {
  padding: 12px;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  border: 1px solid ##334155;

}

/* Table Body */
td {
  padding: 12px;
  font-size: 14px;
  border: 1px solid #e2e8f0;
}

/* Hover Effect */
tbody tr:hover {
  background: #f8fafc;
  cursor: pointer;
  transition: 0.2s;
}

/* Alternate Row Colors */
tbody tr:nth-child(even) {
  background: #fafafa;
}

/* ===================== */
/* FORM STYLING */
/* ===================== */

.form_box{
// border: 2px solid black;
overflow-y: scroll;
height: 65vh;
width: 40vw;
margin: auto;

}

form {
  
  padding: 25px;
  background: white;
  border-radius: 12px;
  border: 1px solid #ddd;
  max-width: 500px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
}

/* Form Heading */
form h3 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #1e293b;
  font-weight: 700;
}

/* Labels */
form label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-top: 12px;
  margin-bottom: 6px;
}

/* Inputs + Select */
form input,
form select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}

/* Focus Effect */
form input:focus,
form select:focus {
  border-color: #475569;
  box-shadow: 0px 0px 5px rgba(82, 93, 238, 0.4);
}

/* Dropdown Option */
form select option {
  font-size: 14px;
}

/* Submit Button */
form button {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background: #334155;
  color: white;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

/* Button Hover */
form button:hover {
  background: #1e293b;
}

/* Responsive Form */
@media (max-width: 768px) {
  form {
    width: 100%;
    padding: 20px;
  }
}


            `}
        </style>
      </>
    </div>
  );
}
