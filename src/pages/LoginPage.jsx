import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import placeholderImage from "../assets/giorno.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

const apiBaseUrl = import.meta.env.VITE_BASE_API;
const apiBaseUrlClient = import.meta.env.VITE_BASE_API_CLIENT;

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your password link and a link to sign up if you do not have an account. The second column has a cover image.";

export default function Dashboard() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useAuth();
  const navigate = useNavigate();


  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Check specific error cases
        let errorMessage = "Login failed!";
        if (errorData.errors && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].msg; // Display specific error message
        } else if (response.status === 401) {
          errorMessage = "Invalid credentials. Please check your email and password.";
        } else if (response.status === 403) {
          errorMessage = "Your email is not verified. Please verify your email before logging in.";
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      window.location.href='/home';
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="w-full h-auto min-h-screen lg:grid lg:min-h-[800px] text-white bg-black lg:grid-cols-2 xl:min-h-[1000px] overflow-hidden">
      <div className="flex items-center justify-center py-16">
        <div className="mx-auto grid w-[600px] gap-10">
          <div className="grid gap-4 text-center">
            <h1 className="text-7xl font-bold text-white mb-4">Login</h1>
            <p className="text-2xl text-neutral-400">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-8">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="username@domain.com"
                required
                className="bg-black border border-neutral-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2 relative">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to={`${apiBaseUrlClient}/forgot-password`}
                  target="_blank"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="bg-black border border-neutral-800 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-2/3 transform -translate-y-1/2 cursor-pointer"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            <Button type="submit" className="w-full bg-white text-black py-4 text-lg font-bold">
              Login
            </Button>
            <Button variant="outline" className="w-full border border-neutral-800 py-4 text-lg font-bold">
              Login with Google
            </Button>
          </form>
          <div className="mt-8 text-center text-lg">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline font-bold">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block bg-muted">
        <img
          src={placeholderImage}
          alt="Cover"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar 
        newestOnTop 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}
