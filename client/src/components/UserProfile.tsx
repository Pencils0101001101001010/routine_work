import AuthButton from "./(reusable)/Button";
import { toast } from "react-hot-toast";
import api from "../../api/client";
import type { AxiosError } from "axios";
import { useAuth } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, type SubmitEvent } from "react";
import InputFields from "./(reusable)/InputFields";
import type { User } from "../../types";
import UserProfileFields from "./(reusable)/UserProfileFields";
import PopupModal from "./(reusable)/PopupModal";
import DeleteConfirmation from "./(reusable)/DeleteConfirmation";

interface ProfileForm {
  name: string;
  email: string;
  whatsapp_number: string;
}

export default function UserProfile() {
  const navigate = useNavigate();
  const { logout, updateUser } = useAuth();
  const [openEditing, setOpenEditing] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [draft, setDraft] = useState<ProfileForm>({
    name: "",
    email: "",
    whatsapp_number: "",
  });
  const [userData, setUserData] = useState<User | null>(null);

  const getUser = async () => {
    try {
      const result = await api.get<User>("/user/thats-me");

      setUserData(result.data);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await toast.promise(api.delete("/user/remove-profile"), {
        loading: "Deleting...",
        success: "Profile deleted",
        error: (err: unknown) => {
          const axiosErr = err as AxiosError<{ error: string }>;
          return axiosErr.response?.data?.error || "Failed to delete profile.";
        },
      });
      await logout();
      navigate("/", { replace: true });
    } catch {
      // toast already shows the error
    }
  };

  const handleOpenEditForm = () => {
    setDraft({
      name: userData?.name ?? "",
      email: userData?.email ?? "",
      whatsapp_number: userData?.whatsapp_number ?? "",
    });
    setOpenEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setDraft((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handelSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await toast.promise(
        api.patch("/user/update-info", draft),

        {
          loading: "Updating...",
          success: "Info updated. ",
          error: (err: unknown) => {
            const axiosErr = err as AxiosError<{ error: string }>;
            return axiosErr.response?.data?.error || "Update failed";
          },
        },
      );
      setUserData((prev) => (prev ? { ...prev, ...draft } : prev));
      updateUser(draft);
      setOpenEditing(false);
    } catch (error: any) {
      //toast handles the error
    }
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <section className=" flex flex-col h-full justify-center relative items-center">
      {openEditing ? (
        <>
          <h1 className="text-2xl">Edit user info</h1>
          <form
            onSubmit={handelSubmit}
            className="flex flex-col items-center w-75 md:w-3xl p-5 rounded-2xl justify-around mt-30 mb-30  shadow-2xl border-l border-r border-green-400"
          >
            <InputFields
              name="name"
              type="text"
              value={draft.name}
              onChange={handleChange}
              inputLabel="Name"
            />
            <InputFields
              type="email"
              name="email"
              value={draft.email}
              onChange={handleChange}
              inputLabel="Email"
            />
            <InputFields
              type="tel"
              name="whatsapp_number"
              onChange={handleChange}
              inputLabel="Whatsapp Num"
              value={draft.whatsapp_number}
            />
            <AuthButton title="Submit" type="submit">
              Submit
            </AuthButton>
          </form>

          <div className="absolute top-10 right-5">
            <AuthButton onClick={() => setOpenEditing(false)}>
              Cancel
            </AuthButton>
          </div>
        </>
      ) : (
        <>
          <PopupModal open={confirmDelete}>
            <DeleteConfirmation
              onConfirm={handleDelete}
              onCancel={handleCancelDelete}
            />
          </PopupModal>
          <h1 className="text-2xl">User Profile</h1>
          <div className="flex flex-col  w-75 md:w-3xl text-center justify-around  h-100  px-5 py-5 rounded-2xl shadow-2xl border-l border-r border-green-400 mt-30 mb-30">
            <UserProfileFields label="Name" userData={userData?.name} />
            <UserProfileFields label="Email" userData={userData?.email} />
            <UserProfileFields
              label="Number"
              userData={userData?.whatsapp_number}
            />
            <AuthButton onClick={handleConfirmDelete}>
              Delete Profile
            </AuthButton>
          </div>
          <div className="absolute top-10 right-10">
            <AuthButton onClick={handleOpenEditForm}>Edit</AuthButton>
          </div>
        </>
      )}
    </section>
  );
}
