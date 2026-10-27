import React, { useState } from "react";
import { getSettings, register } from "../../https";
import { useMutation, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { DEFAULT_PASSWORD_POLICY, describePasswordPolicy } from "../../utils/passwordPolicy";

const Register = ({setIsRegister}) => {
  const settingsQuery = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const passwordPolicy = settingsQuery.data?.data?.data?.passwordPolicy || DEFAULT_PASSWORD_POLICY;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelection = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const registerMutation = useMutation({
    mutationFn: (reqData) => register(reqData),
    onSuccess: (res) => {
      const { data } = res;
      enqueueSnackbar(data.message, { variant: "success" });
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
      });
      
      setTimeout(() => {
        setIsRegister(false);
      }, 1500);
    },
    onError: (error) => {
      const { response } = error;
      const message = response.data.message;
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Employee Full Name
          </label>
          <div className="flex items-center rounded-xl px-4 py-3 bg-slate-900/90 border border-slate-800 focus-within:border-amber-500 transition shadow-inner">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="bg-transparent flex-1 text-white text-sm focus:outline-none placeholder-slate-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Employee Email
          </label>
          <div className="flex items-center rounded-xl px-4 py-3 bg-slate-900/90 border border-slate-800 focus-within:border-amber-500 transition shadow-inner">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. employee@genzpizza.com"
              className="bg-transparent flex-1 text-white text-sm focus:outline-none placeholder-slate-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Phone Number
          </label>
          <div className="flex items-center rounded-xl px-4 py-3 bg-slate-900/90 border border-slate-800 focus-within:border-amber-500 transition shadow-inner">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +923001234567"
              className="bg-transparent flex-1 text-white text-sm focus:outline-none placeholder-slate-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Password
          </label>
<<<<<<< HEAD
          <div className="flex items-center rounded-xl px-4 py-3 bg-slate-900/90 border border-slate-800 focus-within:border-amber-500 transition shadow-inner">
=======
          <p className="mb-2 text-xs text-gray-400">Password policy: {describePasswordPolicy(passwordPolicy)}.</p>
          <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
>>>>>>> origin/main
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
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Choose Assigned Role
          </label>

          <div className="grid grid-cols-3 gap-2 mt-2">
            {["Waiter", "Cashier", "Admin", "Accountant", "Asset Manager", "Read Only"].map((role) => {
              const isSelected = formData.role === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelection(role)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                      : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded-xl mt-6 py-3.5 text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 transition active:scale-[0.99] disabled:opacity-60"
        >
          {registerMutation.isPending ? "Creating Account..." : "Register Employee"}
        </button>
      </form>
    </div>
  );
};

export default Register;
