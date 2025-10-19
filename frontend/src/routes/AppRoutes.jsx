import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import PartnerRegister from "../pages/auth/PartnerRegister";
import PartnerLogin from "../pages/auth/PartnerLogin";
import RegisterChoice from "../pages/auth/RegisterChoice";
import Home from "../pages/general/Home";
import Saved from "../pages/general/Saved";
import CreateFood from "../pages/food-partner/CreateFood";
import PartnerProfile from "../pages/food-partner/PartnerProfile";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<PartnerRegister />} />
        <Route path="/food-partner/login" element={<PartnerLogin />} />
        <Route path="/" element={<Home />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/partner/:id" element={<PartnerProfile />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
