import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Planets from "./pages/Planets";
import Missions from "./pages/Missions";
import Astronauts from "./pages/Astronauts";
import Ships from "./pages/Ships";
import Experiments from "./pages/Experiments";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />
        <Route path="/planets" element={<Planets />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/astronauts" element={<Astronauts />} />
        <Route path="/ships" element={<Ships />} />
        <Route path="/experiments" element={<Experiments />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;