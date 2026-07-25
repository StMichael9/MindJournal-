import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// Import reflections from src/reflections
import ReflectionsList from "./reflections/ReflectionsList";
import ReflectionDetail from "./reflections/ReflectionDetail";
import ReflectionForm from "./reflections/ReflectionForm";

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
