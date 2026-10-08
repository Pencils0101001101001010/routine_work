import { useState, type SubmitEvent } from "react";
import InputFields from "../(reusable)/InputFields";
import AuthButton from "../(reusable)/Button";
import { toast } from "react-hot-toast";
import api from "../../../api/client";
import { useNavigate } from "react-router-dom";
import { parseApiError } from "../../utils/apiError";

export default function ForgotPassword() {
  const [resetEmail, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<Record<string, string[]>>(
    {},
  );
  const navigation = useNavigate();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage({});
    const toastId = toast.loading("Sending email.");

    try {
      await api.post("/user/forgot-password", { email: resetEmail });
      toast.success("Sent!", { id: toastId });
      navigation("/login");
    } catch (error) {
      const { message, fieldErrors } = parseApiError(error, "Email failed.");
      setErrorMessage(fieldErrors);
      toast.error(message, { id: toastId });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center  h-screen"
    >
      <InputFields
        inputLabel="Send reset link to your email:"
        type="email"
        name="email"
        value={resetEmail}
        onChange={(e) => setEmail(e.target.value)}
        error={errorMessage.email?.[0]}
      />
      <AuthButton type="submit">Submit</AuthButton>
    </form>
  );
}
