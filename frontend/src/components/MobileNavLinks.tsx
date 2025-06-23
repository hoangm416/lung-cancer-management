import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const MobileNavLinks = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <>
      <Link
        to="/profile"
        className="flex bg-white items-center font-bold hover:text-primary"
      >
        Hồ sơ cá nhân
      </Link>
      <Button
        onClick={handleLogout}
        className="flex items-center px-3 font-bold hover:bg-hover hover:text-primary"
      >
        Đăng xuất
      </Button>
    </>
  );
};

export default MobileNavLinks;
