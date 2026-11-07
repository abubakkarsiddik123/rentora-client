import { request } from "@/lib/api/client";

export const getAllBookings = () => request("/api/bookings");

export const getAllTransactions = () => request("/api/transactions");