
import type { DistrictsResponse, FilterOptions } from "../types/district";

const API_URL : string = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

export interface DistricFilters {
    state?  : string;
    crop? : string;
    year? : string;
    page? : number;
    limit? : number;
}

const request = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
};



const fetchDistricts = async(filters : DistricFilters = {}) : Promise<DistrictsResponse> => {
    const params = new URLSearchParams();
    for(const [key,value] of Object.entries(filters)){
        if(value !== undefined && value !== ""){
            params.set(key, String(value));
        }
    }
    return request<DistrictsResponse>(`/districts?${params}`);
}

const fetchFilterOptions = () : Promise<FilterOptions> => {
    return request<FilterOptions>("/filters");
}


export { fetchDistricts,fetchFilterOptions};