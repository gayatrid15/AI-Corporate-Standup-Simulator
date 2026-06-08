import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Simulation from "./pages/Simulation";
import ReportPage from "./pages/ReportPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/simulation" element={<Simulation />} />
        <Route path="/report/:sessionId" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
