import { trpc, prefetch } from "@/trpc/server";

export const prefetchCredentials = (params: { page: number; pageSize: number; search: string }) => {
  void prefetch(trpc.credentials.getMany.queryOptions(params));
};
