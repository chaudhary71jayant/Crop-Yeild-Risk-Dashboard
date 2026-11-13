import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { DistrictDetail } from "../types/district";
import { fetchDistrictByID } from "../api/districts";

const fmt = (value: number | null, digits = 1) =>
  value === null ? "—" : value.toFixed(digits);

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
        (d): d is string => d !== null
      )
    : [];

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Back to all districts
      </Link>

      {loading && <p className="mt-4">Loading…</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {detail && (
        <>
          <h1 className="mb-1 mt-4 text-2xl font-bold">
            {detail.district}, {detail.state}
          </h1>
          <p className="mb-6 text-gray-600">
            {detail.crop} · {detail.year}
          </p>

          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">Risk score</p>
              <p className="text-xl font-semibold">{fmt(detail.risk_score)}</p>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">Data quality</p>
              <p className="text-xl font-semibold">
                {detail.risk_data_quality ?? "—"}
              </p>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">Rainfall (mm)</p>
              <p className="text-xl font-semibold">{fmt(detail.rainfall_mm, 0)}</p>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">Avg price</p>
              <p className="text-xl font-semibold">{fmt(detail.avg_price, 0)}</p>
            </div>
            <div className="rounded border p-3">
              <p className="text-xs text-gray-500">Yield (kg/ha)</p>
              <p className="text-xl font-semibold">
                {fmt(detail.yield_kg_per_hectare, 0)}
              </p>
            </div>
          </div>

          <h2 className="mb-2 text-lg font-semibold">Top risk drivers</h2>
          {drivers.length === 0 ? (
            <p className="mb-6 text-sm text-gray-600">
              Not enough history to identify drivers for this year.
            </p>
          ) : (
            <ul className="mb-6 list-inside list-disc text-sm">
              {drivers.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}

          <h2 className="mb-2 text-lg font-semibold">History</h2>
          <table className="w-full border text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Year</th>
                <th className="p-2">Risk score</th>
                <th className="p-2">Data quality</th>
                <th className="p-2">Rainfall (mm)</th>
                <th className="p-2">Yield (kg/ha)</th>
              </tr>
            </thead>
            <tbody>
              {detail.trend.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-2">{t.year}</td>
                  <td className="p-2">{fmt(t.risk_score)}</td>
                  <td className="p-2">{t.risk_data_quality ?? "—"}</td>
                  <td className="p-2">{fmt(t.rainfall_mm, 0)}</td>
                  <td className="p-2">{fmt(t.yield_kg_per_hectare, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
};

export default DistrictDetailPage;