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
      <div className="flex w-full min-h-screen flex-1 flex-col items-center justify-center bg-slate-950 px-6 py-10 sm:px-10 md:w-1/2">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center gap-2">
            <img
              src={genzLogo}
              alt="GenZ Pizza Land"
              className="h-16 w-16 rounded-2xl border-2 border-amber-500/50 object-cover shadow-lg shadow-amber-500/10"
            />
            <h1 className="text-xl font-black text-white tracking-tight">GenZ Pizza Land</h1>
            <p className="text-xs text-slate-400 font-medium">Point of Sale Terminal</p>
          </div>

          <h2 className="text-2xl sm:text-3xl text-center mt-8 font-black text-amber-500 mb-8 tracking-tight">
            {isRegister ? "Employee Registration" : "Employee Sign In"}
          </h2>

          {/* Components */}
          {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}

          <div className="flex justify-center mt-6">
            <p className="text-xs text-slate-400">
              {isRegister ? "Already have an employee account?" : "Don't have an employee account?"}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-amber-400 font-bold hover:underline ml-1.5 focus:outline-none"
              >
                {isRegister ? "Sign in" : "Register now"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
