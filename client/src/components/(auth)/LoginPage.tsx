import React, { useState, type SubmitEvent } from "react";
import AuthButton from "../(reusable)/Button";
import InputFields from "../(reusable)/InputFields";
import logo from "../../../public/maskable-icon-512x512.png";
import { useAuth } from "../../../context/auth-context";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    whatsapp_number: "",
    password: "",
  });
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
    try {
      await toast.promise(login(formData.whatsapp_number, formData.password), {
        loading: "Logging in...",
        success: "Welcome back. ",
        error: (err: unknown) => {
          const axiosErr = err as AxiosError<{ error: string }>;
          return axiosErr.response?.data?.error || "Login failed.";
        },
      });
      navigation("/");
    } catch (error) {
      // toast will handle catch
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
        className="w-36 h-36 rounded-full"
      />
      <p className="text-2xl mb-4  fononChanget-extrabold  ">Routine Works!</p>

      <InputFields
        type="tel"
        name="whatsapp_number"
        inputLabel="Phone Number"
        onChange={handleOnChange}
        value={formData.whatsapp_number}
        required
      />
      <InputFields
        type="password"
        name="password"
        inputLabel="Password"
        onChange={handleOnChange}
        value={formData.password}
        required
      />
      <AuthButton type="submit" disabled={isLogin} isSubmitting={isLogin}>
        {isLogin ? "Logging in" : "Login"}
      </AuthButton>
      <p>
        Don't have an account?{" "}
        <Link
          to={"/register"}
          className="underline text-green-900 hover:text-green-400"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
