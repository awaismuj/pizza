import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import PropTypes from "prop-types";
import { Home, Auth, Orders, Tables, Menu, Outdoor, Dashboard, OnlineOrders, EmployeePortal } from "./pages";
import ChangePassword from "./pages/ChangePassword";
import Header from "./components/shared/Header";
import NewOrderPopup from "./components/shared/NewOrderPopup";
import LowStockAlert from "./components/shared/LowStockAlert";
import PrepAlertCenter from "./components/prep/PrepAlertCenter";
import WhatsAppButton from "./components/shared/WhatsAppButton";
import MusicPlayerProvider from "./components/shared/MusicPlayerProvider";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import useScrollHoverFix from "./hooks/useScrollHoverFix";
import FullScreenLoader from "./components/shared/FullScreenLoader"
import FoodPosterGenerator from "./components/dashboard/FoodPosterGenerator";

function Layout() {
  const isLoading = useLoadData();
  useScrollHoverFix();
  const location = useLocation();
  const hideHeaderRoutes = ["/auth", "/poster-maker"];
  // The floating WhatsApp button is fixed near the bottom-right of every
  // page - but on /menu that's exactly where the Cash/Online/Print
  // Receipt/Place Order row sits, so it was floating on top of and
  // partially hiding those buttons. Support inquiries aren't the point of
  // that screen anyway, so it's simplest to just not show it there.
  const hideWhatsAppRoutes = ["/menu", "/poster-maker"];
  const { isAuth, role, permissions = [] } = useSelector(state => state.user);
  const isEmployee = String(role || "").toLowerCase() === "employee";
  const canCreateOrder = useHasPermission("orders.create");
  const canViewInventory = useHasPermission("inventory.view");

  if(isLoading) return <FullScreenLoader />

  return (
    <>
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
        <Route path="/poster-maker" element={<GuestPosterMaker />} />
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
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </>
  );
}

function GuestPosterMaker() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] py-6 sm:py-10">
      <FoodPosterGenerator guestMode />
    </main>
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
      <MusicPlayerProvider>
        <Layout />
      </MusicPlayerProvider>
    </Router>
  );
}

export default App;
