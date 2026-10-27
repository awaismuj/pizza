import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeOwnPassword, getSettings } from "../https";
import { setPasswordChangeRequired } from "../redux/slices/userSlice";
import { DEFAULT_PASSWORD_POLICY, describePasswordPolicy } from "../utils/passwordPolicy";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const settingsQuery = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const passwordPolicy = settingsQuery.data?.data?.data?.passwordPolicy || DEFAULT_PASSWORD_POLICY;
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const mutation = useMutation({
    mutationFn: changeOwnPassword,
    onSuccess: () => {
      dispatch(setPasswordChangeRequired(false));
      enqueueSnackbar("Password changed successfully.", { variant: "success" });
      navigate("/", { replace: true });
    },
    onError: (error) => enqueueSnackbar(error.response?.data?.message || "Could not change password.", { variant: "error" }),
  });

  const submit = (event) => {
    event.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      enqueueSnackbar("The new passwords do not match.", { variant: "error" });
      return;
    }
    mutation.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword, confirmPassword: form.confirmPassword });
  };

  return (
    <main className="min-h-screen bg-[#1f1f1f] px-4 py-10 text-white">
      <form onSubmit={submit} className="mx-auto max-w-lg space-y-5 rounded-2xl bg-[#262626] p-6 sm:p-8">
        <div>
          <h1 className="text-2xl font-bold">Change your temporary password</h1>
          <p className="mt-2 text-sm text-gray-400">Password policy: {describePasswordPolicy(passwordPolicy)}.</p>
        </div>
        {[
          ["currentPassword", "Temporary password"],
          ["newPassword", "New password"],
          ["confirmPassword", "Confirm new password"],
        ].map(([name, label]) => (
          <label key={name} className="block space-y-2 text-sm">
            <span>{label}</span>
            <input
              required
              type="password"
              autoComplete={name === "currentPassword" ? "current-password" : "new-password"}
              value={form[name]}
              onChange={(event) => setForm({ ...form, [name]: event.target.value })}
              className="w-full rounded-lg border border-[#444] bg-[#1a1a1a] px-3 py-2.5 outline-none focus:border-yellow-400"
            />
          </label>
        ))}
        <button disabled={mutation.isPending} className="w-full rounded-lg bg-yellow-400 px-4 py-3 font-semibold text-black disabled:opacity-60">
          {mutation.isPending ? "Saving..." : "Change password"}
        </button>
      </form>
    </main>
  );
};

export default ChangePassword;
