import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import placeholderImage from "../assets/giorno.jpg";
import { toast, ToastContainer } from "react-toastify"; // Import Toast components
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const apiBaseUrl = import.meta.env.VITE_BASE_API;

export const description =
  "A signup page with two columns. The first column has a cover image, and the second column has the signup form with first name, last name, email, and password fields. It includes a toggle eye icon for the password field.";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = (errorData.errors && errorData.errors.length > 0)
          ? errorData.errors[0].msg
          : "Signup failed!";
        throw new Error(errorMessage);
      }

      toast.success("Signup successful! Please check your email to verify your account.", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      navigate("/login");
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] text-white bg-black lg:grid-cols-2 xl:min-h-[800px] overflow-hidden">
      <div className="hidden bg-muted lg:block">
        <img
          src={placeholderImage}
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-20">
        <div className="mx-auto grid w-[600px] gap-10">
          <div className="grid gap-4 text-center">
            <h1 className="text-7xl text-white font-bold mb-4">Sign Up</h1>
            <p className="text-balance text-2xl text-neutral-400 text-muted-foreground">
              Create your account by filling the details below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-8">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                type="text"
                placeholder="First Name"
                required
                className="bg-black border border-neutral-800"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                type="text"
                placeholder="Last Name"
                required
                className="bg-black border border-neutral-800"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
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
            <Button type="submit" className="w-full bg-white text-black text-lg font-bold">
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-lg">
            Already have an account?{" "}
            <Link to="/login" className="underline font-bold">
              Log in
            </Link>
          </div>
        </div>
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
