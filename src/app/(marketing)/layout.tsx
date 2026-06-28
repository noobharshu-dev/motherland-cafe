import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mkt">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
