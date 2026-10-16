import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Home, Auth, Orders, Tables, Menu, Outdoor, Dashboard, OnlineOrders, EmployeePortal } from "./pages";
import Header from "./components/shared/Header";
import NewOrderPopup from "./components/shared/NewOrderPopup";
import LowStockAlert from "./components/shared/LowStockAlert";
import WhatsAppButton from "./components/shared/WhatsAppButton";
import MusicPlayerProvider from "./components/shared/MusicPlayerProvider";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import useScrollHoverFix from "./hooks/useScrollHoverFix";
import FullScreenLoader from "./components/shared/FullScreenLoader"

function Layout() {
  const isLoading = useLoadData();
  useScrollHoverFix();
  const location = useLocation();
  const hideHeaderRoutes = ["/auth"];
  // The floating WhatsApp button is fixed near the bottom-right of every
  // page - but on /menu that's exactly where the Cash/Online/Print
  // Receipt/Place Order row sits, so it was floating on top of and
  // partially hiding those buttons. Support inquiries aren't the point of
  // that screen anyway, so it's simplest to just not show it there.
  const hideWhatsAppRoutes = ["/menu"];
  const { isAuth, role } = useSelector(state => state.user);
  const isEmployee = String(role || "").toLowerCase() === "employee";

  if(isLoading) return <FullScreenLoader />

  return (
    <>
      {!isEmployee && !hideHeaderRoutes.includes(location.pathname) && <Header />}
      {isAuth && !isEmployee && <NewOrderPopup />}
      {isAuth && !isEmployee && <LowStockAlert />}
      {!isEmployee && !hideWhatsAppRoutes.includes(location.pathname) && <WhatsAppButton />}
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
        <Route path="/employee" element={<ProtectedRoutes><EmployeePortal /></ProtectedRoutes>} />
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
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth, role } = useSelector((state) => state.user);
  const location = useLocation();
  if (!isAuth) {
    return <Navigate to="/auth" />;
  }
  const isEmployee = String(role || "").toLowerCase() === "employee";
  if (isEmployee && location.pathname !== "/employee") return <Navigate to="/employee" replace />;
  if (!isEmployee && location.pathname === "/employee") return <Navigate to="/" replace />;

  return children;
}

// Non-admin roles enter the dashboard only for their scoped staff or asset tabs.
function AdminRoute({ children }) {
  const { role } = useSelector((state) => state.user);
  if (!["admin", "cashier", "accountant", "asset manager", "read only", "hr manager", "payroll manager"].includes(String(role || "").toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
}

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
