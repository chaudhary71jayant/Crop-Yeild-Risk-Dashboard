import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCompareDistricts } from "../api/districts";
import type { District } from "../types/district";
import { RiskScoreBadge } from "../components/RiskScoreBadge";
import { DataQualityBadge } from "../components/DataQualityBadge";
import { DistrictCompareChart } from "../components/DistrictCompareChart";
import { ScoreModelExplainer } from "../components/ScoreModelExplainer";

const fmt = (value: number | null | undefined, digits = 1) =>
  value === null || value === undefined ? "—" : value.toFixed(digits);

const DistrictComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addIdInput, setAddIdInput] = useState("");

  const rawIds = searchParams.get("ids") ?? "";
  const ids = rawIds
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  useEffect(() => {
    if (ids.length < 2) {
      setDistricts([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCompareDistricts(ids)
      .then((data) => {
        if (!cancelled) setDistricts(data);
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
  }, [rawIds]);

  const removeId = (idToRemove: number) => {
    const nextIds = ids.filter((id) => id !== String(idToRemove));
    if (nextIds.length > 0) {
      setSearchParams({ ids: nextIds.join(",") });
    } else {
      setSearchParams({});
    }
  };

  const handleAddId = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = addIdInput.trim();
    if (!cleanId || Number.isNaN(Number(cleanId))) return;
    if (ids.includes(cleanId)) {
      setAddIdInput("");
      return;
    }
    if (ids.length >= 4) {
      alert("You can compare up to 4 districts at once.");
      return;
    }
    const nextIds = [...ids, cleanId];
    setSearchParams({ ids: nextIds.join(",") });
    setAddIdInput("");
  };

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3.5">
          <Link to="/" title="Back to directory">
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-11 w-11 rounded-lg object-contain shrink-0 shadow-sm hover:opacity-85 transition-opacity"
            />
          </Link>
          <div>
            <Link to="/" className="text-xs font-medium text-blue-600 hover:underline">
              ← Back to district directory
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              District Comparison
            </h1>
            <p className="text-xs text-slate-500">
              Side-by-side risk score, environmental, and production metrics comparison
            </p>
          </div>
        </div>

        {/* Add district by ID form */}
        <form onSubmit={handleAddId} className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Add district ID..."
            value={addIdInput}
            onChange={(e) => setAddIdInput(e.target.value)}
            className="w-36 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={!addIdInput.trim()}
          >
            Add
          </button>
        </form>
      </div>

      {ids.length < 2 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center text-amber-900">
          <h2 className="text-lg font-semibold">Select At Least 2 Districts to Compare</h2>
          <p className="mt-1 text-sm text-amber-800">
            Choose 2 to 3 districts from the{" "}
            <Link to="/" className="font-semibold underline">
              district list
            </Link>{" "}
            using the comparison checkboxes, or type a district ID above.
          </p>
        </div>
      )}

      {loading && <p className="text-slate-600">Loading comparison data…</p>}
      {error && <p className="text-rose-600">{error}</p>}

      {!loading && !error && districts.length >= 2 && (
        <>
          {/* Comparison Chart */}
          <DistrictCompareChart districts={districts} />

          {/* Side-by-side metrics table */}
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                Detailed Metrics Comparison ({districts.length} districts)
              </h2>
              <span className="text-xs text-slate-500">
                Units confirmed by agricultural data pipeline
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-100">
                    <th className="p-3 font-semibold text-slate-700 w-44">Attribute</th>
                    {districts.map((d) => (
                      <th key={d.id} className="p-3 font-semibold text-slate-900 min-w-[200px]">
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/district/${d.id}`}
                            className="text-blue-600 hover:underline font-bold text-base"
                          >
                            {d.district}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeId(d.id)}
                            className="text-xs text-rose-500 hover:text-rose-700 px-1.5 py-0.5 rounded border border-rose-200 hover:bg-rose-50"
                            title="Remove from comparison"
                          >
                            Remove ×
                          </button>
                        </div>
                        <span className="block text-xs font-normal text-slate-500 mt-0.5">
                          {d.state} · {d.crop} ({d.year})
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-600">Risk Score (0–100)</td>
                    {districts.map((d) => (
                      <td key={d.id} className="p-3">
                        <RiskScoreBadge score={d.risk_score} />
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-600">Data Quality</td>
                    {districts.map((d) => (
                      <td key={d.id} className="p-3">
                        <DataQualityBadge
                          quality={d.risk_data_quality}
                          driversAvailable={d.drivers_available}
                        />
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-600">Top Risk Drivers</td>
                    {districts.map((d) => {
                      const drivers = [d.top_driver_1, d.top_driver_2, d.top_driver_3].filter(
                        Boolean
                      );
                      return (
                        <td key={d.id} className="p-3 text-xs">
                          {drivers.length === 0 ? (
                            <span className="text-slate-400">None identified</span>
                          ) : (
                            <ol className="list-decimal list-inside space-y-0.5 text-slate-700">
                              {drivers.map((drv, idx) => (
                                <li key={idx}>{drv}</li>
                              ))}
                            </ol>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-600">Yield</td>
                    {districts.map((d) => (
                      <td key={d.id} className="p-3 font-semibold text-slate-800">
                        {fmt(d.yield_kg_per_hectare, 0)} <span className="font-normal text-xs text-slate-500">kg/ha</span>
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-600">Area (Cultivated)</td>
                    {districts.map((d) => (
                      <td key={d.id} className="p-3 text-slate-800">
                        {fmt(d.area_hectares ?? d.area_hectare, 1)} <span className="text-xs text-slate-500">ha</span>
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-600">Production</td>
                    {districts.map((d) => (
                      <td key={d.id} className="p-3 text-slate-800">
                        {fmt(d.production_tonnes ?? d.production, 1)} <span className="text-xs text-slate-500">tonnes</span>
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-600">Rainfall</td>
                    {districts.map((d) => (
                      <td key={d.id} className="p-3 text-slate-800">
                        {fmt(d.rainfall_mm, 1)} <span className="text-xs text-slate-500">mm</span>
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-600">
                      Average Price
                      <span className="block text-[11px] font-normal text-slate-400">
                        (Unit unconfirmed)
                      </span>
                    </td>
                    {districts.map((d) => (
                      <td key={d.id} className="p-3 text-slate-800">
                        {fmt(d.avg_price, 1)}
                      </td>
                    ))}
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-600">Actions</td>
                    {districts.map((d) => (
                      <td key={d.id} className="p-3">
                        <Link
                          to={`/district/${d.id}`}
                          className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Full History →
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Model explanation */}
          <ScoreModelExplainer />
        </>
      )}
    </main>
  );
};

export default DistrictComparePage;
