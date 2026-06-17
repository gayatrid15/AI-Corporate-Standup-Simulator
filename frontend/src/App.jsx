import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Simulation from "./pages/Simulation";
import ReportPage from "./pages/ReportPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./services/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/report/:sessionId" element={<ReportPage />} />
        <Route path="/interview/:sessionId" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
