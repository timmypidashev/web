// Imports
import "@/style/globals.css";
import "@/style/prism-theme.css";
import Theme from "@/app/theme";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Container from "@/components/ui/container";
import Head from 'next/head';

// Metadata
export const metadata = {
 title: "Timothy Pidashev",
 description: "Engineering the Future!"
};

// Exports
export default function Layout({children}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <script src="prism.js"></script>
      </Head>
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
