// Imports
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Metadata
export const metadata = {
  title: "Timothy Pidashev",
  description: "Engineering the Future!"
};

// Exports
export default function Layout({children}) {
  return (
    <>
      <Navbar/>
      <main>{children}</main>
      <Footer/>
    </>
  );
}
