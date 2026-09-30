import { useState } from "react";
import { Link } from "react-router-dom";
import AuthButton from "./(reusable)/Button";
import { useHistoryLogs } from "../../hooks/useHistoryLogs";
import adzunaLogo from "../assets/adzuna-logo.png";

export default function UserJobHistory() {
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading, isError, isFetching } = useHistoryLogs(page, limit);

  const notificationLog = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <section className="flex flex-col  items-center h-full pt-2">
      {notificationLog.length <= 0 ? (
        <h1 className="h-screen">No history to show.</h1>
      ) : (
        <>
          <h1 className="text-center text-2xl font-extrabold my-2">
            Jobs sent to you:
          </h1>

          {isLoading && <p>Loading history...</p>}
          {isError && <p>Failed to load logs.</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            {notificationLog.map((h) => {
              const normalizedDate = h.sent_at?.split("T")[0];
              const isSent = h.status === "sent";
              return (
                <div
                  key={h.id}
                  className={`border w-87.5 h-45 rounded-2xl p-4 flex flex-col justify-between hover:shadow-2xl ${
                    isSent
                      ? "border-green-300/50 hover:border-green-300 hover:bg-green-400/10"
                      : "border-red-300/50 hover:border-red-300 hover:bg-red-400/10"
                  }`}
                >
                  <p className="wrap-break-word font-extrabold text-1xl text-green-400">
                    {h.company ? h.company : "No Company name"}
                  </p>

                  <p className="wrap-break-word line-clamp-2 text-sm">
                    {h.job_title}
                  </p>
                  <div className="flex justify-between text-xs">
                    <p>{h.status}</p>
                    <p>{normalizedDate}</p>
                  </div>

                  <div>
                    <Link
                      to="http://www.adzuna.co.za"
                      className="flex justify-between hover:text-green-400 text-xs"
                    >
                      Jobs by
                      <img
                        src={adzunaLogo}
                        alt="Adzuna logo"
                        width="80"
                        height="40"
                      />
                    </Link>

                    <p className="text-center">
                      {h.source_url ? (
                        <Link
                          className="  hover:bg-green-400/50 p-1 hover:text-green-50 text-xs rounded-2xl"
                          to={h.source_url}
                        >
                          View Listing
                        </Link>
                      ) : (
                        "No Link"
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center items-center gap-4 mt-2 mb-8">
            <AuthButton
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </AuthButton>
            <span>
              Page {page} of {totalPages}
              {isFetching && !isLoading && " (updating...)"}
            </span>
            <AuthButton
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </AuthButton>
          </div>
        </>
      )}
    </section>
  );
}
