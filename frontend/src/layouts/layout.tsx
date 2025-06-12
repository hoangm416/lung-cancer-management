// import Footer from "@/components/Footer";
import Header from "@/components/Header";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="container mx-auto flex-1 py-5">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
