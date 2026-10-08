import { useState, type SubmitEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../api/client";
import InputFields from "../(reusable)/InputFields";
import AuthButton from "../(reusable)/Button";
import { parseApiError } from "../../utils/apiError";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirm) {
      setErrors({ confirm: ["Passwords do not match."] });
      return;
    }

    const toastId = toast.loading("Resetting password.");
    try {
      await api.post("/user/reset-password", { token, password });
      toast.success("Password changed. Please log in.", { id: toastId });
      navigate("/login");
    } catch (err) {
      const { message, fieldErrors } = parseApiError(err, "Reset failed.");
      setErrors(fieldErrors);
      toast.error(message, { id: toastId });
    }
  };

  if (!token) return <p>This reset link is invalid.</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center h-screen"
    >
      <InputFields
        inputLabel="New password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password?.[0]}
        required
      />
      <InputFields
        inputLabel="Confirm password"
        type="password"
        name="confirm"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm?.[0]}
        required
      />
      <AuthButton type="submit">Reset password</AuthButton>
    </form>
  );
}
