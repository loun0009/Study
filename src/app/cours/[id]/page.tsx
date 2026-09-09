import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "../../../prisma/db";

export default async function CoursPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coursId = parseInt(id, 10);

  const db = await getDb();
  const cours = await db.orm.public.Cours.where({ id: coursId }).first();

  if (!cours) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link href={`/matieres/${cours.matiereId}`} className="text-sm text-blue-600 hover:underline">
        ← Retour à la matière
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{cours.titre}</h1>
      <a
        href={cours.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline"
      >
        Ouvrir le PDF original
      </a>
      <div className="mt-6 whitespace-pre-wrap text-gray-800 leading-relaxed">
        {cours.texteExtrait}
      </div>
    </main>
  );
}