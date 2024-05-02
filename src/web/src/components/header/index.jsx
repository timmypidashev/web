import Container from "@/components/ui/container";
import DefaultHeader from "@/components/header/default";
import Sidebar from "@/components/header/sidebar";

function Header() {
  return (
    <header className="hidden md:flex lg:text-4xl md:text-10xl">
      <DefaultHeader />
    </header>
  );
}

export default Header;
