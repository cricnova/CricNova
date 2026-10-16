const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('CricNova API is running! 🏏');
});

// ===== TOURNAMENTS =====

app.post('/api/tournaments', async (req, res) => {
  try {
    const { name, location, logoUrl } = req.body;
    const tournament = await prisma.tournament.create({
      data: { name, location, logoUrl },
    });
    res.json(tournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Tournament create nahi hua' });
  }
});

app.get('/api/tournaments', async (req, res) => {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Tournaments fetch nahi hue' });
  }
});

app.get('/api/tournaments/:id', async (req, res) => {
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: req.params.id },
      include: { matches: true },
    });
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament nahi mila' });
    }
    res.json(tournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Tournament fetch nahi hua' });
  }
});

app.put('/api/tournaments/:id', async (req, res) => {
  try {
    const { name, location, logoUrl } = req.body;
    const tournament = await prisma.tournament.update({
      where: { id: req.params.id },
      data: { name, location, logoUrl },
    });
    res.json(tournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Tournament update nahi hua' });
  }
});

app.delete('/api/tournaments/:id', async (req, res) => {
  try {
    await prisma.match.deleteMany({ where: { tournamentId: req.params.id } });
    await prisma.tournament.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Tournament delete nahi hua' });
  }
});

// ===== MATCHES =====

app.post('/api/matches', async (req, res) => {
  try {
    const {
      team1Name, team2Name, overs, ballsPerOver, venue,
      ballType, matchType, tossWonBy, tossDecision, tournamentId,
      matchDateTime,
    } = req.body;

    const match = await prisma.match.create({
      data: {
        team1Name, team2Name, overs,
        ballsPerOver: ballsPerOver || 6,
        venue,
        ballType: ballType || 'leather',
        matchType: matchType || 'league',
        tossWonBy, tossDecision,
        tournamentId: tournamentId || null,
        matchDateTime: matchDateTime ? new Date(matchDateTime) : null,
      },
    });

    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Match create nahi hua' });
  }
});

app.put('/api/matches/:id/players', async (req, res) => {
  try {
    const { team1Players, team2Players } = req.body;
    const match = await prisma.match.update({
      where: { id: req.params.id },
      data: {
        team1Players: team1Players || '',
        team2Players: team2Players || '',
      },
    });
    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Players save nahi hue' });
  }
});

app.delete('/api/matches/:id', async (req, res) => {
  try {
    await prisma.ball.deleteMany({ where: { matchId: req.params.id } });
    await prisma.match.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Match delete nahi hua' });
  }
});

app.get('/api/matches', async (req, res) => {
  try {
    const matches = await prisma.match.findMany();
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Matches fetch nahi hue' });
  }
});

app.get('/api/matches/:id', async (req, res) => {
  try {
    const match = await prisma.match.findUnique({
      where: { id: req.params.id },
      include: { balls: true },
    });

    if (!match) {
      return res.status(404).json({ error: 'Match nahi mila' });
    }

    const innings1Balls = match.balls.filter((b) => b.innings === 1);
    const totalRuns = innings1Balls.reduce((sum, b) => sum + b.runs, 0);
    const totalWickets = innings1Balls.filter((b) => b.isWicket).length;

    res.json({
      ...match,
      innings1Score: { runs: totalRuns, wickets: totalWickets },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Match fetch nahi hua' });
  }
});

app.post('/api/matches/:id/ball', async (req, res) => {
  try {
    const matchId = req.params.id;
    const { innings, batsmanName, bowlerName, runs, extraType, isWicket, wicketType } = req.body;

    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) {
      return res.status(404).json({ error: 'Match nahi mila' });
    }

    let newOver = match.currentOver;
    let newBall = match.currentBall;
    const isLegalBall = extraType !== 'wide' && extraType !== 'noball';

    if (isLegalBall) {
      newBall += 1;
      if (newBall === match.ballsPerOver) {
        newBall = 0;
        newOver += 1;
      }
    }

    const ball = await prisma.ball.create({
      data: {
        matchId,
        innings: innings || 1,
        overNumber: newOver,
        ballNumber: newBall,
        batsmanName, bowlerName,
        runs: runs || 0,
        extraType: extraType || null,
        isWicket: isWicket || false,
        wicketType: wicketType || null,
      },
    });

    await prisma.match.update({
      where: { id: matchId },
      data: { currentOver: newOver, currentBall: newBall, status: 'live' },
    });

    res.json(ball);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ball add nahi hui' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});