import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from "./components/Sidebar";
import App_User from "./components/App_User";
import Add_Sales from "./components/Add_Sales";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/Sidebar" element={<Sidebar />} /> */}
        <Route path="/Dashboard" element={<Sidebar><Dashboard /></Sidebar>} />
        
        <Route path="/App_User" element={<Sidebar><App_User /></Sidebar>} />

        <Route path="/Add_Sales" element={<Sidebar><Add_Sales /></Sidebar>} />
      </Routes>
    </BrowserRouter>
  //   <div>
  //     <Login/>
  //   </div>
  );
}

export default App;
      