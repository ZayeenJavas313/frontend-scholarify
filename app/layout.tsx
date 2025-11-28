import "./globals.css";   // ← WAJIB
import "aos/dist/aos.css"; // import CSS AOS
import Navbar from "@/app/components/Navbar";
import AosInit from "@/app/components/AosInit";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <AosInit />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
