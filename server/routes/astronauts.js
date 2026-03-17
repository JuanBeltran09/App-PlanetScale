const express = require("express");
const router = express.Router();
const astronauts = require("../controllers/astronautsController");

router.get("/", astronauts.getAllAstronauts);
router.get("/:id", astronauts.getAstronautById);
router.post("/", astronauts.createAstronaut);
router.put("/:id", astronauts.updateAstronaut);
router.delete("/:id", astronauts.deleteAstronaut);

module.exports = router;
