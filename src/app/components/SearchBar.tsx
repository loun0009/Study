"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type CoursResult = {
  id: number;
  titre: string;
  matiereId: number;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CoursResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (query.trim().length === 0) {
    return;
  }
  
 // eslint-disable-next-line react-hooks/set-state-in-effect -- déclenche un état de chargement avant un fetch débouncé, pattern légitime
  setLoading(true);
  const timeout = setTimeout(async () => {
    try {
      const res = await fetch(`/api/cours/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.cours ?? []);
    } catch (error) {
      console.error("Erreur recherche:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  return () => clearTimeout(timeout);
}, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un cours..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && (
        <p className="absolute mt-1 text-sm text-gray-400">Recherche...</p>
      )}

      {!loading && query.trim().length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-80 overflow-auto">
          {results.length === 0 && (
            <li className="px-4 py-2 text-gray-500 text-sm">Aucun résultat</li>
          )}
          {results.map((cours) => (
            <li key={cours.id}>
              <Link
                href={`/cours/${cours.id}`}
                className="block px-4 py-2 hover:bg-gray-50"
                onClick={() => setQuery("")}
              >
                {cours.titre}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}