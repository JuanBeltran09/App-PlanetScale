const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const missions = await pool.query("SELECT status, COUNT(*) FROM missions GROUP BY status");
    const astronauts = await pool.query("SELECT COUNT(*) FROM astronauts");
    const planets = await pool.query("SELECT COUNT(*) FROM planets");
    const ships = await pool.query("SELECT COUNT(*) FROM ships");
    const experiments = await pool.query("SELECT COUNT(*) FROM experiments");

    // Process Mission statuses for the frontend
    const missionStats = missions.rows.reduce(
      (acc, curr) => {
        acc[curr.status] = parseInt(curr.count, 10);
        acc.total += parseInt(curr.count, 10);
        return acc;
      },
      { total: 0 }
    );

    res.json({
      missions: missionStats,
      astronauts: parseInt(astronauts.rows[0].count, 10),
      planets: parseInt(planets.rows[0].count, 10),
      ships: parseInt(ships.rows[0].count, 10),
      experiments: parseInt(experiments.rows[0].count, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;