import { getDb } from "../prisma/db";
import SearchBar from "./components/SearchBar";
import MatiereList from "./components/MatiereList";

export default async function HomePage() {
  const db = await getDb();
  const matieres = await db.orm.public.Matiere.orderBy((m) => m.name.asc()).all();

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Mes matières</h1>

      <div className="mb-8">
        <SearchBar />
      </div>

      <MatiereList matieres={matieres} />

      {matieres.length === 0 && (
        <p className="text-gray-500">Aucune matière pour l&apos;instant.</p>
      )}
    </main>
  );
}