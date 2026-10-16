"use client";

import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [filter, setFilter] = useState("all"); // 'all', 'live', 'upcoming', 'completed'
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("cricnova_logged_in");
    if (auth === "true") setIsLoggedIn(true);

    // Fetch all matches saved across tournaments
    let allMatches: any[] = [];
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith("matches_")) {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        allMatches = [...allMatches, ...data];
      }
    });
    setMatches(allMatches);
  }, []);

  // Filter logic: live, upcoming, completed, or all
  const filteredMatches = matches.filter(m => {
    if (filter === "live") return m.winner === "Match Not Finish Yet" && m.isLive === true;
    if (filter === "upcoming") return m.winner === "Upcoming";
    if (filter === "completed") return m.winner !== "Match Not Finish Yet" && m.winner !== "Upcoming";
    return true; // 'all'
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#fff", fontFamily: "sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#f97316", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
              Match Center
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: 800, margin: 0 }}>All Matches</h1>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          {["all", "live", "upcoming", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                background: filter === tab ? "#f97316" : "#1e293b",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredMatches.length === 0 ? (
          <div style={{ border: "2px dashed #334155", borderRadius: "12px", padding: "50px 20px", textAlign: "center", background: "#0f172a" }}>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>No matches found in this category.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {filteredMatches.map((m) => (
              <div key={m.id} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ background: "#1e293b", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, color: "#38bdf8" }}>Match #{m.matchNo}</span>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>{m.team1} vs {m.team2}</h3>
                  </div>
                  <div style={{ display: "flex", gap: "20px", color: "#94a3b8", fontSize: "12px" }}>
                    <span>Overs: <b style={{ color: "#fff" }}>{m.overs}</b></span>
                    <span>Status: <b style={{ color: m.winner === "Match Not Finish Yet" ? "#22c55e" : "#f97316" }}>{m.winner === "Match Not Finish Yet" ? "Live / Ongoing" : m.winner}</b></span>
                  </div>
                </div>

                <div>
                  <button 
                    onClick={() => router.push(`/scorer/${m.id}`)}
                    style={{ background: "#0284c7", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}
                  >
                    View Scorecard
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}