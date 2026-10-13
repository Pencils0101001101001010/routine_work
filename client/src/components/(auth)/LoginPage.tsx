import React, { useState, type SubmitEvent } from "react";
import AuthButton from "../(reusable)/Button";
import InputFields from "../(reusable)/InputFields";
import logo from "../../assets/maskable-icon-512x512.png";
import { useAuth } from "../../../context/auth-context";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { parseApiError } from "../../utils/apiError";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    whatsapp_number: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLogin, setIsLogin] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigate();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handelSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLogin(true);
    setFieldErrors({});
    const toastId = toast.loading("Logging in.");
    try {
      (await login(formData.whatsapp_number, formData.password),
        toast.success("Welcome!", { id: toastId }));

      navigation("/");
    } catch (error) {
      const { message, fieldErrors } = parseApiError(error, "Login failed.");
      setFieldErrors(fieldErrors);
      toast.error(message, { id: toastId });
    } finally {
      setIsLogin(false);
    }
  };

  return (
    <form
      onSubmit={handelSubmit}
      className="flex flex-col items-center justify-center w-full h-screen text-green-50"
    >
      <img
        src={logo}
        alt="Routine Works logo"
        className="w-22 h-22 rounded-full"
      />
      <p className="text-2xl mb-4  fononChanget-extrabold  ">Routine Works!</p>

      <InputFields
        type="tel"
        name="whatsapp_number"
        inputLabel="Phone Number"
        onChange={handleOnChange}
        value={formData.whatsapp_number}
        error={fieldErrors.whatsapp_number?.[0]}
        required
      />
      <InputFields
        type="password"
        name="password"
        inputLabel="Password"
        onChange={handleOnChange}
        value={formData.password}
        error={fieldErrors.password?.[0]}
        required
      />
      <AuthButton type="submit" disabled={isLogin} isSubmitting={isLogin}>
        {isLogin ? "Logging in" : "Login"}
      </AuthButton>
      <p className="flex fle-col ">
        Don't have an account?
        <Link
          to={"/register"}
          className="underline text-green-600 hover:text-green-400"
        >
          Register
        </Link>
      </p>
      <Link
        to={"/me-no-remember"}
        className="underline text-green-600 hover:text-green-400"
      >
        Forgot password?
      </Link>
    </form>
  );
}
