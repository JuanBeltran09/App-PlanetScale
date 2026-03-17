const pool = require("../db");

exports.getAllPlanets = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM planets ORDER BY planet_id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlanetById = async (req, res) => {
  const { id } = req.params;

  try {
    const planet = await pool.query(
      "SELECT * FROM planets WHERE planet_id=$1",
      [id]
    );

    const missions = await pool.query(
      "SELECT * FROM missions WHERE planet_id=$1",
      [id]
    );

    res.json({
      planet: planet.rows[0],
      missions: missions.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPlanet = async (req, res) => {
  const { name, type, distance_au, diameter_km, has_atmosphere, description } =
    req.body;

  try {
    const result = await pool.query(
      `INSERT INTO planets (name,type,distance_au,diameter_km,has_atmosphere,description)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [name, type, distance_au, diameter_km, has_atmosphere, description]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePlanet = async (req, res) => {
  const { id } = req.params;
  const { name, type, distance_au, diameter_km, has_atmosphere, description } =
    req.body;

  try {
    const result = await pool.query(
      `UPDATE planets
       SET name=$1,type=$2,distance_au=$3,diameter_km=$4,
       has_atmosphere=$5,description=$6
       WHERE planet_id=$7
       RETURNING *`,
      [name, type, distance_au, diameter_km, has_atmosphere, description, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePlanet = async (req, res) => {
  const { id } = req.params;

  try {
    const check = await pool.query(
      "SELECT * FROM missions WHERE planet_id=$1",
      [id]
    );

    if (check.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Planet has missions assigned" });
    }

    await pool.query("DELETE FROM planets WHERE planet_id=$1", [id]);

    res.json({ message: "Planet deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};