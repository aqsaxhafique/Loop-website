import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSignupHandler } from "hooks";
import "./auth.css";
import pancakeImg from "assets/images/pan1.jpg";

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { formData, formDispatch, errorData, errorDispatch, signUpHandler } =
    useSignupHandler();
  const [disableSignup, setDisableSignup] = useState(false);
  const location = useLocation();

  return (
    <div className="auth-container middle-content">
      <div className="auth-card">
        <div className="auth-split">
        <div
          className="auth-left"
          style={{ backgroundImage: `url(${pancakeImg})` }}
          aria-hidden="true"
        />
        <div className="auth-right">
          <h4 className="heading4">SIGN UP</h4>
          <form className="form-auth">
            <div className="form-input">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                placeholder="Enter email"
                id="email"
                className="input-primary border-box"
                value={formData.email}
                onChange={(e) =>
                  formDispatch({ type: "INPUT_EMAIL", payload: e.target.value })
                }
                onFocus={() =>
                  errorDispatch({
                    type: "ERROR_EMAIL",
                    payload: "",
                  })
                }
                required
              />
            </div>
            {errorData.email.length > 0 && (
              <div className="error">
                <FontAwesomeIcon
                  icon="circle-exclamation"
                  className="error-icon"
                ></FontAwesomeIcon>
                <div> {errorData.email}</div>
              </div>
            )}

            <div className="form-input">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="input-primary input-icon-container border-box">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter password"
                  className="input-no-outline"
                  value={formData.password}
                  onChange={(e) =>
                    formDispatch({
                      type: "INPUT_PASSWORD",
                      payload: e.target.value,
                    })
                  }
                  onFocus={() =>
                    errorDispatch({
                      type: "ERROR_PASSWORD",
                      payload: "",
                    })
                  }
                  required
                />
                <button
                  className="btn-no-decoration cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? "eye" : "eye-slash"}
                    className="input-icon-style"
                  />
                </button>
              </div>
            </div>
            {errorData.password.length > 0 && (
              <div className="error">
                <FontAwesomeIcon
                  icon="circle-exclamation"
                  className="error-icon"
                ></FontAwesomeIcon>
                <div> {errorData.password}</div>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <button
                type="submit"
                className="btn btn-primary btn-auth"
                disabled={disableSignup}
                onClick={async (e) => {
                  await signUpHandler(e, location, setDisableSignup);
                }}
              >
                Sign Up
              </button>
            </div>

            <div className="flex-row-center" style={{ marginTop: "0.75rem" }}>
              <span>Already have an account?</span>
              <Link
                to="/login"
                className="btn-link btn-link-primary"
                state={location.state}
                replace
              >
                Login here
              </Link>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SignupForm };
