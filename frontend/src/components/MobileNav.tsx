import { CircleUserRound, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import MobileNavLinks from "./MobileNavLinks";
import { useState } from "react";

const MobileNav = () => {
  const [email] = useState(
    () => localStorage.getItem("email") || sessionStorage.getItem("email")
  );
  const isAuthenticated =
    !!localStorage.getItem("token") || !!sessionStorage.getItem("token");

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("email");
  //   sessionStorage.removeItem("token");
  //   sessionStorage.removeItem("email");
  //   navigate("/login");
  // };

  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-orange-500" />
      </SheetTrigger>
      <SheetContent className="space-y-3">
        <SheetTitle>
          {isAuthenticated && (
            <span className="flex items-center font-bold gap-2">
              <CircleUserRound className="text-accent" />
              {email}
            </span>
          )}
        </SheetTitle>
        <Separator />
        <SheetDescription className="flex flex-col gap-4">
          {isAuthenticated && <MobileNavLinks /> }
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
