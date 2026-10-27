import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const loginMutation = useMutation({
    mutationFn: (reqData) => login(reqData),
    onSuccess: (res) => {
      const { data } = res;
      const { _id, name, email, phone, role, permissions, forcePasswordChange } = data.data;
      dispatch(setUser({ _id, name, email, phone, role, permissions, forcePasswordChange }));
      navigate(forcePasswordChange ? "/change-password" : "/");
    },
    onError: (error) => {
      const { response } = error;
      enqueueSnackbar(response.data.message, { variant: "error" });
    },
  });

  return (
    <div>
<<<<<<< HEAD
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Staff Email Address
          </label>
          <div className="flex items-center rounded-xl px-4 py-3 bg-slate-900/90 border border-slate-800 focus-within:border-amber-500 transition shadow-inner">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. devops.awais@gmail.com"
              className="bg-transparent flex-1 text-white text-sm focus:outline-none placeholder-slate-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Security Password
          </label>
          <div className="flex items-center rounded-xl px-4 py-3 bg-slate-900/90 border border-slate-800 focus-within:border-amber-500 transition shadow-inner">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-transparent flex-1 text-white text-sm focus:outline-none placeholder-slate-500"
              required
            />
          </div>
=======
      <h2 className="mt-6 text-center text-3xl font-bold text-[#f6c75c] sm:text-4xl">
        Employee Login
      </h2>

      <form onSubmit={handleSubmit} className="mt-7 space-y-6">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-[#b7bec9]">
            Employee Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="awais.mj@gmail.com"
            className="w-full rounded-xl border border-[#2c3746] bg-[#0d1722] px-4 py-3 text-base text-white placeholder:text-[#7d8795] focus:border-[#f5b942] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-[#b7bec9]">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full rounded-xl border border-[#2c3746] bg-[#0d1722] px-4 py-3 text-base text-white placeholder:text-[#7d8795] focus:border-[#f5b942] focus:outline-none"
            required
          />
>>>>>>> origin/main
        </div>

        <button
          type="submit"
<<<<<<< HEAD
          disabled={loginMutation.isPending}
          className="w-full rounded-xl mt-6 py-3.5 text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 transition active:scale-[0.99] disabled:opacity-60"
        >
          {loginMutation.isPending ? "Authenticating..." : "Access POS Terminal"}
=======
          className="w-full rounded-xl bg-[#f5b942] py-3 text-lg font-bold text-[#0d1722] transition hover:bg-[#f6c75c]"
        >
          Sign In
>>>>>>> origin/main
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-[#b7bec9]">
        Staff accounts are provided by the hotel manager or owner.
      </div>
    </div>
  );
};

export default Login;
