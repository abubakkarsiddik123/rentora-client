import { request } from "@/lib/api/client";

export const getOwnerTransactions = () => request("/api/transactions");