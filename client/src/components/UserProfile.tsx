import React from "react";

export default function UserProfile() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <h1>In development</h1>
    </div>
  );
}

// import AuthButton from "./(reusable)/Button";
// import { toast } from "react-hot-toast";
// import api from "../../api/client";
// import type { AxiosError } from "axios";
// import { useAuth } from "../../context/auth-context";
// import { useNavigate } from "react-router-dom";

// export default function UserProfile() {
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   const handleDelete = async () => {
//     if (!window.confirm("Delete your account? This cannot be undone.")) return;

//     try {
//       await toast.promise(api.delete("/user/remove-profile"), {
//         loading: "Deleting...",
//         success: "Profile deleted",
//         error: (err: unknown) => {
//           const axiosErr = err as AxiosError<{ error: string }>;
//           return axiosErr.response?.data?.error || "Failed to delete profile.";
//         },
//       });
//       await logout();
//       navigate("/", { replace: true });
//     } catch {
//       // toast already shows the error
//     }
//   };

//   //I will improve this shortly.
//   return (
//     <section className="h-screen ">
//       <AuthButton onClick={handleDelete}>Delete Profile</AuthButton>
//     </section>
//   );
// }
