const pool = require("../db");

exports.getAllExperiments = async (req, res) => {
  try {
    const dbResult = await pool.query("SELECT * FROM experiments ORDER BY experiment_id");
    res.json(dbResult.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExperimentById = async (req, res) => {
  const { id } = req.params;
  try {
    const experiment = await pool.query("SELECT * FROM experiments WHERE experiment_id=$1", [id]);
    res.json(experiment.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createExperiment = async (req, res) => {
  const { mission_id, name, type, start_date, end_date, result, successful } = req.body;
  try {
    const dbResult = await pool.query(
      `INSERT INTO experiments (mission_id, name, type, start_date, end_date, result, successful)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [mission_id, name, type, start_date, end_date, result, successful]
    );
    res.json(dbResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExperiment = async (req, res) => {
  const { id } = req.params;
  const { mission_id, name, type, start_date, end_date, result, successful } = req.body;
  try {
    const dbResult = await pool.query(
      `UPDATE experiments
       SET mission_id=$1, name=$2, type=$3, start_date=$4, end_date=$5, result=$6, successful=$7
       WHERE experiment_id=$8
       RETURNING *`,
      [mission_id, name, type, start_date, end_date, result, successful, id]
    );
    res.json(dbResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteExperiment = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM experiments WHERE experiment_id=$1", [id]);
    res.json({ message: "Experiment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
