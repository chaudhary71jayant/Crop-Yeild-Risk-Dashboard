import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { DistrictDetail } from "../types/district";
import { fetchDistrictByID } from "../api/districts";
import { RiskTrendChart } from "../components/RiskTrendChart";
import { RiskScoreBadge } from "../components/RiskScoreBadge";
import { DataQualityBadge } from "../components/DataQualityBadge";
import { ScoreModelExplainer } from "../components/ScoreModelExplainer";

const fmt = (value: number | null | undefined, digits = 1) =>
  value === null || value === undefined ? "—" : value.toFixed(digits);

const DistrictDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<DistrictDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDistrictByID(id)
      .then((res) => {
        if (!cancelled) setDetail(res);
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
  }, [id]);

  const drivers = detail
    ? [detail.top_driver_1, detail.top_driver_2, detail.top_driver_3].filter(
        (d): d is string => Boolean(d)
      )
    : [];

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Link to="/" className="text-sm font-medium text-blue-600 hover:underline">
            ← Back to all districts
          </Link>
          {detail && (
            <>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">
                {detail.district}, {detail.state}
              </h1>
              <p className="text-sm text-slate-500">
                {detail.crop} · Crop-Year {detail.year}
              </p>
            </>
          )}
        </div>

        {detail && (
          <div className="flex items-center gap-2">
            <Link
              to={`/compare?ids=${detail.id}`}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              Compare District ⇄
            </Link>
          </div>
        )}
      </div>

      {loading && <p className="text-slate-600">Loading district details…</p>}
      {error && <p className="text-rose-600">{error}</p>}

      {detail && (
        <>
          {/* Key Metrics Cards */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Crop & Environmental Indicators ({detail.year})
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {/* Risk Score Card */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm col-span-2 sm:col-span-2">
                <p className="text-xs font-medium text-slate-500">Yield Risk Score</p>
                <div className="mt-1.5">
                  <RiskScoreBadge score={detail.risk_score} size="md" />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {detail.risk_score === null
                    ? "Insufficient baseline history to compute score"
                    : "0–100 scale (higher = higher loss risk)"}
                </p>
              </div>

              {/* Data Quality Card */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Data Quality</p>
                <div className="mt-1.5">
                  <DataQualityBadge
                    quality={detail.risk_data_quality}
                    driversAvailable={detail.drivers_available}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {detail.drivers_available ?? 0}/4 driver signals
                </p>
              </div>

              {/* Yield Card */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Yield</p>
                <p className="mt-1 text-xl font-bold text-slate-800">
                  {fmt(detail.yield_kg_per_hectare, 0)}
                </p>
                <p className="text-[11px] text-slate-400">kg/hectare</p>
              </div>

              {/* Area Card (ha) */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Cultivated Area</p>
                <p className="mt-1 text-xl font-bold text-slate-800">
                  {fmt(detail.area_hectares ?? detail.area_hectare, 1)}
                </p>
                <p className="text-[11px] text-slate-400">hectares (ha)</p>
              </div>

              {/* Production Card (tonnes) */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Production</p>
                <p className="mt-1 text-xl font-bold text-slate-800">
                  {fmt(detail.production_tonnes ?? detail.production, 1)}
                </p>
                <p className="text-[11px] text-slate-400">tonnes</p>
              </div>

              {/* Rainfall Card */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Precipitation</p>
                <p className="mt-1 text-xl font-bold text-slate-800">
                  {fmt(detail.rainfall_mm, 1)}
                </p>
                <p className="text-[11px] text-slate-400">mm</p>
              </div>

              {/* Avg Price Card */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Average Price</p>
                <p className="mt-1 text-xl font-bold text-slate-800">
                  {fmt(detail.avg_price, 1)}
                </p>
                <p className="text-[11px] text-slate-400">unit unconfirmed</p>
              </div>
            </div>
          </div>

          {/* Top Contributing Risk Drivers */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">Top Risk Drivers</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strongest contributing factors behind this year's calculated risk
            </p>

            {drivers.length === 0 ? (
              <p className="mt-3 text-xs text-slate-500 italic">
                {detail.risk_score === null
                  ? "Not enough historical time-series baseline to identify risk drivers for this crop year."
                  : "No adverse driver threshold exceeded for this year."}
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {drivers.map((d, idx) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
                      #{idx + 1}
                    </span>
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Risk Trend Chart */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-slate-800">
                Risk Trend Over Time ({detail.district} · {detail.crop})
              </h2>
              <p className="text-xs text-slate-500">
                Multi-year trajectory of calculated risk scores
              </p>
            </div>
            <RiskTrendChart trend={detail.trend} />
          </div>

          {/* Multi-Year History Table */}
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-800">
                Multi-Year Historical Records
              </h2>
              <p className="text-xs text-slate-500">
                Chronological data for {detail.district} across all available crop years
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-semibold text-slate-700">Year</th>
                    <th className="p-3 font-semibold text-slate-700">Risk Score</th>
                    <th className="p-3 font-semibold text-slate-700">Data Quality</th>
                    <th className="p-3 font-semibold text-slate-700 text-right">Area (ha)</th>
                    <th className="p-3 font-semibold text-slate-700 text-right">Production (tonnes)</th>
                    <th className="p-3 font-semibold text-slate-700 text-right">Yield (kg/ha)</th>
                    <th className="p-3 font-semibold text-slate-700 text-right">Rainfall (mm)</th>
                    <th className="p-3 font-semibold text-slate-700 text-right">Avg Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {detail.trend.map((t) => (
                    <tr
                      key={t.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        t.id === detail.id ? "bg-blue-50/40 font-medium" : ""
                      }`}
                    >
                      <td className="p-3 font-mono text-xs text-slate-800">
                        {t.year}
                        {t.id === detail.id && (
                          <span className="ml-1.5 text-[10px] text-blue-600 bg-blue-100 px-1 py-0.2 rounded font-sans">
                            Selected
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <RiskScoreBadge score={t.risk_score} size="sm" />
                      </td>
                      <td className="p-3">
                        <DataQualityBadge
                          quality={t.risk_data_quality}
                          driversAvailable={t.drivers_available}
                        />
                      </td>
                      <td className="p-3 text-right text-slate-700">
                        {fmt(t.area_hectares ?? t.area_hectare, 1)}
                      </td>
                      <td className="p-3 text-right text-slate-700">
                        {fmt(t.production_tonnes ?? t.production, 1)}
                      </td>
                      <td className="p-3 text-right font-medium text-slate-800">
                        {fmt(t.yield_kg_per_hectare, 0)}
                      </td>
                      <td className="p-3 text-right text-slate-700">
                        {fmt(t.rainfall_mm, 1)}
                      </td>
                      <td className="p-3 text-right text-slate-700">
                        {fmt(t.avg_price, 1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Explainer Panel */}
          <ScoreModelExplainer />
        </>
      )}
    </main>
  );
};

export default DistrictDetailPage;