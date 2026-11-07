import { useEffect, useState } from "react";
import { fetchDistricts } from "./api/districts";
import type { District } from "./types/district";

function App() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDistricts({ limit: 20 })
      .then((res) => setDistricts(res.data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Crop Yield Risk Dashboard</h1>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
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
    </main>
  );
}

export default App;