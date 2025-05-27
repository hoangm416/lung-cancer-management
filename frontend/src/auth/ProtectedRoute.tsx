import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  // Kiểm tra token hoặc trạng thái đăng nhập ở localStorage/sessionStorage
  return !!localStorage.getItem("token"); // hoặc logic của bạn
};

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;