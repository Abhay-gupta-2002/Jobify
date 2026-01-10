import { useState } from "react";
import Signin from "../components/auth/Signin";
import Signup from "../components/auth/Signup";
import heroImage from "../assets/pic.jpg";

function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-950 to-black">
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src={heroImage}
          alt="Job apply"
          className="max-w-[80%] opacity-90"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        {isSignup ? (
          <Signup switchToSignin={() => setIsSignup(false)} />
        ) : (
          <Signin switchToSignup={() => setIsSignup(true)} />
        )}
      </div>
    </div>
  );
}

export default AuthPage;
