import React from "react";
import { Outlet } from "react-router";

import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar/Navbar.jsx";
import Chatbot from "../components/Chatbot.jsx";

import useNotifications from "../hooks/useNotifications";

const MainLayout = () => {
  useNotifications(); // Initialize socket listener

  return (
    <div className="w-full h-full ">
      <Navbar />
      <Outlet />
      <Chatbot />
      <Toaster />
    </div>
  );
};

export default MainLayout;
