import CustomButton from "./components/CustomButton";
import React, { useCallback } from "react";
import Logo from "./assets/svgs/logo";
import Web3 from "web3";
import { switchNetwork } from "utils/ConnectWallet";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "pages/login";
import Home from "pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
