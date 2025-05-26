import UsernameMenu from "./UsernameMenu";

const MainNav = () => {
  const isAuthenticated =
    !!localStorage.getItem("token") || !!sessionStorage.getItem("token");

  return (
    <span className="flex space-x-2 items-center">
      {isAuthenticated && <UsernameMenu />}
    </span>
  );
};

export default MainNav;