import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import PropTypes from "prop-types";
import { Home, Auth, Orders, Tables, Menu, Outdoor, Dashboard, OnlineOrders } from "./pages";
import Header from "./components/shared/Header";
import NewOrderPopup from "./components/shared/NewOrderPopup";
import LowStockAlert from "./components/shared/LowStockAlert";
import WhatsAppButton from "./components/shared/WhatsAppButton";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import useScrollHoverFix from "./hooks/useScrollHoverFix";
import FullScreenLoader from "./components/shared/FullScreenLoader"
import FoodPosterGenerator from "./components/dashboard/FoodPosterGenerator";

function Layout() {
  const isLoading = useLoadData();
  useScrollHoverFix();
  const location = useLocation();
  const isGuestPoster = location.pathname === "/poster-maker";
  const hideHeaderRoutes = ["/auth", "/poster-maker"];
  // The floating WhatsApp button is fixed near the bottom-right of every
  // page - but on /menu that's exactly where the Cash/Online/Print
  // Receipt/Place Order row sits, so it was floating on top of and
  // partially hiding those buttons. Support inquiries aren't the point of
  // that screen anyway, so it's simplest to just not show it there.
  const hideWhatsAppRoutes = ["/menu", "/poster-maker"];
  const { isAuth } = useSelector(state => state.user);

  if(isLoading) return <FullScreenLoader />

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      {isAuth && !isGuestPoster && <NewOrderPopup />}
      {isAuth && !isGuestPoster && <LowStockAlert />}
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
        <Route path="/poster-maker" element={<GuestPosterMaker />} />
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

function GuestPosterMaker() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] py-6 sm:py-10">
      <FoodPosterGenerator guestMode />
    </main>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" />;
  }

  return children;
}
ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

// Dashboard (inventory, menu, profit...) is admin-only. Cashiers/waiters who
// type the URL are sent back home instead of seeing admin tools.
function AdminRoute({ children }) {
  const { role } = useSelector((state) => state.user);
  if (String(role || "").toLowerCase() !== "admin") {
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
      <Layout />
    </Router>
  );
}

export default App;
