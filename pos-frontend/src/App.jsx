import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Home, Auth, Orders, Tables, Menu, Outdoor, Dashboard, OnlineOrders } from "./pages";
import Header from "./components/shared/Header";
import NewOrderPopup from "./components/shared/NewOrderPopup";
import LowStockAlert from "./components/shared/LowStockAlert";
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
  const hideHeaderRoutes = ["/auth"];
  const hideWhatsAppRoutes = ["/menu"];
  const { isAuth } = useSelector((state) => state.user);
  const { isModern } = useUITheme();

  if (isLoading) return <FullScreenLoader />;

  // Modern Tossdown Restaurant Management Layout
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
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      {isAuth && <NewOrderPopup />}
      {isAuth && <LowStockAlert />}
      {!hideWhatsAppRoutes.includes(location.pathname) && <WhatsAppButton />}
      <AppRoutes />
    </>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" />;
  }

  return children;
}

// General POS administration is still Admin-only. Asset roles are allowed
// through to the Dashboard route, where only their Assets tab is exposed.
function AdminRoute({ children }) {
  const { role } = useSelector((state) => state.user);
  if (!["admin", "accountant", "asset manager", "read only"].includes(String(role || "").toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
}

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
