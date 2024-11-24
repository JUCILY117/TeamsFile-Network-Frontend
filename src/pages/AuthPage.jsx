import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SignupForm from "./SignupPage";
import LoginForm from "./LoginPage";
import { toast, ToastContainer } from "react-toastify";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const Auth = () => {
  const location = useLocation();

  useEffect(() => {
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
    <div className="bg-black select-none">
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
};

export default Auth;
