import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import AuthNavbar from "../components/Navbar/AuthNavbar";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);
  return (
    <div className="w-full min-h-screen h-full flex justify-center  bg-white">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
