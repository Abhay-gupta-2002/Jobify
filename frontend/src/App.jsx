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
      <div className="min-h-screen flex flex-col">
        {!hideLayout && <Header />}

        {/* MAIN CONTENT */}
        <main className="flex-1 pt-20 pb-16 px-6 bg-white">
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<AuthPage />} />
             <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* PROTECTED */}
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
