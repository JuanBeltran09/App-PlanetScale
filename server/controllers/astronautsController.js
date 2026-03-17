const pool = require("../db");

exports.getAllAstronauts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM astronauts ORDER BY astronaut_id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAstronautById = async (req, res) => {
  const { id } = req.params;
  try {
    const astronaut = await pool.query("SELECT * FROM astronauts WHERE astronaut_id=$1", [id]);
    res.json(astronaut.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAstronaut = async (req, res) => {
  const { first_name, last_name, specialty, nationality, email, hire_date, space_hours } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO astronauts (first_name, last_name, specialty, nationality, email, hire_date, space_hours)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [first_name, last_name, specialty, nationality, email, hire_date, space_hours]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAstronaut = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, specialty, nationality, email, hire_date, space_hours } = req.body;
  try {
    const result = await pool.query(
      `UPDATE astronauts
       SET first_name=$1, last_name=$2, specialty=$3, nationality=$4, email=$5, hire_date=$6, space_hours=$7
       WHERE astronaut_id=$8
       RETURNING *`,
      [first_name, last_name, specialty, nationality, email, hire_date, space_hours, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAstronaut = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM astronauts WHERE astronaut_id=$1", [id]);
    res.json({ message: "Astronaut deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
