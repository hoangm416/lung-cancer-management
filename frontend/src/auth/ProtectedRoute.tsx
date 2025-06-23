import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  // Kiểm tra token hoặc trạng thái đăng nhập ở localStorage/sessionStorage
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const expireTime = localStorage.getItem("expireTime") || sessionStorage.getItem("expireTime");
  if (!token || !expireTime) return false;
  if (Date.now() > Number(expireTime)) {
    // Hết hạn, xóa token và email
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("expireTime");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("expireTime");
    return false;
  }
  return true;
};

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;