import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query"
import { login } from "../../https/index"
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
 
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const[formData, setFormData] = useState({
      email: "",
      password: "",
    });
  
    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
    }

  
    const handleSubmit = (e) => {
      e.preventDefault();
      loginMutation.mutate(formData);
    }

    const loginMutation = useMutation({
      mutationFn: (reqData) => login(reqData),
      onSuccess: (res) => {
          const { data } = res;
          const { _id, name, email, phone, role, canAccessERP } = data.data || {};
          dispatch(setUser({
            _id,
            name,
            email,
            phone,
            role,
            canAccessERP: String(role).toLowerCase() === "admin" || Boolean(canAccessERP),
          }));
          enqueueSnackbar("Welcome back to POS Terminal!", { variant: "success" });
          navigate("/");
      },
      onError: (error) => {
        const { response } = error;
        const msg = response?.data?.message || error?.message || "Login failed. Ensure the backend server is running.";
        enqueueSnackbar(msg, { variant: "error" });
      }
    })

  return (
    <div>
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
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-xl mt-6 py-3.5 text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 transition active:scale-[0.99] disabled:opacity-60"
        >
          {loginMutation.isPending ? "Authenticating..." : "Access POS Terminal"}
        </button>
      </form>
    </div>
  );
};

export default Login;
