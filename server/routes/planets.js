const express = require("express");
const router = express.Router();
const planets = require("../controllers/planetsController");

router.get("/", planets.getAllPlanets);
router.get("/:id", planets.getPlanetById);
router.post("/", planets.createPlanet);
router.put("/:id", planets.updatePlanet);
router.delete("/:id", planets.deletePlanet);

module.exports = router;