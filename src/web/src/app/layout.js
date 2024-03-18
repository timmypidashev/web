// Imports
import "@/app/globals.css";
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
      <body className="bg-gray-50 dark:bg-slate-800">
        <Theme>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </Theme>
      </body>
    </html>
  );
}
