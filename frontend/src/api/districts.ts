import type { District, DistrictDetail, DistrictsResponse, FilterOptions } from "../types/district";

const isProd = import.meta.env.PROD;
const defaultApiUrl = isProd
  ? "https://crop-yield-risk-dashboard.onrender.com/api/v1"
  : "http://localhost:8080/api/v1";

const rawApiUrl: string =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : defaultApiUrl;

const API_URL: string = rawApiUrl.replace(/\/+$/, "");

export interface DistricFilters {
  state?: string;
  crop?: string;
  year?: string;
  page?: number;
  limit?: number;
}

const request = async <T,>(path: string): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
};

const fetchDistricts = async (filters: DistricFilters = {}): Promise<DistrictsResponse> => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }
  return request<DistrictsResponse>(`/districts?${params.toString()}`);
};

const fetchFilterOptions = (): Promise<FilterOptions> => {
  return request<FilterOptions>("/filters");
};

const fetchDistrictByID = (id: string | number): Promise<DistrictDetail> => {
  return request<DistrictDetail>(`/district/${id}`);
};

const fetchCompareDistricts = (ids: (string | number)[]): Promise<District[]> => {
  return request<District[]>(`/compare?ids=${ids.join(",")}`);
};

export { fetchDistricts, fetchFilterOptions, fetchDistrictByID, fetchCompareDistricts };