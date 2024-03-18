// Imports
import "@/styles/tailwind.css";
import Theme from "@/app/theme";
import Header from "@/components/header";
import Footer from "@/components/footer";

// Metadata
export const metadata = {
  title: "Timothy Pidashev",
  description: "Engineering the Future!"
};

// Exports
export default function Layout({children}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Theme>
          <Header />
          <main className="dark:bg-red-1">
            {children}
          </main>
          <Footer />
        </Theme>
      </body>
    </html>
  );
}
