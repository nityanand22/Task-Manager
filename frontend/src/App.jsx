import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TaskDashboard from "./components/TaskBoard";
import { useState } from "react";

import "./index.css";
import Header from "./components/Header";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  return (
    <div className="min-h-screen bg-gray-100">
      <BrowserRouter>
        <Header token={token} setToken={setToken} />
        <Routes>
          <Route
            path="/"
            element={<Login token={token} setToken={setToken} />}
          />
          <Route path="/signup" element={<Signup setToken={setToken} />} />
          <Route path="/dashboard" element={<TaskDashboard token={token} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
