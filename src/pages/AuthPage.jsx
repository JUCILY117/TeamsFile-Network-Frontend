import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SignupForm from "./SignupPage"; // Signup component you have
import LoginForm from "./LoginPage";   // Login component you have
import { CSSTransition, TransitionGroup } from "react-transition-group";

const Auth = () => {
  const location = useLocation();

  useEffect(() => {
    // Dynamically inject CSS for sliding transitions
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      .slide-enter {
        opacity: 0;
        transform: translateX(100%);
      }
      .slide-enter-active {
        opacity: 1;
        transform: translateX(0);
        transition: transform 500ms, opacity 500ms;
      }
      .slide-exit {
        opacity: 1;
        transform: translateX(0%);
      }
      .slide-exit-active {
        opacity: 0;
        transform: translateX(-100%);
        transition: transform 500ms, opacity 500ms;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="bg-black">
        <TransitionGroup>
          <CSSTransition key={location.pathname} classNames="slide" timeout={500}>
            <div>
              {location.pathname === "/signup" ? (
                <SignupForm />
              ) : location.pathname === "/login" ? (
                <LoginForm />
              ) : (
                <div className="text-center">Invalid route</div>
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
    </div>
  );
};

export default Auth;
