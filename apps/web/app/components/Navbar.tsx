"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("cricnova_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("cricnova_user");
    setUser(null);
    router.push("/signin");
  };

  const navLinks = [
    { href: "/", label: t("Home", "होम") },
    { href: "/live", label: t("Live", "लाइव") },
    { href: "/matches", label: t("Matches", "मैचेस") },
    { href: "/tournaments", label: t("Tournaments", "टूर्नामेंट्स") },
    { href: "/news", label: t("News", "न्यूज़") },
  ];

  return (
    <header style={{ borderBottom: "1px solid #e2e8f0", background: "rgba(255, 255, 255, 0.98)", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)", backdropFilter: "blur(10px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ background: "#2563eb", color: "#fff", width: "34px", height: "34px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "16px" }}>C</span>
          <span style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>CricNova</span>
        </Link>

        {/* Nav Links */}
        <nav style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                style={{ 
                  textDecoration: "none", 
                  fontSize: "14px", 
                  fontWeight: isActive ? 700 : 500, 
                  color: isActive ? "#2563eb" : "#64748b",
                  transition: "color 0.2s ease"
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button 
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, color: "#0f172a", cursor: "pointer" }}
          >
            {language === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
          </button>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", background: "#eff6ff", padding: "6px 12px", borderRadius: "20px", border: "1px solid #bfdbfe" }}>
                👤 {user.name}
              </span>
              <button 
                onClick={handleLogout}
                style={{ background: "#ef4444", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
              >
                {t("Logout", "लॉग आउट")}
              </button>
            </div>
          ) : (
            <>
              <Link href="/signin">
                <button style={{ background: "transparent", color: "#64748b", border: "1px solid #cbd5e1", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                  {t("Sign In", "साइन इन")}
                </button>
              </Link>
              
              <Link href="/signup">
                <button style={{ background: "#2563eb", color: "#fff", border: "none", padding: "9px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)" }}>
                  {t("Sign Up", "साइन अप")}
                </button>
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}