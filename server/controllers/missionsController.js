const pool = require("../db");

exports.getAllMissions = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM missions ORDER BY mission_id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const mission = await pool.query("SELECT * FROM missions WHERE mission_id=$1", [id]);
    res.json(mission.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMission = async (req, res) => {
  const { name, planet_id, ship_id, launch_date, return_date, objective, status, budget_usd } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO missions (name, planet_id, ship_id, launch_date, return_date, objective, status, budget_usd)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, planet_id, ship_id, launch_date, return_date, objective, status, budget_usd]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMission = async (req, res) => {
  const { id } = req.params;
  const { name, planet_id, ship_id, launch_date, return_date, objective, status, budget_usd } = req.body;
  try {
    const result = await pool.query(
      `UPDATE missions
       SET name=$1, planet_id=$2, ship_id=$3, launch_date=$4, return_date=$5, objective=$6, status=$7, budget_usd=$8
       WHERE mission_id=$9
       RETURNING *`,
      [name, planet_id, ship_id, launch_date, return_date, objective, status, budget_usd, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMission = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM missions WHERE mission_id=$1", [id]);
    res.json({ message: "Mission deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
