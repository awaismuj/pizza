import React, { useEffect } from "react";
import restaurant from "../assets/images/restaurant-img.jpg";
import genzLogo from "../assets/images/genz-pizza-land-logo.jpg";
import Login from "../components/auth/Login";

const Auth = () => {
  useEffect(() => {
    document.title = "POS | Auth";
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Left Section */}
      <div className="relative hidden w-full items-center justify-center bg-cover md:flex md:w-1/2">
        <img className="w-full h-full object-cover" src={restaurant} alt="Gen Z Pizza Image" />
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
      </div>

      {/* Right Section */}
      <div className="flex w-full min-h-screen flex-1 flex-col items-center justify-center bg-[#1a1a1a] px-6 py-10 sm:px-10 md:w-1/2">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center gap-2">
            <img
              src={genzLogo}
              alt="GenZ Pizza Land"
              className="h-16 w-16 rounded-full border-2 border-yellow-400 object-cover"
            />
            <h1 className="text-lg font-semibold text-[#f5f5f5] tracking-wide">GenZ Pizza Land</h1>
          </div>

          <h2 className="text-3xl sm:text-4xl text-center mt-10 font-semibold text-yellow-400 mb-10">
            Employee Login
          </h2>

          <Login />
        </div>
      </div>
    </div>
  );
};

export default Auth;
