import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";
import LoginPage from "./components/(auth)/LoginPage";
import RegisterPage from "./components/(auth)/RegisterPage";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <div className="text-green-50">
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
