import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "../../../prisma/db";

export default async function MatierePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matiereId = parseInt(id, 10);

  const db = await getDb();
  const matiere = await db.orm.public.Matiere.where({ id: matiereId }).first();

  if (!matiere) {
    notFound();
  }

  const cours = await db.orm.public.Cours
    .where({ matiereId })
    .select("id", "titre")
    .orderBy((c) => c.titre.asc())
    .all();

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Toutes les matières
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-6">{matiere.name}</h1>
      <ul className="space-y-3">
        {cours.map((c) => (
          <li key={c.id}>
            <Link
              href={`/cours/${c.id}`}
              className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition"
            >
              {c.titre}
            </Link>
          </li>
        ))}
      </ul>
      {cours.length === 0 && (
        <p className="text-gray-500">Aucun cours dans cette matière pour l'instant.</p>
      )}
    </main>
  );
}