import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { Home, Auth, Orders, Tables, Menu, Outdoor, Dashboard, OnlineOrders, EmployeePortal } from "./pages";
import ChangePassword from "./pages/ChangePassword";
import Header from "./components/shared/Header";
import NewOrderPopup from "./components/shared/NewOrderPopup";
import LowStockAlert from "./components/shared/LowStockAlert";
import PrepAlertCenter from "./components/prep/PrepAlertCenter";
import WhatsAppButton from "./components/shared/WhatsAppButton";
import MusicPlayerProvider from "./components/shared/MusicPlayerProvider";
import { UIThemeProvider, useUITheme } from "./context/UIThemeContext";
import ModernLayout from "./components/modern/ModernLayout";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import useScrollHoverFix from "./hooks/useScrollHoverFix";
import FullScreenLoader from "./components/shared/FullScreenLoader";

function AppRoutes() {
  const { isAuth } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        }
      />
      <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
      <Route
        path="/orders"
        element={
          <ProtectedRoutes>
            <Orders />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/tables"
        element={
          <ProtectedRoutes>
            <Tables />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoutes>
            <Menu />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/outdoor"
        element={
          <ProtectedRoutes>
            <Outdoor />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          </ProtectedRoutes>
        }
      />
      <Route
        path="/online-orders"
        element={
          <ProtectedRoutes>
            <OnlineOrders />
          </ProtectedRoutes>
        }
      />
      <Route path="*" element={<div className="p-10 text-center text-slate-400">Page Not Found</div>} />
    </Routes>
  );
}

function Layout() {
  const isLoading = useLoadData();
  useScrollHoverFix();
  const location = useLocation();
  useEffect(() => {
    const pageMetadata = {
      "/": ["GenZ Pizza Land POS | Orders", "Internal restaurant order-management workspace."],
      "/auth": ["GenZ Pizza Land POS | Sign in", "Secure sign-in for authorized GenZ Pizza Land staff."],
      "/change-password": ["GenZ Pizza Land POS | Change password", "Update your password for the staff point-of-sale account."],
      "/employee": ["GenZ Pizza Land POS | Employee portal", "Private employee self-service portal for attendance and staff requests."],
      "/orders": ["GenZ Pizza Land POS | Orders", "Private staff workspace for managing restaurant orders."],
      "/tables": ["GenZ Pizza Land POS | Tables", "Private staff workspace for restaurant table management."],
      "/menu": ["GenZ Pizza Land POS | Menu", "Private point-of-sale menu and order-entry workspace."],
      "/outdoor": ["GenZ Pizza Land POS | New order", "Private staff workspace for creating restaurant orders."],
      "/dashboard": ["GenZ Pizza Land POS | Dashboard", "Private restaurant management dashboard."],
      "/online-orders": ["GenZ Pizza Land POS | Online orders", "Private staff workspace for managing customer online orders."],
    };
    const [title, description] = pageMetadata[location.pathname] || [
      "GenZ Pizza Land POS | Page not found",
      "The requested page is not available in the GenZ Pizza Land POS.",
    ];
    document.title = title;
    let meta = document.head.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex,nofollow,noarchive";
  }, [location.pathname]);
  const hideHeaderRoutes = ["/auth"];
  const hideWhatsAppRoutes = ["/menu"];
<<<<<<< HEAD
  const { isAuth } = useSelector((state) => state.user);
  const { isModern } = useUITheme();
=======
  const { isAuth, role, permissions = [] } = useSelector(state => state.user);
  const isEmployee = String(role || "").toLowerCase() === "employee";
  const canCreateOrder = useHasPermission("orders.create");
  const canViewInventory = useHasPermission("inventory.view");
>>>>>>> origin/main

  if (isLoading) return <FullScreenLoader />;

  // Modern POS Restaurant Management Layout
  if (isModern && location.pathname !== "/auth" && isAuth) {
    return (
      <ModernLayout>
        <AppRoutes />
      </ModernLayout>
    );
  }

  // Classic Layout (Revertable at any time)
  return (
    <>
<<<<<<< HEAD
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      {isAuth && <NewOrderPopup />}
      {isAuth && <LowStockAlert />}
      {!hideWhatsAppRoutes.includes(location.pathname) && <WhatsAppButton />}
      <AppRoutes />
=======
      {!isEmployee && !hideHeaderRoutes.includes(location.pathname) && <Header />}
      {!isEmployee && isAuth && canCreateOrder && <NewOrderPopup />}
      {!isEmployee && isAuth && canViewInventory && <LowStockAlert />}
      {!isEmployee && isAuth && permissions.includes("orders.view") && <PrepAlertCenter />}
      {!isEmployee && !hideWhatsAppRoutes.includes(location.pathname) && <WhatsAppButton />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes permission="orders.view">
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route path="/auth" element={isAuth ? <Navigate to="/" /> : <Auth />} />
        <Route path="/change-password" element={<ProtectedRoutes><ChangePassword /></ProtectedRoutes>} />
        <Route path="/employee" element={<ProtectedRoutes><EmployeePortal /></ProtectedRoutes>} />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes permission="orders.view">
              <Orders />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/tables"
          element={
            <ProtectedRoutes permission="tables.view">
              <Tables />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoutes permission="menu.view">
              <Menu />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/outdoor"
          element={
            <ProtectedRoutes permission="orders.create">
              <Outdoor />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/online-orders"
          element={
            <ProtectedRoutes permission="orders.view">
              <OnlineOrders />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<main className="min-h-[70vh] px-4 py-16 text-center text-white"><h1 className="text-3xl font-bold">Page not found</h1><p className="mt-3 text-[#aaa]">The page you requested does not exist or you do not have access.</p><a className="mt-6 inline-block text-[#f6b100] underline" href="/">Return to POS</a></main>} />
      </Routes>
>>>>>>> origin/main
    </>
  );
}

function ProtectedRoutes({ children, permission }) {
  const { isAuth, role, permissions = [], forcePasswordChange } = useSelector((state) => state.user);
  const location = useLocation();
  if (!isAuth) {
    return <Navigate to="/auth" />;
  }
  if (forcePasswordChange && location.pathname !== "/change-password") return <Navigate to="/change-password" replace />;
  if (permission && !permissions.includes(permission)) {
    return <Navigate to={permissions.some((item) =>
      ["users.view", "staff.view", "assets.view", "menu.view", "inventory.view", "finance.view", "settings.view"].includes(item)
    ) ? "/dashboard" : "/auth"} replace />;
  }
  const isEmployee = String(role || "").toLowerCase() === "employee";
  if (isEmployee && !["/employee", "/change-password"].includes(location.pathname)) return <Navigate to="/employee" replace />;
  if (!isEmployee && location.pathname === "/employee") return <Navigate to="/" replace />;

  return children;
}
ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

function useHasPermission(permission) {
  const permissions = useSelector((state) => state.user.permissions);
  return permissions.includes(permission);
}

// Non-admin roles enter the dashboard only for their scoped staff or asset tabs.
function AdminRoute({ children }) {
  const { role, permissions = [] } = useSelector((state) => state.user);
  if (!["admin", "super admin", "cashier", "accountant", "asset manager", "read only", "hr manager", "payroll manager"].includes(String(role || "").toLowerCase()) &&
      !permissions.some((permission) => [
        "users.view", "staff.view", "assets.view", "dashboard.view", "menu.view",
        "inventory.view", "orders.view", "payments.process", "finance.view", "settings.view", "coupons.manage",
      ].includes(permission))) {
    return <Navigate to="/" replace />;
  }

  return children;
}
AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <Router>
      <UIThemeProvider>
        <MusicPlayerProvider>
          <Layout />
        </MusicPlayerProvider>
      </UIThemeProvider>
    </Router>
  );
}

export default App;
