import Container from "@/components/ui/container";
import DefaultHeader from "@/components/header/default";
import Sidebar from "@/components/header/sidebar";

function Header() {
  return (
    <Container>
      <header className="
        hidden md:flex
        lg:text-4xl md:text-3xl
      ">
        <DefaultHeader />
      </header>
      <header className="
        flex md:hidden
        lg:text-4xl md:text-3xl
      ">
        <Sidebar />
      </header>
    </Container>
  );
}

export default Header;
