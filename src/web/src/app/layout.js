// Imports
import '@/styles/tailwind.css';
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

// Metadata
export const metadata = {
  title: "Timothy Pidashev",
  description: "Engineering the Future!"
};

// Exports
export default function Layout({children}) {
  return (
    <html lang="en">
      <body>
        <NavBar/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
