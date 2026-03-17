const express = require("express");
const cors = require("cors");

const planetRoutes = require("./routes/planets");
const shipRoutes = require("./routes/ships");
const missionRoutes = require("./routes/missions");
const astronautRoutes = require("./routes/astronauts");
const experimentRoutes = require("./routes/experiments");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/planets", planetRoutes);
app.use("/api/ships", shipRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/astronauts", astronautRoutes);
app.use("/api/experiments", experimentRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});