import React, { useEffect, useState } from "react";
import restaurant from "../assets/images/restaurant-img.jpg"
import genzLogo from "../assets/images/genz-pizza-land-logo.jpg"
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";

const Auth = () => {

  useEffect(() => {
    document.title = "POS | Auth"
  }, [])

  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Left Section */}
      <div className="relative hidden w-full items-center justify-center bg-cover md:flex md:w-1/2">
        {/* BG Image */}
        <img className="w-full h-full object-cover" src={restaurant} alt="Gen Z Pizza Image" />

        {/* Black Overlay */}
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
            {isRegister ? "Employee Registration" : "Employee Login"}
          </h2>

          {/* Components */}
          {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}


          <div className="flex justify-center mt-6">
            <p className="text-sm text-[#ababab]">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
              <a onClick={() => setIsRegister(!isRegister)} className="text-yellow-400 font-semibold hover:underline ml-1" href="#">
                {isRegister ? "Sign in" : "Sign up"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
