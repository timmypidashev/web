import PageTransition from "@/components/ui/transitions";

export default function rootTemplate({ children }) {
  return <PageTransition>{children}</PageTransition>;
}
