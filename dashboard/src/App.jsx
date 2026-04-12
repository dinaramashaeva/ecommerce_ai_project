import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Products from "./components/Products";
import Profile from "./components/Profile";
import Users from "./components/Users";

import { getUser } from "./store/slices/authSlice";

function App() {
  const { openedComponent } = useSelector((state) => state.extra);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const renderDashboardContent = () => {
    switch (openedComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Orders":
        return <Orders />;
      case "Users":
        return <Users />;
      case "Profile":
        return <Profile />;
      case "Products":
        return <Products />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            isAuthenticated && user?.role === "Admin" ? (
              <div className="flex min-h-screen">
                <SideBar />
                {renderDashboardContent()}
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      <ToastContainer theme="dark" />
    </Router>
  );
}

export default App;