import React, { useEffect } from "react";
import restaurant from "../assets/images/restaurant-img.jpg";
import genzLogo from "../assets/images/genz-pizza-land-logo.jpg";
import Login from "../components/auth/Login";
import { MdLockOutline } from "react-icons/md";

const Auth = () => {
  useEffect(() => {
    document.title = "POS | Staff Sign In";
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-slate-950">
      {/* Left Hero Section with Full-Bleed Restaurant Photography */}
      <div className="relative hidden min-h-screen w-full md:flex md:w-1/2 lg:w-3/5 overflow-hidden">
        {/* Full-bleed absolute background photo */}
        <img
          className="absolute inset-0 w-full h-full object-cover object-center"
          src={restaurant}
          alt="GenZ Pizza Land Restaurant"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />

        {/* Hero Content Container */}
        <div className="relative z-10 flex flex-col justify-between w-full h-full p-10 lg:p-14 xl:p-16">
          {/* Top Pill */}
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Enterprise Restaurant System
            </span>
          </div>

          {/* Center Hero Heading & Value Proposition */}
          <div className="max-w-xl space-y-4 my-auto py-10">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15]">
              High-Performance <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
                Point of Sale
              </span> & Operations Portal
            </h2>

            <p className="text-sm lg:text-base text-slate-300 font-medium leading-relaxed max-w-lg">
              Unified order management, kitchen display, shift reconciliation, inventory controls, and ERP back-office.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-300">
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md">
                ⚡ Instant Table Sync
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md">
                🧾 ESC/POS Thermal Print
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md">
                📊 Real-Time Financials
              </span>
            </div>
          </div>

          {/* Bottom Branding Tag */}
          <div className="text-[11px] text-slate-400 font-bold tracking-widest uppercase">
            GenZ Pizza Land · Point of Sale & ERP
          </div>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="flex w-full min-h-screen flex-1 flex-col items-center justify-center bg-slate-950 px-6 py-10 sm:px-10 md:w-1/2 lg:w-2/5">
        <div className="w-full max-w-sm">
          {/* Brand Heading */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={genzLogo}
              alt="GenZ Pizza Land"
              className="h-16 w-16 rounded-2xl border-2 border-amber-500/50 object-cover shadow-lg shadow-amber-500/10"
            />
            <h1 className="text-xl font-black text-white tracking-tight">GenZ Pizza Land</h1>
            <p className="text-xs text-slate-400 font-medium">Point of Sale Terminal</p>
          </div>

          <h2 className="text-2xl sm:text-3xl text-center mt-7 mb-7 font-black text-amber-500 tracking-tight">
            Staff Sign In
          </h2>

          {/* Login Form */}
          <Login />

          {/* Manager Account Advisory Notice */}
          <div className="mt-8 pt-5 border-t border-slate-900/90 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs font-medium leading-relaxed">
              <MdLockOutline className="text-amber-500 shrink-0" size={14} />
              <span>Staff accounts are provisioned by the hotel manager or owner.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
