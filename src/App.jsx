import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import useSerialData from "./components/SerialPort";
import Home from "./screens/Home";
import SubChar from "./screens/SubChar";
function App() {
  const buttonStates = useSerialData();
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home data={buttonStates} />} />
        <Route path="/sub" element={<SubChar data={buttonStates} />} />
      </Routes>
    </Router>
  );
}

export default App;
