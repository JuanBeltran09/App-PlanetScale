const express = require("express");
const router = express.Router();
const missions = require("../controllers/missionsController");

router.get("/", missions.getAllMissions);
router.get("/:id", missions.getMissionById);
router.post("/", missions.createMission);
router.put("/:id", missions.updateMission);
router.delete("/:id", missions.deleteMission);

module.exports = router;
