import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// Reflections
import ReflectionsList from "./reflections/ReflectionsList";
import ReflectionDetail from "./reflections/ReflectionDetail";
import ReflectionForm from "./reflections/ReflectionForm";

// Mood Logs
import MoodLogsList from "./mood/MoodLogsList";
import MoodLogDetail from "./mood/MoodLogDetail";
import MoodLogForm from "./mood/MoodLogForm";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Reflections */}
          <Route
            path="/reflections"
            element={
              <ProtectedRoute>
                <ReflectionsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reflections/new"
            element={
              <ProtectedRoute>
                <ReflectionForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reflections/:id"
            element={
              <ProtectedRoute>
                <ReflectionDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reflections/:id/edit"
            element={
              <ProtectedRoute>
                <ReflectionForm />
              </ProtectedRoute>
            }
          />

          {/* Mood Logs */}
          <Route
            path="/mood_logs"
            element={
              <ProtectedRoute>
                <MoodLogsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mood_logs/new"
            element={
              <ProtectedRoute>
                <MoodLogForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mood_logs/:id"
            element={
              <ProtectedRoute>
                <MoodLogDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mood_logs/:id/edit"
            element={
              <ProtectedRoute>
                <MoodLogForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
