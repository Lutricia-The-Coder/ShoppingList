import { Routes, Route } from "react-router-dom";

import Login from "../pages/LoginPage";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import Profile from "../pages/Profile";

import ShoppingListDetails from "../pages/ShoppingListDetails";

import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/lists/:listId"
          element={<ShoppingListDetails />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;