import { useDispatch } from "react-redux";
import { getUserData } from "../https";
import { useEffect, useState } from "react";
import { setUser } from "../redux/slices/userSlice";

const useLoadData = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const demoPreview = import.meta.env.DEV && import.meta.env.VITE_POS_DEMO === "true";

  useEffect(() => {
    let active = true;

    if (demoPreview) {
      dispatch(setUser({
        _id: "local-demo-admin",
        name: "Demo Admin",
        email: "demo@example.local",
        phone: "",
        role: "Admin",
        permissions: [
          "dashboard.view", "orders.view", "orders.create", "orders.edit", "orders.update",
          "orders.cancel", "kitchen.update", "orders.delete", "orders.viewDeleted", "payments.process",
          "tables.view", "tables.manage", "tables.delete", "menu.view", "menu.create",
          "menu.edit", "menu.delete", "menu.changePrice", "categories.manage", "deals.manage",
          "hero.manage", "inventory.view", "inventory.manage", "inventory.adjust", "inventory.delete",
          "expenses.view", "expenses.create", "expenses.delete", "finance.view", "reports.view",
          "reports.manage", "settings.view", "settings.manage", "users.view", "users.create",
          "users.edit", "users.deactivate", "users.delete", "users.resetPassword", "users.assignRole",
          "users.managePermissions", "users.manageRoles", "users.viewAudit", "assets.view",
          "assets.manage", "assets.financial", "assets.export", "assets.viewValuation",
          "staff.view", "staff.manage", "attendance.view", "attendance.manage", "hr.view",
          "hr.manage", "payroll.view", "payroll.manage", "payroll.settings", "payroll.compensation", "payroll.adjust",
        ],
      }));
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    const fetchUser = async () => {
      try {
        const { data } = await getUserData();
        if (!active) return;
        const { _id, name, email, phone, role, permissions, forcePasswordChange } = data.data;
        dispatch(setUser({ _id, name, email, phone, role, permissions, forcePasswordChange }));
      } catch (error) {
        if (active) console.error("Could not restore POS session:", error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchUser();

    return () => {
      active = false;
    };
  }, [demoPreview, dispatch]);

  return isLoading;
};

export default useLoadData;
