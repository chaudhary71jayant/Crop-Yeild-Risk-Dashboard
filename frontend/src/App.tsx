import { useEffect, useState } from "react";
import { fetchDistricts, fetchFilterOptions } from "./api/districts";
import { FilterSelect } from "./components/FilterSelectProps";
import type { District, FilterOptions, Pagination } from "./types/district";

interface Filters {
  state: string;
  crop: string;
  year: string;
}

const PAGE_SIZE = 20;

const App = () => {
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
  };

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Crop Yield Risk Dashboard</h1>

      <div className="mb-4 flex gap-4">
        <FilterSelect
          label="State"
          value={filters.state}
          options={options.states}
          allLabel="All states"
          onChange={(v) => handleFilterChange("state", v)}
        />
        <FilterSelect
          label="Crop"
          value={filters.crop}
          options={options.crops}
          allLabel="All crops"
          onChange={(v) => handleFilterChange("crop", v)}
        />
        <FilterSelect
          label="Year"
          value={filters.year}
          options={options.years}
          allLabel="Latest year"
          onChange={(v) => handleFilterChange("year", v)}
        />
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && districts.length === 0 && (
        <p>No results for these filters.</p>
      )}

      {!loading && !error && districts.length > 0 && (
        <table className="w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">State</th>
              <th className="p-2">District</th>
              <th className="p-2">Crop</th>
              <th className="p-2">Year</th>
              <th className="p-2">Risk score</th>
              <th className="p-2">Data quality</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.state}</td>
                <td className="p-2">{d.district}</td>
                <td className="p-2">{d.crop}</td>
                <td className="p-2">{d.year}</td>
                <td className="p-2">
                  {d.risk_score === null ? "—" : d.risk_score.toFixed(1)}
                </td>
                <td className="p-2">{d.risk_data_quality ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pagination && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span>
            Page {pagination.page} of {Math.max(pagination.totalPages, 1)} ·{" "}
            {pagination.total} results
          </span>
          <div className="flex gap-2">
            <button
              className="rounded border px-3 py-1 disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <button
              className="rounded border px-3 py-1 disabled:opacity-40"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;