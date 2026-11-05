import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast"; // or whichever toast library you use
import { ActivityHeatmapMonth } from "react-activity-heatmap";
import api from "../../api/client";
import MapKeys from "./(reusable)/HeatMapKeys";
import AuthButton from "./(reusable)/Button";

interface ClickCountRes {
  date: string; // "YYYY-MM-DD"
  count: number;
  level: number;
}

interface HeatmapEntry {
  date: Date;
  count: number;
  level: number;
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const LEVEL_COLORS = {
  level1: "#047857",
  level2: "#059669",
  level3: "#10b981",
  level4: "#34d399",
};

const parseLocalDate = (value: string): Date => {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// Defined outside the component so its reference is stable
const toEntries = (data: ClickCountRes[]): HeatmapEntry[] =>
  data.map((a) => ({ ...a, date: parseLocalDate(a.date) }));

const fetchHeatmap = async (): Promise<ClickCountRes[]> => {
  const res = await api.get<ClickCountRes[]>("/active/heatmap");
  return res.data;
};

export const ActivityHeatmap = () => {
  const year = new Date().getFullYear();
  const [detailTab, setDetailTab] = useState<HeatmapEntry | null>(null);

  const {
    data: activities = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["heatmap", year],
    queryFn: fetchHeatmap,
    select: toEntries,
    staleTime: 60_000, // don't refetch on every focus/remount for a minute
  });

  // Toast on failure. This doesn't set state, so the lint rule is happy.
  useEffect(() => {
    if (!isError) return;
    const message = isAxiosError<{ error: string }>(error)
      ? error.response?.data?.error
      : undefined;
    toast.error(message || "Failed to load activities", {
      id: "heatmap-error",
    });
  }, [isError, error]);

  const handleOpenDetails = (cell: {
    date: Date;
    count?: number;
    level?: number;
  }) => {
    if (!cell.count) {
      setDetailTab(null);
      return;
    }
    setDetailTab({
      date: cell.date,
      count: cell.count,
      level: cell.level ?? 0,
    });
  };

  return (
    <div className="flex flex-col h-full md:h-160 w-full items-center justify-center mb-20 p-5">
      <h1 className="text-2xl">Activity for {year}</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-4 mb-4">
        <MapKeys description="Not applying" hexColor="#3F3F46" />
        <MapKeys description="Keeping busy" hexColor={LEVEL_COLORS.level1} />
        <MapKeys description="Above Average" hexColor={LEVEL_COLORS.level2} />
        <MapKeys description="Very active" hexColor={LEVEL_COLORS.level3} />
        <MapKeys description="Legendary" hexColor={LEVEL_COLORS.level4} />
      </div>

      {isPending && <p>Loading activity...</p>}
      {isError && <p role="alert">Couldn't load your activity.</p>}

      {!isPending && !isError && (
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 w-full max-w-full justify-center md:flex md:gap-2 md:overflow-x-auto">
          {MONTHS.map((m) => (
            <div key={`${m}-${year}`} className="shrink-0">
              <ActivityHeatmapMonth
                activities={activities}
                month={m}
                year={year}
                cellStyle={{ borderRadius: "0.1rem" }}
                monthNameStyle={{ fontWeight: "semibold" }}
                tooltipStyle={{ border: "1px solid #e0f2fe" }}
                customCellColors={LEVEL_COLORS}
                monthNameFormat="short"
                onCellClick={handleOpenDetails}
              />
            </div>
          ))}
        </div>
      )}

      {detailTab && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 mb-4 items-center">
          <p>Date: {detailTab.date.toLocaleDateString()}</p>
          <p>Links clicked: {detailTab.count}</p>
          <p>Level of activity: {detailTab.level}</p>
          <AuthButton type="button" onClick={() => setDetailTab(null)}>
            Close
          </AuthButton>
        </div>
      )}
    </div>
  );
};
