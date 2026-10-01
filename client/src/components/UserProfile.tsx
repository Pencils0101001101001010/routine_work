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

export default function UserProfile() {
  const navigate = useNavigate();
  const { logout, updateUser } = useAuth();
  const [openEditing, setOpenEditing] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp_number: "",
  });

  const getUser = async () => {
    try {
      const result = await api.get<User>("/user/thats-me");

      setFormData({
        name: result.data.name,
        email: result.data.email,
        whatsapp_number: result.data.whatsapp_number,
      });
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
    setOpenEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handelSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await toast.promise(
        api.patch("/user/update-info", {
          name: formData.name,
          email: formData.email,
          whatsapp_number: formData.whatsapp_number,
        }),
        {
          loading: "Updating...",
          success: "Info updated. ",
          error: (err: unknown) => {
            const axiosErr = err as AxiosError<{ error: string }>;
            return axiosErr.response?.data?.error || "Update failed";
          },
        },
      );

      await getUser();
      updateUser({
        name: formData.name,
        email: formData.email,
        whatsapp_number: formData.whatsapp_number,
      });
    } catch (error: any) {
      //toast handles the error
    } finally {
      setOpenEditing(false);
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
            className="flex flex-col items-center justify-around w-fit p-5 mt-30 mb-30 md:hidden  rounded-2xl shadow-2xl border-l border-r border-green-400"
          >
            <InputFields
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              inputLabel="Name"
              inputPlaceholder={formData.name}
            />
            <InputFields
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              inputLabel="Email"
              inputPlaceholder={formData.email}
            />
            <InputFields
              type="tel"
              name="whatsapp_number"
              onChange={handleChange}
              inputLabel="Whatsapp Num"
              inputPlaceholder={formData.whatsapp_number}
              value={formData.whatsapp_number}
            />
            <AuthButton title="Submit" type="submit">
              Submit
            </AuthButton>
          </form>
          <form
            onSubmit={handelSubmit}
            className="md:flex flex-col text-center items-center justify-between w-3xl h-100 hidden px-5 py-5 rounded-2xl shadow-2xl border-l border-r border-green-400 mt-30 mb-30"
          >
            <InputFields
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              inputLabel="Name"
              inputPlaceholder={formData.name}
            />
            <InputFields
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              inputLabel="Email"
              inputPlaceholder={formData.email}
            />
            <InputFields
              type="tel"
              name="whatsapp_number"
              onChange={handleChange}
              inputLabel="Whatsapp Num"
              inputPlaceholder={formData.whatsapp_number}
              value={formData.whatsapp_number}
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
          <div className="md:flex flex-col text-center justify-around w-3xl h-100 hidden px-5 py-5 rounded-2xl shadow-2xl border-l border-r border-green-400 mt-30 mb-30">
            <UserProfileFields label="Name" userData={formData.name} />
            <UserProfileFields label="Email" userData={formData.email} />
            <UserProfileFields
              label="Number"
              userData={formData.whatsapp_number}
            />
            <AuthButton onClick={handleConfirmDelete}>
              Delete Profile
            </AuthButton>
          </div>
          <div className="flex flex-col text-center justify-around w-75 h-100 p-5 md:hidden  rounded-2xl shadow-2xl border-l border-r border-green-400 mt-30 mb-30">
            <UserProfileFields label="Name" userData={formData.name} />
            <UserProfileFields label="Email" userData={formData.email} />
            <UserProfileFields
              label="Number"
              userData={formData.whatsapp_number}
            />
            <AuthButton onClick={handleConfirmDelete}>
              Delete Profile
            </AuthButton>
          </div>
          <div className="absolute top-10 right-5">
            <AuthButton onClick={handleOpenEditForm}>Edit</AuthButton>
          </div>
        </>
      )}
    </section>
  );
}
