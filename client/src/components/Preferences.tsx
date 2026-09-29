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
    distance: 50,
  });
  const [jobPreference, setJobPreferences] = useState<JobPreference[]>([]);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
      if (formData.location.length > 5) {
        return toast.error(
          "Location requires a valid Zip Code e.g 8001 for cape town",
        );
      }

      await toast.promise(
        api.post("/job/preference", {
          job_title: formData.job_title,
          location: formData.location,
          distance: formData.distance,
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
        distance: 50,
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
    <div className="h-full">
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
            placeholder="Enter area postal code: 8001"
          />

          <div
            className="flex flex-col gap-2"
            title="The distance in kilometres from the centre of set location"
          >
            <label className="text-1xl text-start">Select distance</label>
            <select
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              className="rounded-md border-2 border-green-800 bg-green-950 mb-2 px-3 py-2 text-white focus:border-green-400 focus:outline-hidden focus:ring-2 focus:ring-green-400/40 focus:zoom-110 focus:shadow-2xl focus:mb-4 " // match your other inputs' styling
            >
              <option value={10}>10km</option>
              <option value={20}>20km</option>
              <option value={50}>50km</option>
              <option value={100}>100km</option>
            </select>
          </div>
        </span>
        <span className="flex items-center justify-center ">
          <AuthButton type="submit">Set</AuthButton>
        </span>
      </form>
      <h1 className="text-center text-2xl font-extrabold my-4">
        Set preferences
      </h1>
      <section className="flex justify-center items-center mb-4">
        <section className="mb-4">
          {/* Mobile: card list */}
          <div className="flex flex-col gap-3 md:hidden">
            {jobPreference.length <= 0 ? (
              <p className="text-center px-4 py-6">No Preferences set</p>
            ) : (
              jobPreference.map((j) => (
                <div
                  key={j.id}
                  className="border-2 w-87.5 h-45 border-green-800 rounded-md p-4 flex flex-col gap-2"
                >
                  <span className="font-bold text-lg">{j.job_title}</span>
                  <div className="flex justify-between text-sm text-green-100/80 mb-5">
                    <span>{j.location}</span>
                    <span>{j.distance} km</span>
                  </div>
                  <AuthButton
                    type="button"
                    onClick={() => onDelete(j.id)}
                    disabled={isLoading}
                  >
                    Delete
                  </AuthButton>
                </div>
              ))
            )}
          </div>

          {/* Desktop/tablet: table */}
          <div className="hidden md:flex justify-center items-center">
            <table className="min-w-3/4">
              <thead>
                <tr>
                  <TableHead title="Job Title" />
                  <TableHead title="Location" />
                  <TableHead title="Distance (km)" />
                  <TableHead title="Action" />
                </tr>
              </thead>
              <tbody>
                {jobPreference.length <= 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center px-8 py-4">
                      No Preferences set
                    </td>
                  </tr>
                ) : (
                  jobPreference.map((j) => (
                    <tr key={j.id}>
                      <td className="px-8 py-4 border-2 border-green-800">
                        {j.job_title}
                      </td>
                      <td className="px-8 py-4 border-2 border-green-800">
                        {j.location}
                      </td>
                      <td className="px-8 py-4 border-2 border-green-800">
                        {j.distance} km
                      </td>
                      <td className="px-8 py-4 border-2 border-green-800">
                        <AuthButton
                          type="button"
                          onClick={() => onDelete(j.id)}
                          disabled={isLoading}
                        >
                          Delete
                        </AuthButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  );
}
