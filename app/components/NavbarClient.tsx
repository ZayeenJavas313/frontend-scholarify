"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./Navbar.css";
import logoPng from "@/public/images/scholarify-logo.png";

export default function NavbarClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  };

  // Sembunyikan tombol di halaman login saja
  const showAuthBtn = pathname !== "/login";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo" data-aos="fade-down" data-aos-delay="50">
          <Image
            src={logoPng}
            alt="Scholarify Logo"
            width={40}
            height={40}
            className="logo-img"
            priority
          />
          <span className="navbar-title" data-aos="fade-right">Scholarify</span>
        </Link>

        {showAuthBtn && (
          <div className="navbar-buttons" data-aos="fade-left" data-aos-delay="100">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            ) : (
              <Link href="/login" className="login-btn">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
