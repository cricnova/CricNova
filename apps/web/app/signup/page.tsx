"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // User save karo aur seedha Home page par bhejo
    localStorage.setItem("cricnova_user", JSON.stringify({ name, email }));
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
          <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", margin: "5px 0" }}>Create Account</h2>
        </div>

        <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", color: "#0f172a", fontSize: "14px" }} 
          />
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
          <button type="submit" style={{ background: "#2563eb", color: "#fff", padding: "12px", borderRadius: "8px", border: "none", fontWeight: 800, cursor: "pointer", fontSize: "15px" }}>
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#64748b", textAlign: "center" }}>
          Already have an account? <Link href="/signin" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}