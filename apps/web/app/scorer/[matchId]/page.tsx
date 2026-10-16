"use client";

import Navbar from "../../components/Navbar";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function ScorerControlPanel() {
  const params = useParams();
  const matchId = params?.matchId || "match-1";

  const [showStartModal, setShowStartModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showTossModal, setShowTossModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showSquad1Modal, setShowSquad1Modal] = useState(false);
  const [showSquad2Modal, setShowSquad2Modal] = useState(false);
  
  const [matchStarted, setMatchStarted] = useState(false);

  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  
  const [team1, setTeam1] = useState("AAASSS");
  const [team2, setTeam2] = useState("AAA");
  
  const [tempTeam1, setTempTeam1] = useState("AAASSS");
  const [tempTeam2, setTempTeam2] = useState("AAA");

  const [tossWinner, setTossWinner] = useState("");
  const [tossDecision, setTossDecision] = useState("Batting");

  const [team1Players, setTeam1Players] = useState<{name: string, isPlaying: boolean}[]>([]);
  const [team2Players, setTeam2Players] = useState<{name: string, isPlaying: boolean}[]>([]);
  
  const [inputTeam1, setInputTeam1] = useState("");
  const [inputTeam2, setInputTeam2] = useState("");

  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [bowler, setBowler] = useState("");

  const addScore = (r: number, type = "RUN") => {
    setHistory([...history, { runs, wickets, type }]);
    setRuns(runs + r);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setRuns(lastState.runs);
      setWickets(lastState.wickets);
      setHistory(history.slice(0, history.length - 1));
    } else {
      alert("Nothing to undo!");
    }
  };

  const handleStartInnings = () => {
    if (!striker || !nonStriker || !bowler) {
      alert("Please fill all player names!");
      return;
    }
    setMatchStarted(true);
    setShowStartModal(false);
  };

  const addPlayerToTeam1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputTeam1.trim()) {
      setTeam1Players([...team1Players, { name: inputTeam1.trim(), isPlaying: true }]);
      setInputTeam1("");
    }
  };

  const addPlayerToTeam2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputTeam2.trim()) {
      setTeam2Players([...team2Players, { name: inputTeam2.trim(), isPlaying: true }]);
      setInputTeam2("");
    }
  };

  const togglePlaying1 = (index: number) => {
    const updated = [...team1Players];
    updated[index].isPlaying = !updated[index].isPlaying;
    setTeam1Players(updated);
  };

  const togglePlaying2 = (index: number) => {
    const updated = [...team2Players];
    updated[index].isPlaying = !updated[index].isPlaying;
    setTeam2Players(updated);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .cp-page { min-height: 100vh; color: #fff; background: #070b14; padding-bottom: 50px; font-family: sans-serif; }
        .cp-container { width: min(1400px, 100%); margin: 0 auto; padding: 15px; }

        .top-banner {
          display: flex;
          justify-content: space-between;
          background: linear-gradient(90deg, #0284c7, #2563eb);
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 900;
          font-size: 18px;
          margin-bottom: 12px;
          text-align: center;
        }

        .controller-section {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 15px;
          text-align: center;
        }

        .circular-runs {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 15px 0;
        }

        .circle-btn {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: #0f172a;
          border: 2px solid #38bdf8;
          color: #fff;
          font-weight: 900;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .circle-btn:hover { background: #38bdf8; color: #000; }

        .action-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-bottom: 10px;
        }

        .btn-tag {
          padding: 8px 14px;
          border-radius: 6px;
          border: none;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          color: #fff;
          transition: 0.2s;
        }
        .btn-tag:hover { opacity: 0.9; }

        .black-box {
          background: #000;
          border: 1px solid #222;
          border-radius: 8px;
          padding: 14px;
          margin-bottom: 12px;
        }

        .section-title {
          text-align: center;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .custom-input {
          width: 100%;
          padding: 8px 12px;
          background: #111;
          border: 1px solid #333;
          border-radius: 6px;
          color: #fff;
          margin-top: 5px;
        }

        .squad-btn-box {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          align-items: center;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 46px;
          height: 24px;
        }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #475569;
          transition: 0.3s;
          border-radius: 24px;
        }
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }
        input:checked + .toggle-slider { background-color: #16a34a; }
        input:checked + .toggle-slider:before { transform: translateX(22px); }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-box {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 12px;
          width: 400px;
          padding: 20px;
        }
      `}</style>

      <main className="cp-page">
        <Navbar />

        <div className="cp-container">
          
          <div className="top-banner">
            <span>{team1}</span>
            <span>VS</span>
            <span>{team2}</span>
          </div>

          <div className="controller-section">
            <div style={{ fontSize: "14px", fontWeight: 800, marginBottom: "10px" }}>CONTROLLER</div>
            
            <div className="action-row">
              <button className="btn-tag" style={{ background: "#eab308", color: "#000" }} onClick={handleUndo}>UNDO</button>
              
              <button className="btn-tag" style={{ background: "#16a34a" }} onClick={() => setShowStartModal(true)}>
                {matchStarted ? "Innings Started" : "Start 1st Innings"}
              </button>
              
              <button className="btn-tag" style={{ background: "#0ea5e9" }} onClick={() => setShowTeamModal(true)}>
                Team Name (Short Name)
              </button>
            </div>

            {matchStarted && (
              <>
                <div style={{ background: "#020617", padding: "10px", borderRadius: "8px", margin: "10px 0", fontSize: "13px", display: "flex", justifyContent: "space-around" }}>
                  <span>Score: <b>{runs}/{wickets}</b></span>
                  <span>Striker: <b>{striker}</b></span>
                  <span>Non-Striker: <b>{nonStriker}</b></span>
                  <span>Bowler: <b>{bowler}</b></span>
                </div>

                <div className="action-row" style={{ marginTop: "10px" }}>
                  <button className="btn-tag" style={{ background: "#16a34a" }} onClick={() => addScore(1, "WIDE")}>Wide</button>
                  <button className="btn-tag" style={{ background: "#16a34a" }} onClick={() => addScore(1, "NO BALL")}>No Ball</button>
                  <button className="btn-tag" style={{ background: "#16a34a" }} onClick={() => addScore(1, "BYE")}>Bye</button>
                  <button className="btn-tag" style={{ background: "#16a34a" }} onClick={() => addScore(1, "LEG BYE")}>Leg Bye</button>
                  <button className="btn-tag" style={{ background: "#dc2626" }} onClick={() => { setHistory([...history, { runs, wickets, type: "WICKET" }]); setWickets(wickets + 1); }}>Wicket</button>
                </div>

                <div className="circular-runs">
                  <button className="circle-btn" onClick={() => addScore(0, "0 RUN")}>0</button>
                  <button className="circle-btn" onClick={() => addScore(1, "1 RUN")}>1</button>
                  <button className="circle-btn" onClick={() => addScore(2, "2 RUNS")}>2</button>
                  <button className="circle-btn" onClick={() => addScore(3, "3 RUNS")}>3</button>
                  <button className="circle-btn" onClick={() => addScore(4, "4 RUNS")}>4</button>
                  <button className="circle-btn" onClick={() => addScore(6, "6 RUNS")}>6</button>
                </div>
              </>
            )}
          </div>

          <div className="black-box">
            <div className="section-title">Player Management & Lineup</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              
              <div>
                <form onSubmit={addPlayerToTeam1} style={{ display: "flex", gap: "8px" }}>
                  <input 
                    type="text" 
                    className="custom-input" 
                    placeholder={`ADD PLAYER TO ${team1}`} 
                    value={inputTeam1}
                    onChange={(e) => setInputTeam1(e.target.value)}
                  />
                  <button type="submit" className="btn-tag" style={{ background: "#16a34a", marginTop: "5px" }}>Add</button>
                </form>

                <div className="squad-btn-box">
                  <button className="btn-tag" style={{ background: "#1e293b", border: "1px solid #475569", width: "100%" }} onClick={() => setShowSquad1Modal(true)}>
                    {team1} Players ({team1Players.length})
                  </button>
                </div>
              </div>

              <div>
                <form onSubmit={addPlayerToTeam2} style={{ display: "flex", gap: "8px" }}>
                  <input 
                    type="text" 
                    className="custom-input" 
                    placeholder={`ADD PLAYER TO ${team2}`} 
                    value={inputTeam2}
                    onChange={(e) => setInputTeam2(e.target.value)}
                  />
                  <button type="submit" className="btn-tag" style={{ background: "#16a34a", marginTop: "5px" }}>Add</button>
                </form>

                <div className="squad-btn-box">
                  <button className="btn-tag" style={{ background: "#1e293b", border: "1px solid #475569", width: "100%" }} onClick={() => setShowSquad2Modal(true)}>
                    {team2} Players ({team2Players.length})
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="black-box">
            <div className="section-title">Display Controller</div>
            <div className="action-row">
              <button className="btn-tag" style={{ background: "#16a34a" }}>DEFAULT</button>
              <button className="btn-tag" style={{ background: "#0ea5e9" }} onClick={() => setShowTossModal(true)}>TOSS</button>
              <button className="btn-tag" style={{ background: "#0ea5e9" }} onClick={() => setShowSummaryModal(true)}>SUMMARY</button>
              <button className="btn-tag" style={{ background: "#7c3aed" }}>TARGET</button>
              <button className="btn-tag" style={{ background: "#7c3aed" }}>SCORE</button>
              <button className="btn-tag" style={{ background: "#7c3aed" }}>PARTNERSHIP</button>
            </div>
          </div>

        </div>

        {showSquad1Modal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 style={{ margin: "0 0 15px 0", color: "#38bdf8", fontSize: "15px" }}>{team1} Players</h3>
              <div style={{ maxHeight: "220px", overflowY: "auto", marginBottom: "15px", paddingRight: "5px" }}>
                {team1Players.length === 0 ? (
                  <div style={{ fontSize: "12px", color: "#64748b" }}>No players added yet</div>
                ) : (
                  team1Players.map((p, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1e293b" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{p.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "11px", color: p.isPlaying ? "#22c55e" : "#94a3b8" }}>
                          {p.isPlaying ? "Playing" : "Not Playing"}
                        </span>
                        <label className="toggle-switch">
                          <input type="checkbox" checked={p.isPlaying} onChange={() => togglePlaying1(idx)} />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button style={{ width: "100%", padding: "10px", background: "#0ea5e9", border: "none", borderRadius: "6px", color: "#fff", fontWeight: 800, cursor: "pointer" }} onClick={() => setShowSquad1Modal(false)}>
                Done
              </button>
            </div>
          </div>
        )}

        {showSquad2Modal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 style={{ margin: "0 0 15px 0", color: "#38bdf8", fontSize: "15px" }}>{team2} Players</h3>
              <div style={{ maxHeight: "220px", overflowY: "auto", marginBottom: "15px", paddingRight: "5px" }}>
                {team2Players.length === 0 ? (
                  <div style={{ fontSize: "12px", color: "#64748b" }}>No players added yet</div>
                ) : (
                  team2Players.map((p, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1e293b" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{p.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "11px", color: p.isPlaying ? "#22c55e" : "#94a3b8" }}>
                          {p.isPlaying ? "Playing" : "Not Playing"}
                        </span>
                        <label className="toggle-switch">
                          <input type="checkbox" checked={p.isPlaying} onChange={() => togglePlaying2(idx)} />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button style={{ width: "100%", padding: "10px", background: "#0ea5e9", border: "none", borderRadius: "6px", color: "#fff", fontWeight: 800, cursor: "pointer" }} onClick={() => setShowSquad2Modal(false)}>
                Done
              </button>
            </div>
          </div>
        )}

        {showStartModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 style={{ margin: "0 0 15px 0", color: "#38bdf8", fontSize: "16px" }}>▶ Start 1st Innings</h3>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", color: "#94a3b8" }}>STRIKER</label>
                <input type="text" className="custom-input" placeholder="Enter Striker" value={striker} onChange={(e) => setStriker(e.target.value)} />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", color: "#94a3b8" }}>NON-STRIKER</label>
                <input type="text" className="custom-input" placeholder="Enter Non-Striker" value={nonStriker} onChange={(e) => setNonStriker(e.target.value)} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "11px", color: "#94a3b8" }}>BOWLER</label>
                <input type="text" className="custom-input" placeholder="Enter Bowler" value={bowler} onChange={(e) => setBowler(e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{ flex: 1, padding: "10px", background: "#16a34a", border: "none", borderRadius: "6px", color: "#fff", fontWeight: 800, cursor: "pointer" }} onClick={handleStartInnings}>
                  Start 1st Inning
                </button>
                <button style={{ padding: "10px 15px", background: "#334155", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer" }} onClick={() => setShowStartModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showTeamModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 style={{ margin: "0 0 15px 0", color: "#38bdf8", fontSize: "16px" }}>Edit Team Short Names</h3>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", color: "#94a3b8" }}>Team 1 Short Name</label>
                <input type="text" className="custom-input" value={tempTeam1} onChange={(e) => setTempTeam1(e.target.value)} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "11px", color: "#94a3b8" }}>Team 2 Short Name</label>
                <input type="text" className="custom-input" value={tempTeam2} onChange={(e) => setTempTeam2(e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{ flex: 1, padding: "10px", background: "#0ea5e9", border: "none", borderRadius: "6px", color: "#fff", fontWeight: 800, cursor: "pointer" }} onClick={() => { setTeam1(tempTeam1); setTeam2(tempTeam2); setShowTeamModal(false); }}>
                  Save Names
                </button>
                <button style={{ padding: "10px 15px", background: "#334155", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer" }} onClick={() => setShowTeamModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showTossModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 style={{ margin: "0 0 15px 0", color: "#38bdf8", fontSize: "16px" }}>Toss Update</h3>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", color: "#94a3b8" }}>Toss Won By</label>
                <select className="custom-input" value={tossWinner} onChange={(e) => setTossWinner(e.target.value)}>
                  <option value="">Select Team</option>
                  <option value={team1}>{team1}</option>
                  <option value={team2}>{team2}</option>
                </select>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "11px", color: "#94a3b8" }}>Elected To</label>
                <select className="custom-input" value={tossDecision} onChange={(e) => setTossDecision(e.target.value)}>
                  <option value="Batting">Batting</option>
                  <option value="Bowling">Bowling</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{ flex: 1, padding: "10px", background: "#16a34a", border: "none", borderRadius: "6px", color: "#fff", fontWeight: 800, cursor: "pointer" }} onClick={() => setShowTossModal(false)}>
                  Save Toss
                </button>
                <button style={{ padding: "10px 15px", background: "#334155", border: "none", borderRadius: "6px", color: "#fff", cursor: "pointer" }} onClick={() => setShowTossModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showSummaryModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 style={{ margin: "0 0 15px 0", color: "#38bdf8", fontSize: "16px" }}>Match Summary</h3>
              <div style={{ background: "#020617", padding: "12px", borderRadius: "8px", fontSize: "13px", lineHeight: "1.6", marginBottom: "20px" }}>
                <p><b>Teams:</b> {team1} vs {team2}</p>
                <p><b>Current Score:</b> {runs}/{wickets}</p>
                <p><b>Toss:</b> {tossWinner ? `${tossWinner} elected to ${tossDecision}` : "Not updated"}</p>
                <p><b>Striker:</b> {striker || "N/A"}</p>
                <p><b>Non-Striker:</b> {nonStriker || "N/A"}</p>
                <p><b>Bowler:</b> {bowler || "N/A"}</p>
              </div>
              <button style={{ width: "100%", padding: "10px", background: "#0ea5e9", border: "none", borderRadius: "6px", color: "#fff", fontWeight: 800, cursor: "pointer" }} onClick={() => setShowSummaryModal(false)}>
                Close Summary
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}