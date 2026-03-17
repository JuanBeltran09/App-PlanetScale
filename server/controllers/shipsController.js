const pool = require("../db");

exports.getAllShips = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ships ORDER BY ship_id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getShipById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM ships WHERE ship_id=$1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createShip = async (req, res) => {
  const { name, model, crew_capacity, max_speed_km_s, manufacture_year, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO ships (name, model, crew_capacity, max_speed_km_s, manufacture_year, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, model, crew_capacity, max_speed_km_s, manufacture_year, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateShip = async (req, res) => {
  const { id } = req.params;
  const { name, model, crew_capacity, max_speed_km_s, manufacture_year, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE ships
       SET name=$1, model=$2, crew_capacity=$3, max_speed_km_s=$4, manufacture_year=$5, status=$6
       WHERE ship_id=$7
       RETURNING *`,
      [name, model, crew_capacity, max_speed_km_s, manufacture_year, status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteShip = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM ships WHERE ship_id=$1", [id]);
    res.json({ message: "Ship deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
