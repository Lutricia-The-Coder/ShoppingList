import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import ShoppingListDetails from "../pages/ShoppingListDetails";
import AppLayout from "../components/AppLayout";
import { useAppSelector } from "../store/hooks";

const AppRoutes = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      {/* Public Routes (No Sidebar, Split Screen) */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected App Routes (With Sidebar) */}
      {isAuthenticated ? (
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/lists/:listId" element={<ShoppingListDetails />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};

export default AppRoutes;