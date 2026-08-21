import { Routes, Route } from "react-router-dom";
import Register from "../components/Register";
import LoginPage from "../components/LoginPage";

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/login" element = {<LoginPage />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;