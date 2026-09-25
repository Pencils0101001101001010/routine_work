import React, { useEffect, useState } from "react";
import AuthButton from "./(reusable)/Button";
import InputFields from "./(reusable)/InputFields";
import type { JobPreference } from "../../types";
import { toast } from "react-hot-toast";
import api from "../../api/client";
import type { AxiosError } from "axios";
import TableHead from "./(reusable)/TableHead";

export default function Preferences() {
  const [formData, setFormData] = useState<JobPreference>({
    job_title: "",
    location: "",
  });
  const [jobPreference, setJobPreferences] = useState<JobPreference[]>([]);
  // const [userHistory, setUserHistory] = useState<NotificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPreferences = async () => {
    try {
      const result = await toast.promise(
        api.get<JobPreference[]>("/job/all-preferences"),
        {
          loading: "Loading Preferences",
          success: "Done.",
          error: (err: unknown) => {
            const axiosErr = err as AxiosError<{ error: string }>;
            return axiosErr.response?.data?.error || "failed to load users";
          },
        },
      );

      setJobPreferences(result.data);
    } catch (error) {}
  };

  // const getUserHistory = async () => {};

  const onDelete = async (id: any) => {
    setIsLoading(true);
    try {
      await toast.promise(api.delete(`/job/preference/${id}`), {
        loading: "Deleting...",
        success: "Deleted!",
        error: (err: unknown) => {
          const axiosErr = err as AxiosError<{ error: string }>;
          return axiosErr.response?.data?.error || "Failed to delete";
        },
      });
      await getPreferences();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await toast.promise(
        api.post("/job/preference", {
          job_title: formData.job_title,
          location: formData.location,
        }),
        {
          loading: "Setting Preference.",
          success: "Done!.",
          error: (err: unknown) => {
            const axiosErr = err as AxiosError<{ error: string }>;
            return axiosErr.response?.data?.error || "Failed to set";
          },
        },
      );

      setFormData({
        job_title: "",
        location: "",
      });
      await getPreferences();
    } catch (error) {
      //toast handles this
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPreferences();
  }, []);

  return (
    <div className="h-screen">
      <form onSubmit={handleSubmit} className="mb-5">
        <span className="flex flex-col md:flex-row items-center justify-center mb-5 gap-5">
          <InputFields
            name="job_title"
            onChange={handleChange}
            value={formData.job_title}
            inputLabel="Preferences"
            placeholder="Job title"
          />
          <InputFields
            name="location"
            onChange={handleChange}
            value={formData.location}
            inputLabel="Location"
            placeholder="Area name or postal code"
          />
        </span>
        <span className="flex items-center justify-center ">
          <AuthButton type="submit">Set</AuthButton>
        </span>
      </form>
      <h1 className="text-center text-2xl font-extrabold my-4">
        Set preferences
      </h1>
      <section className="flex justify-center items-center">
        <table className=" min-w-3/4">
          <thead>
            <tr>
              <TableHead title="Job Title" />
              <TableHead title="Location" />
              <TableHead title="Action" />
            </tr>
          </thead>
          <tbody>
            {jobPreference.length <= 0 ? (
              "No Preferences set"
            ) : (
              <>
                {jobPreference.map((j) => (
                  <tr key={j.id} className="  ">
                    <td className="px-8 py-4 border-2 border-green-800 ">
                      {j.job_title}
                    </td>
                    <td className="px-8 py-4 border-2 border-green-800 ">
                      {j.location}
                    </td>
                    <td className="px-8 py-4 border-2 border-green-800 ">
                      <AuthButton
                        isSubmitting={isLoading}
                        type="button"
                        onClick={() => onDelete(j.id)}
                      >
                        {isLoading ? "Deleting..." : "Delete"}
                      </AuthButton>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
