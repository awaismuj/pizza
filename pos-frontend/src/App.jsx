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
  const { isAuth } = useSelector(state => state.user);

  if(isLoading) return <FullScreenLoader />

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      {isAuth && <NewOrderPopup />}
      {isAuth && <LowStockAlert />}
      {!hideWhatsAppRoutes.includes(location.pathname) && <WhatsAppButton />}
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
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
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

// Dashboard (inventory, menu, profit...) is admin-only. Cashiers/waiters who
// type the URL are sent back home instead of seeing admin tools.
function AdminRoute({ children }) {
  const { role } = useSelector((state) => state.user);
  if (String(role || "").toLowerCase() !== "admin") {
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
