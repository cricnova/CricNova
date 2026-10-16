"use client";

import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    // Check login status (example auth check)
    const auth = localStorage.getItem("cricnova_logged_in");
    if (auth === "true") {
      setIsLoggedIn(true);
    }

    const saved = localStorage.getItem("tournaments");
    if (saved) {
      setTournaments(JSON.parse(saved));
    }
  }, []);

  const saveToStorage = (data: any[]) => {
    setTournaments(data);
    localStorage.setItem("tournaments", JSON.stringify(data));
  };

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please log in to create a tournament!");
      router.push("/signin");
      return;
    }

    if (!tournamentName.trim()) {
      alert("Please enter tournament name!");
      return;
    }

    const newTournament = {
      id: Date.now().toString(),
      name: tournamentName.trim(),
      location: location.trim() || "Ground or city",
      date: new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [newTournament, ...tournaments];
    saveToStorage(updated);
    setTournamentName("");
    setLocation("");
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!isLoggedIn) {
      alert("Unauthorized! Please login first.");
      return;
    }
    if (confirm("Are you sure you want to delete this tournament?")) {
      const updated = tournaments.filter(t => t.id !== id);
      saveToStorage(updated);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#fff", fontFamily: "sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px" }}>
        
        <div style={{ fontSize: "12px", color: "#f97316", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "5px" }}>
          Matchday Management
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: 800, margin: "0 0 8px 0" }}>Tournaments</h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "25px" }}>
          Explore ongoing and upcoming competitions.
        </p>

        {isLoggedIn && (
          <button 
            onClick={() => setShowModal(true)}
            style={{ background: "#f97316", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}
          >
            <span style={{ fontSize: "16px", fontWeight: 900 }}>+</span> Create Tournament
          </button>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "12px", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>All Tournaments</h3>
          <span style={{ color: "#64748b", fontSize: "13px" }}>{tournaments.length} total</span>
        </div>

        {tournaments.length === 0 ? (
          <div style={{ border: "2px dashed #334155", borderRadius: "12px", padding: "60px 20px", textAlign: "center", background: "#0f172a" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>No tournaments available right now</h3>
            <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>Check back later for upcoming matches.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {tournaments.map((t) => (
              <div key={t.id} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: 700, color: "#fff" }}>{t.name}</h3>
                  <div style={{ display: "flex", gap: "15px", color: "#94a3b8", fontSize: "12px" }}>
                    <span>📍 {t.location}</span>
                    <span>📅 {t.date}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button 
                    onClick={() => router.push(`/tournaments/${t.id}`)}
                    style={{ background: "#0284c7", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}
                  >
                    View Matches
                  </button>
                  {isLoggedIn && (
                    <>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        style={{ background: "#7f1d1d", color: "#fca5a5", border: "none", padding: "8px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {showModal && isLoggedIn && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px", width: "450px", padding: "25px", position: "relative" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Create Tournament</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleCreateTournament}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#f97316", marginBottom: "5px" }}>* Tournament name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Weekend Premier League" 
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", background: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", outline: "none", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#94a3b8", marginBottom: "5px" }}>Location</label>
                <input 
                  type="text" 
                  placeholder="Ground or city (optional)" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", background: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", outline: "none", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: "#334155", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#f97316", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>Create</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}