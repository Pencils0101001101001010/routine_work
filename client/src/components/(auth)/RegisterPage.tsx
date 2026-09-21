import React, { useState, type SubmitEvent } from "react";
import type { User } from "../../../types";
import { useAuth } from "../../../context/auth-context";
import InputFields from "../(reusable)/InputFields";
import AuthButton from "../(reusable)/Button";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../public/maskable-icon-512x512.png";

export default function RegisterPage() {
  const [isRegistering, setIsRegistering] = useState(false);
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
    try {
      await toast.promise(
        register(
          formData.name,
          formData.email,
          formData.whatsapp_number,
          formData.password,
        ),
        {
          loading: "Registering",
          success: "Account Created",
          error: (err: unknown) => {
            const axiosErr = err as AxiosError<{ error: string }>;
            return axiosErr.response?.data?.error || "Registration failed.";
          },
        },
      );
      navigate("/login");
    } catch (error) {
      //toast already handles the error
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
        className="w-36 h-36 rounded-full"
      />
      <p className="text-2xl mb-4  font-extrabold  ">Routine Works!</p>

      <InputFields
        type="text"
        name="name"
        inputLabel="Name"
        inputPlaceholder="name"
        onChange={handleChange}
        value={formData.name}
        required
      />
      <InputFields
        type="email"
        name="email"
        inputLabel="Email"
        inputPlaceholder="myEmail@gmail.com"
        onChange={handleChange}
        value={formData.email}
        required
      />
      <InputFields
        type="tel"
        name="whatsapp_number"
        inputLabel="Phone Number"
        onChange={handleChange}
        value={formData.whatsapp_number}
        required
      />
      <InputFields
        type="password"
        name="password"
        inputLabel="Password"
        onChange={handleChange}
        value={formData.password}
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
          className="underline text-green-900 hover:text-green-400"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
