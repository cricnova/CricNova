"use client";

import Navbar from "../components/Navbar";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CreateMatchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tournamentId = searchParams.get("tournamentId");

  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [overs, setOvers] = useState("20");
  const [ballsPerOver, setBallsPerOver] = useState("6");
  const [venue, setVenue] = useState("");
  const [ballType, setBallType] = useState("leather");
  const [matchType, setMatchType] = useState("league");
  const [tossWonBy, setTossWonBy] = useState("");
  const [tossDecision, setTossDecision] = useState("bat");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!team1Name || !team2Name || !overs) {
      setMessage("Please fill team names and overs!");
      return;
    }

    setLoading(true);
    setMessage("");

    let matchDateTime = null;
    if (matchDate) {
      matchDateTime = matchTime
        ? `${matchDate}T${matchTime}:00`
        : `${matchDate}T00:00:00`;
    }

    try {
      const res = await fetch("http://localhost:5000/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team1Name,
          team2Name,
          overs: parseInt(overs),
          ballsPerOver: parseInt(ballsPerOver),
          venue,
          ballType,
          matchType,
          tossWonBy,
          tossDecision,
          matchDateTime,
          tournamentId: tournamentId || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/scorer/${data.id}`);
      } else {
        setMessage("Error: " + (data.error || "Match could not be created"));
        setLoading(false);
      }
    } catch (err) {
      setMessage("Error: Could not connect to server");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .create-page {
          min-height: 100vh;
          color: #ffffff;
          background:
            radial-gradient(circle at 10% 15%, rgba(150, 0, 20, 0.28), transparent 32%),
            radial-gradient(circle at 90% 10%, rgba(100, 0, 20, 0.18), transparent 30%),
            linear-gradient(135deg, #090304 0%, #120608 45%, #050203 100%);
        }

        .create-container {
          width: min(1400px, 100%);
          margin: 0 auto;
          padding: 55px 7% 90px;
        }

        .create-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 14px;
          color: #ff4655;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .create-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff3045;
          box-shadow: 0 0 14px rgba(255, 48, 69, 0.9);
        }

        .create-title {
          margin: 0 0 12px;
          font-size: clamp(44px, 5vw, 72px);
          line-height: 0.95;
          letter-spacing: -4px;
          font-weight: 900;
        }

        .create-title span {
          background: linear-gradient(90deg, #ff4655, #ff7925);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .create-description {
          max-width: 620px;
          margin: 16px 0 40px;
          color: #918585;
          font-size: 15px;
          line-height: 1.7;
        }

        .form-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .form-card,
        .side-card {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(
              145deg,
              rgba(65, 32, 37, 0.72),
              rgba(20, 8, 10, 0.94)
            );
          box-shadow:
            0 30px 70px rgba(0, 0, 0, 0.45),
            inset 0 1px rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(16px);
          padding: 32px;
          border-radius: 30px;
        }

        .card-title {
          margin: 0 0 24px;
          font-size: 20px;
          font-weight: 900;
        }

        .section {
          margin-bottom: 22px;
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 22px;
        }

        .label {
          display: block;
          margin-bottom: 9px;
          font-size: 11px;
          color: #918585;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(10, 3, 5, 0.7);
          color: #fff;
          font-size: 15px;
        }

        .input::placeholder {
          color: #6b6262;
        }

        .button-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .toggle-btn {
          padding: 15px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.045);
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.09);
        }

        .toggle-btn.active {
          border: none;
          background: linear-gradient(135deg, #ff2538, #ff3e4c);
          box-shadow: 0 8px 25px rgba(255, 30, 50, 0.2);
        }

        .submit-btn {
          width: 100%;
          padding: 18px;
          border-radius: 15px;
          border: none;
          background: linear-gradient(135deg, #ff2538, #ff3e4c);
          box-shadow: 0 8px 25px rgba(255, 30, 50, 0.25);
          color: #fff;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
          margin-top: 10px;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-message {
          margin-top: 20px;
          padding: 15px;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
          font-size: 14px;
        }

        .preview-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .preview-row:last-child {
          border-bottom: none;
        }

        .preview-row span {
          color: #777;
          font-size: 12px;
        }

        .preview-row strong {
          font-size: 13px;
          font-weight: 800;
        }

        .preview-vs {
          text-align: center;
          padding: 24px 0;
          margin-bottom: 10px;
        }

        .preview-team-name {
          font-size: 26px;
          font-weight: 900;
        }

        .preview-vs-label {
          color: #777;
          font-size: 12px;
          font-weight: 800;
          margin: 8px 0;
        }

        @media (max-width: 1000px) {
          .form-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .create-container {
            padding: 40px 20px 70px;
          }

          .row,
          .button-row {
            grid-template-columns: 1fr;
          }

          .form-card,
          .side-card {
            padding: 22px;
            border-radius: 24px;
          }
        }
      `}</style>

      <main className="create-page">
        <Navbar />

        <div className="create-container">
          <div className="create-eyebrow">
            <span className="create-dot" />
            SET UP YOUR MATCH
          </div>

          <h1 className="create-title">
            Create <span>New Match.</span>
          </h1>

          <p className="create-description">
            Team names, overs, toss, date/time aur venue daalo — match ban
            jayega aur turant live scoring shuru kar sakte ho.
          </p>

          <div className="form-layout">
            <div className="form-card">
              <h3 className="card-title">Match Details</h3>

              <div className="section">
                <label className="label">Team 1 Name</label>
                <input
                  className="input"
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  placeholder="e.g. CSK"
                />
              </div>

              <div className="section">
                <label className="label">Team 2 Name</label>
                <input
                  className="input"
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  placeholder="e.g. RCB"
                />
              </div>

              <div className="row">
                <div>
                  <label className="label">Match Date</label>
                  <input
                    className="input"
                    type="date"
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Match Time</label>
                  <input
                    className="input"
                    type="time"
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="row">
                <div>
                  <label className="label">Overs</label>
                  <input
                    className="input"
                    type="number"
                    value={overs}
                    onChange={(e) => setOvers(e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">Balls Per Over</label>
                  <select
                    className="input"
                    value={ballsPerOver}
                    onChange={(e) => setBallsPerOver(e.target.value)}
                  >
                    <option value="6">6</option>
                    <option value="8">8</option>
                  </select>
                </div>
              </div>

              <div className="section">
                <label className="label">Venue</label>
                <input
                  className="input"
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Local Ground"
                />
              </div>

              <div className="section">
                <label className="label">Ball Type</label>
                <div className="button-row">
                  <button
                    className={`toggle-btn ${ballType === "leather" ? "active" : ""}`}
                    onClick={() => setBallType("leather")}
                  >
                    Leather
                  </button>
                  <button
                    className={`toggle-btn ${ballType === "tennis" ? "active" : ""}`}
                    onClick={() => setBallType("tennis")}
                  >
                    Tennis
                  </button>
                </div>
              </div>

              <div className="section" style={{ marginBottom: 0 }}>
                <label className="label">Match Type</label>
                <select
                  className="input"
                  value={matchType}
                  onChange={(e) => setMatchType(e.target.value)}
                >
                  <option value="league">League / Group Stage</option>
                  <option value="quarterfinal">Quarter Final</option>
                  <option value="semifinal">Semi Final</option>
                  <option value="final">Final</option>
                </select>
              </div>
            </div>

            <div>
              <div className="side-card" style={{ marginBottom: 24 }}>
                <h3 className="card-title">Toss</h3>

                <div className="preview-vs">
                  <div className="preview-team-name">
                    {team1Name || "Team 1"}
                  </div>
                  <div className="preview-vs-label">VS</div>
                  <div className="preview-team-name">
                    {team2Name || "Team 2"}
                  </div>
                </div>

                <div className="section">
                  <label className="label">Who Won The Toss?</label>
                  <div className="button-row">
                    <button
                      className={`toggle-btn ${tossWonBy === team1Name && team1Name ? "active" : ""}`}
                      onClick={() => setTossWonBy(team1Name)}
                    >
                      {team1Name || "Team 1"}
                    </button>
                    <button
                      className={`toggle-btn ${tossWonBy === team2Name && team2Name ? "active" : ""}`}
                      onClick={() => setTossWonBy(team2Name)}
                    >
                      {team2Name || "Team 2"}
                    </button>
                  </div>
                </div>

                <div className="section" style={{ marginBottom: 0 }}>
                  <label className="label">Opted To?</label>
                  <div className="button-row">
                    <button
                      className={`toggle-btn ${tossDecision === "bat" ? "active" : ""}`}
                      onClick={() => setTossDecision("bat")}
                    >
                      Bat
                    </button>
                    <button
                      className={`toggle-btn ${tossDecision === "bowl" ? "active" : ""}`}
                      onClick={() => setTossDecision("bowl")}
                    >
                      Bowl
                    </button>
                  </div>
                </div>
              </div>

              <div className="side-card">
                <h3 className="card-title">Summary</h3>

                <div className="preview-row">
                  <span>Match</span>
                  <strong>
                    {team1Name || "Team 1"} vs {team2Name || "Team 2"}
                  </strong>
                </div>
                <div className="preview-row">
                  <span>Date</span>
                  <strong>{matchDate || "TBD"}</strong>
                </div>
                <div className="preview-row">
                  <span>Time</span>
                  <strong>{matchTime || "TBD"}</strong>
                </div>
                <div className="preview-row">
                  <span>Format</span>
                  <strong>{overs} Overs</strong>
                </div>
                <div className="preview-row">
                  <span>Ball</span>
                  <strong style={{ textTransform: "capitalize" }}>
                    {ballType}
                  </strong>
                </div>
                <div className="preview-row">
                  <span>Venue</span>
                  <strong>{venue || "TBD"}</strong>
                </div>

                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Match"}
                </button>

                {message && <div className="form-message">{message}</div>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function CreateMatchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateMatchForm />
    </Suspense>
  );
}