import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import Apply from "./pages/Apply";
import Profile from "./pages/Profile";

function App() {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/" ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password");

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100">

        {!hideLayout && <Header />}

        <main className="flex-1 pt-24 pb-20 px-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/apply"
              element={
                <ProtectedRoute>
                  <Apply />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {!hideLayout && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
