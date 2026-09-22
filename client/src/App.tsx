import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import LoginPage from "./components/(auth)/LoginPage";
import RegisterPage from "./components/(auth)/RegisterPage";
import LandingPage from "./components/LandingPage";
import Profile from "./components/Profile";
import { useAuth } from "../context/auth-context";

function App() {
  return (
    <div className="text-green-50">
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading…</div>;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/login" replace />}
      />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
