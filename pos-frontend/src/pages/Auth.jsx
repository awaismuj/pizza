import React, { useEffect } from "react";
import restaurant from "../assets/images/restaurant-img.jpg";
import genzLogo from "../assets/images/genz-pizza-land-logo.jpg";
import Login from "../components/auth/Login";

const Auth = () => {
  useEffect(() => {
    document.title = "POS | Auth";
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#020b14] text-white">
      <div className="relative hidden w-full items-center justify-center overflow-hidden md:flex md:w-1/2">
        <img className="h-full w-full object-cover" src={restaurant} alt="Gen Z Pizza Image" />
        <div className="absolute inset-0 bg-[#020b14]/75" />

        <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-10">
          <div className="inline-flex w-fit items-center rounded-md border border-[#f5b942]/60 bg-[#f0b543]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4d067] shadow-[0_0_18px_rgba(245,185,66,0.15)]">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#f5b942]" />
            Enterprise Restaurant System
          </div>

          <div className="mt-10 max-w-[680px]">
            <h1 className="text-[3.1rem] font-black leading-[0.9] tracking-[-0.05em] text-white xl:text-[4.5rem]">
              High-Performance
              <span className="mt-2 block text-[#f6c75c]">Point of Sale &amp;</span>
              <span className="mt-2 block text-[#f6c75c]">Operations</span>
              <span className="mt-2 block text-white">Portal</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="flex w-full min-h-screen flex-1 items-center justify-center bg-[#101821] px-6 py-10 sm:px-8 md:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center justify-center gap-3">
            <img
              src={genzLogo}
              alt="GenZ Pizza Land"
              className="h-14 w-14 rounded-full border-2 border-yellow-400 object-cover"
            />
            <div className="text-left text-[#f5f5f5]">
              <div className="text-xl font-bold leading-none">GenZ Pizza Land</div>
              <div className="mt-1 text-xs text-[#b7bec9]">Point of Sale Terminal</div>
            </div>
          </div>

          <Login />
        </div>
      </div>
    </div>
  );
};

export default Auth;
