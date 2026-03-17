const express = require("express");
const router = express.Router();
const ships = require("../controllers/shipsController");

router.get("/", ships.getAllShips);
router.get("/:id", ships.getShipById);
router.post("/", ships.createShip);
router.put("/:id", ships.updateShip);
router.delete("/:id", ships.deleteShip);

module.exports = router;
