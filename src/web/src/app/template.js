import PageTransition from "@/components/transitions";

export default function rootTemplate({ children }) {
  return <PageTransition>{children}</PageTransition>;
}
