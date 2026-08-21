import { Routes, Route } from "react-router-dom";
import Register from "../components/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;