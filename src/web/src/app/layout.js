// Imports
import "@/style/globals.css";
import Theme from "@/app/theme";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Container from "@/components/ui/container";

// Metadata
export const metadata = {
 title: "Timothy Pidashev",
 description: "Engineering the Future!"
};

// Exports
export default function Layout({children}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="
        bg-light-background text-light-foreground 
        dark:bg-dark-background dark:text-dark-foreground
      ">
        <Theme>
          <Container>
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </Container >
        </Theme>
      </body>
    </html>
  );
}
