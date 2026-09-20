import React, { useState, type SubmitEvent } from "react";
import type { User } from "../../../types";
import { useAth } from "../../../context/auth-context";
import InputFields from "../(reusable)/InputFields";
import AuthButton from "../(reusable)/Button";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    whatsapp_number: "",
    password: "",
  });
  const { register } = useAth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // console.log(`Name: ${name} Value: ${value}`);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      if (!formData.name || formData.name) {
        // handle response here?
      }
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
    <form onSubmit={handleSubmit}>
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

      <AuthButton type="submit" disabled={isRegistering}>
        {isRegistering ? "Registering..." : "Register"}
      </AuthButton>
    </form>
  );
}
