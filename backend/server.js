const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let matchList = [];
let tournaments = [];
let matches = {
  "match-1": {
    id: "match-1",
    team1: "CSK",
    team2: "RCB",
    score: 0,
    wickets: 0,
    overs: "0.0",
    striker: "Batter 1",
    nonStriker: "Batter 2",
    bowler: "Bowler 1",
    tournamentId: null
  }
};

// Get All Matches or Tournament Matches
app.get('/api/matches', (req, res) => {
  const { tournamentId } = req.query;
  if (tournamentId) {
    const filtered = Object.values(matches).filter(m => m.tournamentId === tournamentId);
    return res.json(filtered);
  }
  res.json(Object.values(matches));
});

// Get Match Live Data
app.get('/api/matches/:id', (req, res) => {
  const match = matches[req.params.id];
  if (match) {
    res.json(match);
  } else {
    res.status(404).json({ error: "Match not found" });
  }
});

// Create Match API
app.post('/api/matches', (req, res) => {
  const matchId = "match-" + (Object.keys(matches).length + 1);
  const newMatch = {
    id: matchId,
    score: 0,
    wickets: 0,
    overs: "0.0",
    striker: "Batter 1",
    nonStriker: "Batter 2",
    bowler: "Bowler 1",
    ...req.body
  };
  matches[matchId] = newMatch;
  matchList.push(newMatch);
  res.json(newMatch);
});

// Create Tournament API
app.post('/api/tournaments', (req, res) => {
  const { name, location, logoUrl } = req.body;
  const newTournament = {
    id: "tourney-" + (tournaments.length + 1),
    name,
    location,
    logoUrl
  };
  tournaments.push(newTournament);
  res.json({ success: true, ...newTournament });
});

// Get Tournaments API
app.get('/api/tournaments', (req, res) => {
  res.json(tournaments);
});

// Update Match Live Score (From Scorer Panel) & Sync to Live/Tournaments
app.post('/api/matches/:id/update', (req, res) => {
  const matchId = req.params.id;
  if (!matches[matchId]) {
    matches[matchId] = { id: matchId, score: 0, wickets: 0, overs: "0.0" };
  }
  matches[matchId] = { ...matches[matchId], ...req.body };
  res.json({ success: true, match: matches[matchId] });
});

app.listen(5000, () => {
  console.log("CricNova Backend running on port 5000");
});