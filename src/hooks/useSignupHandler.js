import { useReducer } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLoginHandler } from "./useLoginHandler";
import { API_URL } from "utilities";

function useSignupHandler() {
  const { loginHandler } = useLoginHandler();
  const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const initialErrorState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const formReducer = (state, action) => {
    switch (action.type) {
      case "INPUT_FIRST_NAME":
        return {
          ...state,
          firstName: action.payload,
        };
      case "INPUT_LAST_NAME":
        return {
          ...state,
          lastName: action.payload,
        };
      case "INPUT_EMAIL":
        return {
          ...state,
          email: action.payload,
        };
      case "INPUT_PASSWORD":
        return {
          ...state,
          password: action.payload,
        };
      case "INPUT_CONFIRM_PASSWORD":
        return {
          ...state,
          confirmPassword: action.payload,
        };
    }
  };

  const errorReducer = (state, action) => {
    switch (action.type) {
      case "ERROR_FIRST_NAME":
        return {
          ...state,
          firstName: action.payload,
        };
      case "ERROR_LAST_NAME":
        return {
          ...state,
          lastName: action.payload,
        };
      case "ERROR_EMAIL":
        return {
          ...state,
          email: action.payload,
        };
      case "ERROR_PASSWORD":
        return {
          ...state,
          password: action.payload,
        };
      case "ERROR_CONFIRM_PASSWORD":
        return {
          ...state,
          confirmPassword: action.payload,
        };
    }
  };

  const [errorData, errorDispatch] = useReducer(
    errorReducer,
    initialErrorState
  );
  const [formData, formDispatch] = useReducer(formReducer, initialFormState);

  const checkValidation = () => {
    let signupFlag = true;

    // Build a local copy that fills missing fields from simplified UI
    const data = {
      firstName: formData.firstName || "Customer",
      lastName: formData.lastName || "",
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword || formData.password,
    };

    // Validate firstName only if present
    if (data.firstName && !new RegExp("^[A-Za-z]+$").test(data.firstName)) {
      errorDispatch({
        type: "ERROR_FIRST_NAME",
        payload: "First Name should have only letters",
      });
      signupFlag = false;
    }

    // Validate lastName only if present
    if (data.lastName && !new RegExp("^[A-Za-z]+$").test(data.lastName)) {
      errorDispatch({
        type: "ERROR_LAST_NAME",
        payload: "Last Name should have only letters",
      });
      signupFlag = false;
    }

    if (!new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(data.email)) {
      errorDispatch({
        type: "ERROR_EMAIL",
        payload: " Please enter valid email",
      });
      signupFlag = false;
    }

    if (
      !new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}"
      ).test(data.password)
    ) {
      errorDispatch({
        type: "ERROR_PASSWORD",
        payload:
          "Password should contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 digit and 1 special character",
      });
      signupFlag = false;
    }

    if (data.password !== data.confirmPassword) {
      errorDispatch({
        type: "ERROR_CONFIRM_PASSWORD",
        payload: "Both the passwords should match",
      });
      signupFlag = false;
    }
    return signupFlag;
  };

  const signUpHandler = async (e, location, setDisableSignup) => {
    setDisableSignup(true);
    e.preventDefault();
    if (checkValidation()) {
      try {
        // Prepare payload with defaults for first/last name so backend receives expected fields
        const payload = {
          firstName: formData.firstName || "Customer",
          lastName: formData.lastName || "",
          email: formData.email,
          password: formData.password,
        };

        const response = await axios.post(`${API_URL}/api/auth/signup`, payload);
        if (response.status === 201) {
          await loginHandler(
            null,
            null,
            null,
            {
              email: formData.email,
              password: formData.password,
            },
            location,
            null
          );
          toast.success("Signup successful!");
        } else throw new Error();
      } catch (e) {
        toast.error("Error in signing up. Please try again.");
        console.error("signUpHandler : Error in signing up", e);
      } finally {
        setDisableSignup(false);
      }
    }
  };

  return { formData, formDispatch, errorData, errorDispatch, signUpHandler };
}

export { useSignupHandler };
