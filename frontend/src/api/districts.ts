import type { DistrictsResponse } from "../types/district";

const API_URL : string = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

export interface DistricFilters {
    state?  : string;
    crop? : string;
    year? : string;
    page? : number;
    limit? : number;
}

const fetchDistricts = async(filters : DistricFilters = {}) : Promise<DistrictsResponse> => {
    const params = new URLSearchParams();
    for(const [key,value] of Object.entries(filters)){
        if(value !== undefined && value !== ""){
             params.set(key, String(value));
        }
    }

    const res = await fetch(`${API_URL}/districts?${params}`);
    if(!res.ok){
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? `Request failed (${res.status})`);
    }
    return res.json();

}

export { fetchDistricts,};