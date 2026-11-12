export type RiskDataQuality =
    | "Complete"
    | "Good"
    | "Limited"
    | "Very Limited"
    | "Insuficient";

export interface District {
    id: number;
    state: string;
    district: string;
    crop: string;
    year: string;
    rainfall_mm: number | null;
    avg_price: number | null;
    area_hectare: number | null;
    production: number | null;
    yield_kg_per_hectare: number | null;
    risk_score: number | null;
    risk_data_quality: RiskDataQuality | null;
    drivers_available: number | null;
    top_driver_1: string | null;
    top_driver_2: string | null;
    top_driver_3: string | null;
};

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DistrictsResponse {
  data: District[];
  pagination: Pagination;
}

export interface DistrictDetail extends District {
  trend: District[];
}

export interface FilterOptions {
    states : string[];
    crops : string[];
    years : string[];
}