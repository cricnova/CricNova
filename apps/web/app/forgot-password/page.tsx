"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: "20px" }}>
      <div style={{ background: "#fff", padding: "40px", borderRadius: "20px", border: "1px solid #e2e8f0", width: "100%", maxWidth: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "8px", color: "#0f172a" }}>Reset Password</h2>
          <p style={{ fontSize: "14px", color: "#64748b" }}>Enter your registered email and we'll send you a password reset link.</p>
        </div>

        {submitted ? (
          <div style={{ background: "#dcfce7", color: "#16a34a", padding: "16px", borderRadius: "10px", textAlign: "center", fontSize: "14px", fontWeight: 700, marginBottom: "20px" }}>
            Password reset link sent to your email! Check your inbox.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input type="email" placeholder="Enter your email address" required style={{ padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }} />
            <button type="submit" style={{ background: "#2563eb", color: "#fff", padding: "12px", borderRadius: "8px", border: "none", fontWeight: 800, cursor: "pointer" }}>Send Reset Link</button>
          </form>
        )}

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#64748b", textAlign: "center" }}>
          Remembered your password? <Link href="/signin" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
        </p>

      </div>
    </div>
  );
}