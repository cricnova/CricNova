"use client";

import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TournamentMatchesPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params?.id || "t-1";

  const [matches, setMatches] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [overs, setOvers] = useState(1);
  const [matchNo, setMatchNo] = useState(1);
  const [tossWinner, setTossWinner] = useState("Team1");
  const [optedTo, setOptedTo] = useState("Bat");
  const [matchTied, setMatchTied] = useState("Yes");
  const [ballsPerOver, setBallsPerOver] = useState("6");
  const [matchType, setMatchType] = useState("Group Stage");

  useEffect(() => {
    const saved = localStorage.getItem(`matches_${tournamentId}`);
    if (saved) {
      setMatches(JSON.parse(saved));
    }
  }, [tournamentId]);

  const saveMatches = (data: any[]) => {
    setMatches(data);
    localStorage.setItem(`matches_${tournamentId}`, JSON.stringify(data));
  };

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team1.trim() || !team2.trim()) {
      alert("Please enter both Team 1 and Team 2 names!");
      return;
    }

    const newMatch = {
      id: Date.now().toString(),
      team1: team1.trim(),
      team2: team2.trim(),
      overs,
      matchNo,
      tossWinner: tossWinner === "Team1" ? team1 : team2,
      optedTo,
      matchTied,
      ballsPerOver,
      matchType,
      winner: "Match Not Finish Yet"
    };

    const updated = [newMatch, ...matches];
    saveMatches(updated);
    setShowModal(false);

    // Reset form
    setTeam1("");
    setTeam2("");
  };

  const handleDeleteMatch = (id: string) => {
    if (confirm("Delete this match?")) {
      const updated = matches.filter(m => m.id !== id);
      saveMatches(updated);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#070b14", color: "#fff", fontFamily: "sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#38bdf8", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
              Tournament Matches
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>Matches</h1>
          </div>
          <button 
            onClick={() => router.push("/tournaments")}
            style={{ background: "#1e293b", color: "#fff", border: "1px solid #334155", padding: "8px 14px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}
          >
            ← Back to tournaments
          </button>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          style={{ background: "#16a34a", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "30px" }}
        >
          <span style={{ fontSize: "16px", fontWeight: 900 }}>+</span> Create Match
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "10px", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>Fixtures</h3>
          <span style={{ color: "#64748b", fontSize: "12px" }}>{matches.length} Matches</span>
        </div>

        {matches.length === 0 ? (
          <div style={{ border: "2px dashed #1e293b", borderRadius: "12px", padding: "50px 20px", textAlign: "center", background: "#0b0f19" }}>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", color: "#94a3b8" }}>No Matches Yet</h3>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {matches.map((m) => (
              <div key={m.id} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", padding: "18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ background: "#1e293b", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, color: "#38bdf8" }}>{m.matchNo}</span>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>{m.team1} vs {m.team2}</h3>
                  </div>
                  <div style={{ display: "flex", gap: "20px", color: "#94a3b8", fontSize: "12px" }}>
                    <span>Overs: <b style={{ color: "#fff" }}>{m.overs}</b></span>
                    <span>Toss: <b style={{ color: "#fff" }}>{m.tossWinner} · {m.optedTo}</b></span>
                    <span>Winner: <b style={{ color: "#f97316" }}>{m.winner}</b></span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ background: "#14532d", color: "#86efac", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>
                    {m.matchType}
                  </span>
                  
                  {/* Match Page Button directing to Scoring Panel */}
                  <button 
                    onClick={() => router.push(`/scorer/${m.id}`)}
                    style={{ background: "#0284c7", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}
                  >
                    Match Page
                  </button>

                  <button 
                    onClick={() => handleDeleteMatch(m.id)}
                    style={{ background: "#7f1d1d", color: "#fca5a5", border: "none", padding: "8px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                  >
                    🗑️
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Create Match Modal */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px", width: "550px", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700 }}>Create Match</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "20px" }}>Choose Two Different Teams, Then Set The Match Details And Toss.</p>

            <form onSubmit={handleCreateMatch}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "5px" }}>Team 1 Name</label>
                  <input type="text" placeholder="Enter Team 1 Name" value={team1} onChange={(e) => setTeam1(e.target.value)} required style={{ width: "100%", padding: "8px 10px", background: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "13px" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "5px" }}>Team 2 Name</label>
                  <input type="text" placeholder="Enter Team 2 Name" value={team2} onChange={(e) => setTeam2(e.target.value)} required style={{ width: "100%", padding: "8px 10px", background: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "13px" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "5px" }}>Overs</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button type="button" onClick={() => setOvers(Math.max(1, overs - 1))} style={{ background: "#1e293b", color: "#fff", border: "1px solid #334155", padding: "8px 12px", borderRadius: "6px 0 0 6px", cursor: "pointer" }}>-</button>
                    <input type="number" value={overs} onChange={(e) => setOvers(Number(e.target.value))} style={{ width: "100%", textAlign: "center", padding: "8px", background: "#020617", borderTop: "1px solid #334155", borderBottom: "1px solid #334155", borderLeft: "none", borderRight: "none", color: "#fff", fontSize: "13px" }} />
                    <button type="button" onClick={() => setOvers(overs + 1)} style={{ background: "#1e293b", color: "#fff", border: "1px solid #334155", padding: "8px 12px", borderRadius: "0 6px 6px 0", cursor: "pointer" }}>+</button>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "5px" }}>Match No.</label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button type="button" onClick={() => setMatchNo(Math.max(1, matchNo - 1))} style={{ background: "#1e293b", color: "#fff", border: "1px solid #334155", padding: "8px 12px", borderRadius: "6px 0 0 6px", cursor: "pointer" }}>-</button>
                    <input type="number" value={matchNo} onChange={(e) => setMatchNo(Number(e.target.value))} style={{ width: "100%", textAlign: "center", padding: "8px", background: "#020617", borderTop: "1px solid #334155", borderBottom: "1px solid #334155", borderLeft: "none", borderRight: "none", color: "#fff", fontSize: "13px" }} />
                    <button type="button" onClick={() => setMatchNo(matchNo + 1)} style={{ background: "#1e293b", color: "#fff", border: "1px solid #334155", padding: "8px 12px", borderRadius: "0 6px 6px 0", cursor: "pointer" }}>+</button>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "12px", fontSize: "12px" }}>
                <span style={{ color: "#94a3b8", display: "block", marginBottom: "5px" }}>Toss Won By?</span>
                <label style={{ marginRight: "15px", cursor: "pointer" }}><input type="radio" name="tossWinner" checked={tossWinner === "Team1"} onChange={() => setTossWinner("Team1")} /> {team1 || "Team 1"}</label>
                <label style={{ cursor: "pointer" }}><input type="radio" name="tossWinner" checked={tossWinner === "Team2"} onChange={() => setTossWinner("Team2")} /> {team2 || "Team 2"}</label>
              </div>

              <div style={{ marginBottom: "12px", fontSize: "12px" }}>
                <span style={{ color: "#94a3b8", display: "block", marginBottom: "5px" }}>Opted To?</span>
                <label style={{ marginRight: "15px", cursor: "pointer" }}><input type="radio" name="optedTo" checked={optedTo === "Bat"} onChange={() => setOptedTo("Bat")} /> Bat</label>
                <label style={{ cursor: "pointer" }}><input type="radio" name="optedTo" checked={optedTo === "Bowl"} onChange={() => setOptedTo("Bowl")} /> Bowl</label>
              </div>

              <div style={{ marginBottom: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "5px" }}>Balls Per Over</label>
                  <select value={ballsPerOver} onChange={(e) => setBallsPerOver(e.target.value)} style={{ width: "100%", padding: "8px", background: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "13px" }}>
                    <option value="6">6</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", marginBottom: "5px" }}>Match Type</label>
                  <select value={matchType} onChange={(e) => setMatchType(e.target.value)} style={{ width: "100%", padding: "8px", background: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "13px" }}>
                    <option value="Group Stage">Group Stage</option>
                    <option value="Super Over">Super Over</option>
                    <option value="Quarter Final">Quarter Final</option>
                    <option value="Qualifier 1">Qualifier 1</option>
                    <option value="Qualifier 2">Qualifier 2</option>
                    <option value="Eliminator">Eliminator</option>
                    <option value="Semi Final">Semi Final</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: "#334155", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ background: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: 700, cursor: "pointer" }}>Create Match</button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}