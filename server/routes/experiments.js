const express = require("express");
const router = express.Router();
const experiments = require("../controllers/experimentsController");

router.get("/", experiments.getAllExperiments);
router.get("/:id", experiments.getExperimentById);
router.post("/", experiments.createExperiment);
router.put("/:id", experiments.updateExperiment);
router.delete("/:id", experiments.deleteExperiment);

module.exports = router;
