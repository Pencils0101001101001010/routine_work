import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "../api/client";
import type { NotificationLog } from "../types";

type HistoryResponse = {
  data: NotificationLog[];
  total: number;
  page: number;
  totalPages: number;
};

export function useHistoryLogs(page: number, limit = 9) {
  return useQuery({
    queryKey: ["jobMatches", page, limit],
    queryFn: async () => {
      const res = await api.get<HistoryResponse>("/active/jobMatches", {
        params: { page, limit },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}
