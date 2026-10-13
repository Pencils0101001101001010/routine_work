import React, { useState, type SubmitEvent } from "react";
import type { User } from "../../../types";
import { useAuth } from "../../../context/auth-context";
import InputFields from "../(reusable)/InputFields";
import AuthButton from "../(reusable)/Button";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/maskable-icon-512x512.png";
import { parseApiError } from "../../utils/apiError";

export default function RegisterPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    whatsapp_number: "",
    password: "",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegistering(true);
    setFieldErrors({});
    const toastId = toast.loading("Registering");

    try {
      await register(
        formData.name,
        formData.email,
        formData.whatsapp_number,
        formData.password,
      );
      toast.success("Account Created", { id: toastId });
      navigate("/login");
    } catch (err) {
      const { message, fieldErrors } = parseApiError(
        err,
        "Registration failed.",
      );
      setFieldErrors(fieldErrors);
      toast.error(message, { id: toastId });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center h-screen text-green-50"
    >
      <img
        src={logo}
        alt="Routine Works logo"
        className="w-22 h-22 rounded-full"
      />
      <p className="text-2xl mb-4  font-extrabold  ">Routine Works!</p>

      <InputFields
        type="text"
        name="name"
        inputLabel="Name"
        inputPlaceholder="name"
        onChange={handleChange}
        value={formData.name}
        error={fieldErrors.name?.[0]}
        required
      />
      <InputFields
        type="email"
        name="email"
        inputLabel="Email"
        inputPlaceholder="myEmail@gmail.com"
        onChange={handleChange}
        value={formData.email}
        error={fieldErrors.email?.[0]}
        required
      />
      <InputFields
        type="tel"
        name="whatsapp_number"
        inputLabel="Phone Number"
        onChange={handleChange}
        value={formData.whatsapp_number}
        error={fieldErrors.whatsapp_number?.[0]}
        required
      />
      <InputFields
        type="password"
        name="password"
        inputLabel="Password"
        onChange={handleChange}
        value={formData.password}
        error={fieldErrors.password?.[0]}
        required
      />

      <AuthButton
        type="submit"
        disabled={isRegistering}
        isSubmitting={isRegistering}
      >
        {isRegistering ? "Registering..." : "Register"}
      </AuthButton>
      <p>
        Have an account?{" "}
        <Link
          to={"/login"}
          className="underline text-green-600 hover:text-green-400"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
