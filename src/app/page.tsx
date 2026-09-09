import Link from "next/link";
import { getDb } from "../prisma/db";

export default async function HomePage() {
  const db = await getDb();
  const matieres = await db.orm.public.Matiere.orderBy((m) => m.name.asc()).all();

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Mes matières</h1>
      <ul className="space-y-3">
        {matieres.map((matiere) => (
          <li key={matiere.id}>
            <Link
              href={`/matieres/${matiere.id}`}
              className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition"
            >
              {matiere.name}
            </Link>
          </li>
        ))}
      </ul>
      {matieres.length === 0 && (
        <p className="text-gray-500">Aucune matière pour l&apos;instant.</p>
      )}
    </main>
  );
}