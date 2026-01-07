import { useState } from "react";
import Signin from "../components/auth/Signin";
import Signup from "../components/auth/Signup";
import heroImage from "../assets/pic.jpg";

function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100">
        <img
          src={heroImage}
          alt="Job apply"
          className="max-w-[85%] max-h-[85%] object-contain"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">
          {isSignup ? (
            <Signup switchToSignin={() => setIsSignup(false)} />
          ) : (
            <Signin switchToSignup={() => setIsSignup(true)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
