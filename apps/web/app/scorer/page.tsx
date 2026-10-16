"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Player = {
  id: number;
  name: string;
  team: string;
};

export default function ScorerPage() {
  const params = useParams();
  const matchId = String(params.matchId || "");

  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [bowler, setBowler] = useState("");

  const [runs, setRuns] = useState(0);
  const [balls, setBalls] = useState(0);
  const [wickets, setWickets] = useState(0);

  const [extras, setExtras] = useState({
    wides: 0,
    noBalls: 0,
    byes: 0,
    legByes: 0,
  });

  const [message, setMessage] = useState("");

  // -----------------------------
  // LOAD MATCH
  // -----------------------------
  useEffect(() => {
    if (!matchId) return;

    const loadMatch = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/matches");
        const data = await res.json();

        const found = data.find(
          (item: any) => String(item.id) === String(matchId)
        );

        if (found) {
          setMatch(found);

          setSelectedTeam(found.team1Name || "");
        } else {
          setMessage("Match nahi mila!");
        }
      } catch (error) {
        console.error(error);
        setMessage("Server se match load nahi ho paya.");
      } finally {
        setLoading(false);
      }
    };

    loadMatch();
  }, [matchId]);

  // -----------------------------
  // ADD PLAYER
  // -----------------------------
  const addPlayer = () => {
    if (!playerName.trim()) {
      setMessage("Player ka naam daalo.");
      return;
    }

    if (!selectedTeam) {
      setMessage("Pehle team select karo.");
      return;
    }

    const newPlayer: Player = {
      id: Date.now(),
      name: playerName.trim(),
      team: selectedTeam,
    };

    setPlayers((prev) => [...prev, newPlayer]);
    setPlayerName("");
    setMessage(`${newPlayer.name} add ho gaya.`);
  };

  // -----------------------------
  // ADD BALL
  // -----------------------------
  const addBall = async (
    runValue: number,
    extraType: string | null = null,
    wicket = false
  ) => {
    if (!striker || !nonStriker || !bowler) {
      setMessage("Striker, Non-Striker aur Bowler select karo.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/matches/${matchId}/ball`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            innings: 1,
            batsmanName: striker,
            bowlerName: bowler,
            runs: runValue,
            extraType,
            isWicket: wicket,
            wicketType: wicket ? "bowled" : null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Ball save nahi hui.");
        return;
      }

      // Local scoreboard update
      setRuns((prev) => prev + runValue);

      if (wicket) {
        setWickets((prev) => prev + 1);
      }

      // Wide / No ball ko legal ball nahi maana
      if (extraType === "wide") {
        setExtras((prev) => ({
          ...prev,
          wides: prev.wides + 1,
        }));
      } else if (extraType === "noball") {
        setExtras((prev) => ({
          ...prev,
          noBalls: prev.noBalls + 1,
        }));
      } else if (extraType === "bye") {
        setExtras((prev) => ({
          ...prev,
          byes: prev.byes + runValue,
        }));
      } else if (extraType === "legbye") {
        setExtras((prev) => ({
          ...prev,
          legByes: prev.legByes + runValue,
        }));
      } else {
        setBalls((prev) => prev + 1);
      }

      setMessage(
        wicket
          ? "WICKET! 🔴"
          : extraType
          ? `${extraType.toUpperCase()} add hua.`
          : `${runValue} run add hua.`
      );
    } catch (error) {
      console.error(error);
      setMessage("Ball save karte waqt error aaya.");
    }
  };

  // -----------------------------
  // RESET
  // -----------------------------
  const resetScore = () => {
    setRuns(0);
    setBalls(0);
    setWickets(0);

    setExtras({
      wides: 0,
      noBalls: 0,
      byes: 0,
      legByes: 0,
    });

    setMessage("Score reset ho gaya.");
  };

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) {
    return (
      <main className="loading-page">
        <div className="loading-box">
          <div className="loading-circle"></div>
          <h2>Loading Scoring Panel...</h2>
        </div>

        <style jsx>{`
          .loading-page {
            min-height: 100vh;
            background: #080203;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
          }

          .loading-box {
            text-align: center;
          }

          .loading-circle {
            width: 45px;
            height: 45px;
            border: 4px solid #351217;
            border-top-color: #ff3048;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 20px;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    );
  }

  // -----------------------------
  // NO MATCH
  // -----------------------------
  if (!match) {
    return (
      <main className="error-page">
        <div className="error-box">
          <h1>🏏 Match Not Found</h1>
          <p>{message || "Match available nahi hai."}</p>
        </div>

        <style jsx>{`
          .error-page {
            min-height: 100vh;
            background: #080203;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
          }

          .error-box {
            text-align: center;
            padding: 40px;
            border: 1px solid #38151a;
            border-radius: 20px;
            background: #16080a;
          }

          h1 {
            color: #ff4055;
          }

          p {
            color: #999;
          }
        `}</style>
      </main>
    );
  }

  const oversCompleted = Math.floor(balls / 6);
  const ballsInOver = balls % 6;

  return (
    <main className="scorer-page">
      {/* HEADER */}
      <header className="top-header">
        <div>
          <div className="live-label">
            <span className="live-dot"></span>
            LIVE SCORING
          </div>

          <h1>
            {match.team1Name} <span>vs</span> {match.team2Name}
          </h1>

          <p>
            {match.venue || "Local Ground"} • {match.overs || 20} Overs
          </p>
        </div>

        <div className="live-badge">
          <span></span>
          LIVE
        </div>
      </header>

      {/* SCOREBOARD */}
      <section className="score-card">
        <div className="batting-label">
          {selectedTeam || match.team1Name} BATTING
        </div>

        <div className="score">
          <strong>{runs}</strong>
          <span>/</span>
          <strong>{wickets}</strong>
        </div>

        <div className="over-text">
          Overs {oversCompleted}.{ballsInOver} / {match.overs || 20}
        </div>

        <div className="score-stats">
          <div>
            <span>PARTNERSHIP</span>
            <strong>0 (0)</strong>
          </div>

          <div>
            <span>EXTRAS</span>
            <strong>
              {extras.wides +
                extras.noBalls +
                extras.byes +
                extras.legByes}
            </strong>
          </div>

          <div>
            <span>WIDES</span>
            <strong>{extras.wides}</strong>
          </div>

          <div>
            <span>NO BALLS</span>
            <strong>{extras.noBalls}</strong>
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="main-grid">
        {/* PLAYERS */}
        <div className="panel players-panel">
          <div className="panel-heading">
            <span>👥</span>
            <h2>Players</h2>
          </div>

          <div className="add-player">
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Player name"
            />

            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value={match.team1Name}>{match.team1Name}</option>
              <option value={match.team2Name}>{match.team2Name}</option>
            </select>
          </div>

          <button className="add-player-btn" onClick={addPlayer}>
            + Add Player
          </button>

          <div className="team-list">
            <h3>{match.team1Name}</h3>

            {players
              .filter((p) => p.team === match.team1Name)
              .map((player) => (
                <div className="player-item" key={player.id}>
                  {player.name}
                </div>
              ))}

            {players.filter((p) => p.team === match.team1Name).length ===
              0 && <p className="empty">No players added</p>}

            <h3>{match.team2Name}</h3>

            {players
              .filter((p) => p.team === match.team2Name)
              .map((player) => (
                <div className="player-item" key={player.id}>
                  {player.name}
                </div>
              ))}

            {players.filter((p) => p.team === match.team2Name).length ===
              0 && <p className="empty">No players added</p>}
          </div>
        </div>

        {/* SCORING CONTROLLER */}
        <div className="panel controller-panel">
          <div className="panel-heading">
            <span>🎮</span>
            <h2>Scoring Controller</h2>
          </div>

          <label>STRIKER</label>
          <select
            value={striker}
            onChange={(e) => setStriker(e.target.value)}
          >
            <option value="">Select Striker</option>

            {players
              .filter((p) => p.team === selectedTeam)
              .map((player) => (
                <option key={player.id} value={player.name}>
                  {player.name}
                </option>
              ))}
          </select>

          <label>NON-STRIKER</label>
          <select
            value={nonStriker}
            onChange={(e) => setNonStriker(e.target.value)}
          >
            <option value="">Select Non-Striker</option>

            {players
              .filter((p) => p.team === selectedTeam)
              .map((player) => (
                <option key={player.id} value={player.name}>
                  {player.name}
                </option>
              ))}
          </select>

          <label>BOWLER</label>
          <select
            value={bowler}
            onChange={(e) => setBowler(e.target.value)}
          >
            <option value="">Select Bowler</option>

            {players
              .filter((p) => p.team !== selectedTeam)
              .map((player) => (
                <option key={player.id} value={player.name}>
                  {player.name}
                </option>
              ))}
          </select>

          {/* RUNS */}
          <div className="control-title">RUNS</div>

          <div className="run-grid">
            <button onClick={() => addBall(0)}>0</button>
            <button onClick={() => addBall(1)}>1</button>
            <button onClick={() => addBall(2)}>2</button>
            <button onClick={() => addBall(3)}>3</button>

            <button className="four" onClick={() => addBall(4)}>
              4
            </button>

            <button className="six" onClick={() => addBall(6)}>
              6
            </button>

            <button className="wicket" onClick={() => addBall(0, null, true)}>
              W
            </button>
          </div>

          {/* EXTRAS */}
          <div className="control-title">EXTRAS</div>

          <div className="extra-grid">
            <button onClick={() => addBall(1, "wide")}>WIDE</button>

            <button onClick={() => addBall(1, "noball")}>
              NO BALL
            </button>

            <button onClick={() => addBall(1, "bye")}>BYE</button>

            <button onClick={() => addBall(1, "legbye")}>
              LEG BYE
            </button>
          </div>

          {message && <div className="message">{message}</div>}
        </div>

        {/* LIVE DETAILS */}
        <div className="panel details-panel">
          <div className="panel-heading">
            <span>📋</span>
            <h2>Live Details</h2>
          </div>

          <div className="selected-box">
            <span>STRIKER</span>
            <strong>{striker || "Striker not selected"}</strong>
          </div>

          <div className="selected-box">
            <span>NON-STRIKER</span>
            <strong>{nonStriker || "Non-striker not selected"}</strong>
          </div>

          <div className="detail-row">
            <span>Bowler</span>
            <strong>{bowler || "Not selected"}</strong>
          </div>

          <div className="detail-row">
            <span>Runs</span>
            <strong>{runs}</strong>
          </div>

          <div className="detail-row">
            <span>Balls</span>
            <strong>{balls}</strong>
          </div>

          <div className="detail-row">
            <span>Wickets</span>
            <strong>{wickets}</strong>
          </div>

          <div className="detail-row">
            <span>Byes</span>
            <strong>{extras.byes}</strong>
          </div>

          <div className="detail-row">
            <span>Leg Byes</span>
            <strong>{extras.legByes}</strong>
          </div>

          <div className="detail-row">
            <span>No Balls</span>
            <strong>{extras.noBalls}</strong>
          </div>

          <div className="detail-row">
            <span>Wides</span>
            <strong>{extras.wides}</strong>
          </div>

          <button className="reset-btn" onClick={resetScore}>
            RESET SCORE
          </button>
        </div>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .scorer-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(150, 0, 20, 0.18),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 10%,
              rgba(120, 0, 30, 0.12),
              transparent 30%
            ),
            linear-gradient(135deg, #090304, #120608 50%, #050203);
          color: #fff;
          padding: 35px 5% 80px;
          font-family: Arial, sans-serif;
        }

        .top-header {
          max-width: 1200px;
          margin: 0 auto 28px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .live-label {
          color: #ff4055;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
        }

        .live-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ff3048;
          margin-right: 7px;
          box-shadow: 0 0 12px #ff3048;
        }

        .top-header h1 {
          margin: 0;
          font-size: clamp(30px, 4vw, 50px);
          font-weight: 900;
        }

        .top-header h1 span {
          color: #ff344b;
          margin: 0 8px;
        }

        .top-header p {
          color: #82777a;
          margin-top: 9px;
        }

        .live-badge {
          border: 1px solid rgba(34, 197, 94, 0.4);
          background: rgba(34, 197, 94, 0.08);
          color: #4ade80;
          border-radius: 30px;
          padding: 9px 16px;
          font-size: 12px;
          font-weight: 900;
        }

        .live-badge span {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          margin-right: 7px;
        }

        .score-card {
          max-width: 1200px;
          margin: 0 auto 18px;
          padding: 35px;
          text-align: center;
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(
            145deg,
            rgba(70, 20, 28, 0.72),
            rgba(22, 7, 10, 0.95)
          );
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35);
        }

        .batting-label {
          color: #9d8a8d;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .score {
          margin-top: 5px;
          line-height: 1;
        }

        .score strong {
          font-size: clamp(80px, 10vw, 125px);
          font-weight: 900;
        }

        .score span {
          color: #ff334b;
          font-size: 80px;
          font-weight: 900;
          margin: 0 8px;
        }

        .over-text {
          color: #aaa;
          font-size: 15px;
          font-weight: 700;
          margin-top: 5px;
        }

        .score-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 30px;
        }

        .score-stats div {
          padding: 17px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .score-stats span {
          display: block;
          color: #786c6e;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
          margin-bottom: 7px;
        }

        .score-stats strong {
          font-size: 17px;
        }

        .main-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 0.9fr 1.2fr 0.9fr;
          gap: 16px;
          align-items: start;
        }

        .panel {
          padding: 28px;
          border-radius: 25px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(
            145deg,
            rgba(55, 25, 30, 0.78),
            rgba(18, 6, 9, 0.96)
          );
        }

        .panel-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 25px;
        }

        .panel-heading h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 900;
        }

        .add-player {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        input,
        select {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #100608;
          color: white;
          outline: none;
        }

        select option {
          background: #16080a;
          color: white;
        }

        .add-player-btn {
          width: 100%;
          padding: 14px;
          margin-top: 10px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #ff2538, #ff3e4c);
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .team-list {
          margin-top: 25px;
        }

        .team-list h3 {
          margin: 18px 0 8px;
          font-size: 12px;
          color: #ff6675;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .player-item {
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 14px;
        }

        .empty {
          color: #6d6264;
          font-size: 12px;
        }

        .controller-panel label {
          display: block;
          margin: 15px 0 7px;
          color: #817477;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .control-title {
          margin: 23px 0 9px;
          color: #817477;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .run-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .run-grid button {
          padding: 18px 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.045);
          color: white;
          font-size: 20px;
          font-weight: 900;
          cursor: pointer;
        }

        .run-grid button:hover,
        .extra-grid button:hover {
          transform: translateY(-2px);
          filter: brightness(1.15);
        }

        .run-grid .four {
          background: #292344;
          border-color: #4c427d;
        }

        .run-grid .six {
          background: #3b1948;
          border-color: #6c2e83;
        }

        .run-grid .wicket {
          background: #8d1422;
          border-color: #d5283a;
        }

        .extra-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .extra-grid button {
          padding: 13px 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.045);
          color: white;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .selected-box {
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
        }

        .selected-box span {
          display: block;
          color: #74686a;
          font-size: 9px;
          font-weight: 900;
          margin-bottom: 6px;
        }

        .selected-box strong {
          font-size: 14px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 13px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          font-size: 13px;
        }

        .detail-row span {
          color: #827578;
        }

        .reset-btn {
          width: 100%;
          margin-top: 20px;
          padding: 15px;
          border: none;
          border-radius: 12px;
          background: #b51828;
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .message {
          margin-top: 15px;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.07);
          text-align: center;
          font-size: 12px;
          color: #ddd;
        }

        @media (max-width: 1000px) {
          .main-grid {
            grid-template-columns: 1fr 1fr;
          }

          .controller-panel {
            grid-column: span 2;
            grid-row: 1;
          }
        }

        @media (max-width: 700px) {
          .scorer-page {
            padding: 20px 14px 50px;
          }

          .top-header {
            flex-direction: column;
            gap: 15px;
          }

          .score-card {
            padding: 25px 15px;
          }

          .score-stats {
            grid-template-columns: 1fr 1fr;
          }

          .main-grid {
            grid-template-columns: 1fr;
          }

          .controller-panel {
            grid-column: auto;
          }

          .add-player {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}