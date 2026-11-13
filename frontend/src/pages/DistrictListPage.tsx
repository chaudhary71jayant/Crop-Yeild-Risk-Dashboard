import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchDistricts, fetchFilterOptions } from "../api/districts";
import { FilterSelect } from "../components/FilterSelectProps";
import { RiskScoreBadge } from "../components/RiskScoreBadge";
import { DataQualityBadge } from "../components/DataQualityBadge";
import { ScoreModelExplainer } from "../components/ScoreModelExplainer";
import type { District, FilterOptions, Pagination } from "../types/district";

interface Filters {
  state: string;
  crop: string;
  year: string;
}

const PAGE_SIZE = 20;

const DistrictListPage = () => {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState<District[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [options, setOptions] = useState<FilterOptions>({
    states: [],
    crops: [],
    years: []
  });
  const [filters, setFilters] = useState<Filters>({
    state: "",
    crop: "",
    year: ""
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    fetchFilterOptions()
      .then(setOptions)
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDistricts({ ...filters, page, limit: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setDistricts(res.data);
        setPagination(res.pagination);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    setSelectedIds([]);
  };

  const toggleSelectDistrict = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        alert("You can select up to 4 districts to compare at once.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleRowClick = (id: number) => {
    navigate(`/district/${id}`);
  };

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Crop Yield Risk & Advisory Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Yield-risk scores, historical drivers, and comparative analytics across India's agricultural districts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/compare"
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            Compare Districts →
          </Link>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FilterSelect
            label="State"
            value={filters.state}
            options={options.states}
            allLabel="All states (Haryana, Punjab, UP)"
            onChange={(v) => handleFilterChange("state", v)}
          />
          <FilterSelect
            label="Crop"
            value={filters.crop}
            options={options.crops}
            allLabel="All crops (Rice, Wheat, Maize)"
            onChange={(v) => handleFilterChange("crop", v)}
          />
          <FilterSelect
            label="Crop Year"
            value={filters.year}
            options={options.years}
            allLabel="Latest year (Default)"
            onChange={(v) => handleFilterChange("year", v)}
          />
        </div>
      </div>

      {/* Floating / Sticky Comparison Action Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 shadow-md">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {selectedIds.length}
            </span>
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.length} district{selectedIds.length > 1 ? "s" : ""} selected for comparison
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="rounded px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={selectedIds.length < 2}
              onClick={() => navigate(`/compare?ids=${selectedIds.join(",")}`)}
              className="rounded-md bg-blue-600 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title={selectedIds.length < 2 ? "Select at least 2 districts to compare" : "View comparison"}
            >
              Compare Selected ({selectedIds.length}) →
            </button>
          </div>
        </div>
      )}

      {/* Loading & Error States */}
      {loading && <p className="text-slate-600">Loading districts…</p>}
      {error && <p className="text-rose-600">{error}</p>}

      {!loading && !error && districts.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          <p>No agricultural records found matching the selected filters.</p>
        </div>
      )}

      {/* Districts Data Table */}
      {!loading && !error && districts.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="w-10 p-3 text-center">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="p-3 font-semibold text-slate-700">State</th>
                  <th className="p-3 font-semibold text-slate-700">District</th>
                  <th className="p-3 font-semibold text-slate-700">Crop</th>
                  <th className="p-3 font-semibold text-slate-700">Year</th>
                  <th className="p-3 font-semibold text-slate-700">Risk Score</th>
                  <th className="p-3 font-semibold text-slate-700">Data Quality</th>
                  <th className="p-3 font-semibold text-slate-700 text-right">Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {districts.map((d) => {
                  const isChecked = selectedIds.includes(d.id);
                  return (
                    <tr
                      key={d.id}
                      onClick={() => handleRowClick(d.id)}
                      className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                        isChecked ? "bg-blue-50/50" : ""
                      }`}
                      title="Click anywhere on row to view district details"
                    >
                      <td
                        className="p-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectDistrict(d.id)}
                          aria-label={`Select ${d.district} for comparison`}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3 font-medium text-slate-700">{d.state}</td>
                      <td className="p-3">
                        <span className="font-semibold text-blue-600 hover:underline">
                          {d.district}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{d.crop}</td>
                      <td className="p-3 text-slate-600 font-mono text-xs">{d.year}</td>
                      <td className="p-3">
                        <RiskScoreBadge score={d.risk_score} size="sm" />
                      </td>
                      <td className="p-3">
                        <DataQualityBadge
                          quality={d.risk_data_quality}
                          driversAvailable={d.drivers_available}
                        />
                      </td>
                      <td className="p-3 text-right font-medium text-slate-800">
                        {d.yield_kg_per_hectare === null
                          ? "—"
                          : `${d.yield_kg_per_hectare.toFixed(0)} kg/ha`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600">
          <span>
            Showing page <strong className="text-slate-800">{pagination.page}</strong> of{" "}
            <strong className="text-slate-800">{Math.max(pagination.totalPages, 1)}</strong> (
            {pagination.total} total districts)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Explainer Panel */}
      <ScoreModelExplainer />
    </main>
  );
};

export default DistrictListPage;