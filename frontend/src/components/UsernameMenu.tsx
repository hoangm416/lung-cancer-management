import { CircleUserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { Separator } from "./ui/separator";

const UsernameMenu = () => {
  const navigate = useNavigate();
  const [email] = useState(
    () => localStorage.getItem("email") || sessionStorage.getItem("email")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 font-bold gap-2">
        <CircleUserRound className="text-accent" />
        {email}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to="/profile" className="font-bold">
            Hồ sơ cá nhân
          </Link>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem>
          <Button
            onClick={handleLogout}
            className="flex flex-1 font-bold"
          >
            Đăng xuất
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsernameMenu;
