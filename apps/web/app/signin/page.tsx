"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // User ko localStorage me save karo taaki website ko pata chale user logged in hai
    const userName = email.split("@")[0];
    localStorage.setItem("cricnova_user", JSON.stringify({ email, name: userName }));
    
    // Seedha Home Page par redirect karo
    router.push("/");
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: "20px" }}>
      <div style={{ background: "#fff", padding: "40px", borderRadius: "20px", border: "1px solid #e2e8f0", width: "100%", maxWidth: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <span style={{ background: "#2563eb", color: "#fff", width: "34px", height: "34px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "16px" }}>C</span>
            <span style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>CricNova</span>
          </Link>
          <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", margin: "5px 0" }}>Sign In to CricNova</h2>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", color: "#0f172a", fontSize: "14px" }} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", color: "#0f172a", fontSize: "14px" }} 
          />
          
          <div style={{ textAlign: "right", marginTop: "-5px" }}>
            <Link href="/forgot-password" style={{ fontSize: "13px", color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" style={{ background: "#2563eb", color: "#fff", padding: "12px", borderRadius: "8px", border: "none", fontWeight: 800, cursor: "pointer", marginTop: "5px", fontSize: "15px" }}>
            Sign In
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#64748b", textAlign: "center" }}>
          Don't have an account? <Link href="/signup" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}