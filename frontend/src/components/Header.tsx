// import MobileNav from "./MobileNav";
// import MainNav from "./MainNav";
import { Link, NavLink } from "react-router-dom";
import {
  LucidePieChart as PieChartIcon,
  LucideClipboardList as FileIcon,
  LucideBookOpen as BookIcon,
  LucideBrain as BrainIcon,
  LucideHelpCircle as GuideIcon,
} from 'lucide-react';

const Header = () => {
  return (
    <div className="border-b-2 border-primary py-4 shadow-md bg-white h-20">
      <div className="container flex justify-start gap-32 items-center px-4 md:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight text-primary"
        >
          LungCare
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex gap-4">
          {[
            { path: "/", label: "Thống kê", Icon: PieChartIcon },
            { path: "/research", label: "Nghiên cứu", Icon: BookIcon },
            { path: "/record", label: "Hồ sơ", Icon: FileIcon },
            { path: "/analytics", label: "Phân tích", Icon: BrainIcon },
            { path: "/guide", label: "Hướng dẫn", Icon: GuideIcon },
          ].map(({ path, label, Icon }) => (
            <NavLink key={path} to={path} className={({ isActive }) =>
              `m-1 flex h-[40px] w-[135px] cursor-pointer items-center justify-center gap-x-2 rounded-md transition-colors
              ${isActive ? "bg-primary text-white" : "bg-white text-black hover:bg-hover"}`
            }>
              <Icon />
              <p>{label}</p>
            </NavLink>
          ))}
        </nav>

        {/* <div className="flex items-center gap-4">
          <div className="md:hidden">
            <MobileNav />
          </div>
          <div className="hidden md:block">
            <MainNav />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Header;
