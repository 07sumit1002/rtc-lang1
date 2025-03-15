import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("en"); // Default language is English

  const navigate = useNavigate();

  const handleJoinRoom = useCallback(() => {
    if (value.trim() !== "") {
      navigate(`/room/${value}`);
    }
  }, [navigate, value]);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg text-center" style={{ width: "350px" }}>
        <h3 className="mb-3">Join a Room</h3>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          className="form-control mb-3"
          placeholder="Enter Room Code"
        />
        {/* Language Dropdown */}
        <select 
          className="form-select mb-3"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="hi">Hindi</option>
          <option value="ar">Arabic</option>
          <option value="ru">Russian</option>
          <option value="pt">Portuguese</option>
          <option value="ja">Japanese</option>
        </select>
        <button 
          onClick={handleJoinRoom} 
          className="btn btn-primary w-100 mb-3"
          disabled={!value.trim()}
        >
          Join & Translate
        </button>
      </div>
    </div>
  );
};

export default HomePage;
