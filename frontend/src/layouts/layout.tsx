import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

type Props = {
  children: React.ReactNode;
  showHero?: boolean;
};

const Layout = ({ children, showHero = false }: Props) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      {showHero && <Hero />}
      <main className="container mx-auto flex-1 py-5">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
