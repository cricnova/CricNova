"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function OverlayPage() {
  const params = useParams();
  const matchId = params?.id || "match-1";

  const [matchData, setMatchData] = useState({
    team1: "CSK",
    team2: "RCB",
    score: 0,
    wickets: 0,
    overs: "0.0",
    striker: "Batter 1",
    strikerRuns: 0,
    strikerBalls: 0,
    bowler: "Bowler 1",
    bowlerFigures: "0/0"
  });

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/matches/${matchId}`);
        if (res.ok) {
          const data = await res.json();
          setMatchData(data);
        }
      } catch (err) {
        console.error("Error fetching live score:", err);
      }
    };

    fetchScore();
    const interval = setInterval(fetchScore, 3000); // Polling every 3 seconds for real-time sync
    return () => clearInterval(interval);
  }, [matchId]);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: transparent !important; font-family: sans-serif; }
        .overlay-wrapper { width: 100vw; height: 100vh; display: flex; align-items: flex-end; padding: 30px; }
        .broadcast-card {
          width: 550px;
          background: linear-gradient(135deg, rgba(10, 15, 30, 0.95), rgba(25, 10, 15, 0.95));
          border: 2px solid rgba(255, 60, 80, 0.6);
          border-radius: 14px;
          color: #ffffff;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8);
          overflow: hidden;
        }
        .broadcast-header {
          display: flex; justifyContent: space-between;
          background: linear-gradient(90deg, #ff2538, #ff6b35);
          padding: 6px 14px; font-size: 12px; font-weight: 900;
        }
        .broadcast-body { padding: 16px; }
        .teams-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .score-text { font-size: 28px; font-weight: 900; color: #fff; }
        .score-text span { font-size: 18px; color: #ff8888; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; font-size: 13px; }
      `}</style>

      <div className="overlay-wrapper">
        <div className="broadcast-card">
          <div className="broadcast-header">
            <span>● LIVE BROADCAST OVERLAY</span>
            <span>ID: {matchId}</span>
          </div>
          <div className="broadcast-body">
            <div className="teams-row">
              <div>
                <div style={{ fontSize: "18px", fontWeight: 900 }}>{matchData.team1} vs {matchData.team2}</div>
                <div style={{ fontSize: "12px", color: "#aaa" }}>Overs: {matchData.overs}</div>
              </div>
              <div className="score-text">
                {matchData.score}<span>/{matchData.wickets}</span>
              </div>
            </div>
            <div className="stats-grid">
              <div>
                <span style={{ color: "#aaa", fontSize: "11px" }}>BATTER</span>
                <div style={{ fontWeight: 800 }}>{matchData.striker} *{matchData.strikerRuns} ({matchData.strikerBalls})</div>
              </div>
              <div>
                <span style={{ color: "#aaa", fontSize: "11px" }}>BOWLER</span>
                <div style={{ fontWeight: 800 }}>{matchData.bowler} {matchData.bowlerFigures}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}