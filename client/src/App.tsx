import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import LoginPage from "./components/(auth)/LoginPage";
import RegisterPage from "./components/(auth)/RegisterPage";
import LandingPage from "./components/LandingPage";
import { useAuth } from "../context/auth-context";
import Navbar from "./components/Navbar";
import Preferences from "./components/Preferences";
import UserJobHistory from "./components/UserJobHistory";
import Footer from "./components/Footer";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <div className="text-green-50 font-mono">
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-center" />
          <Navbar />
          <AppRoutes />
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen">Loading…</div>;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/preferences"
        element={user ? <Preferences /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/history"
        element={user ? <UserJobHistory /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/user-profile"
        element={user ? <UserProfile /> : <Navigate to="/login" replace />}
      />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
