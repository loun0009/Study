import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../prisma/db";
import { or } from "@prisma/orm-postgres/orm-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const matiereId = searchParams.get("matiereId");

    const db = await getDb();
    let query = db.orm.public.Cours;

    if (q && q.trim().length > 0) {
      const pattern = `%${q.trim()}%`;
      query = query.where((c) =>
        or(c.titre.ilike(pattern), c.texteExtrait.ilike(pattern))
      );
    }

    if (matiereId) {
      query = query.where({ matiereId: parseInt(matiereId, 10) });
    }

    const cours = await query
      .select("id", "titre", "matiereId")
      .orderBy((c) => c.titre.asc())
      .all();

    return NextResponse.json({ cours });
  } catch (error) {
    console.error("Erreur recherche cours:", error);
    return NextResponse.json(
      { error: "Échec de la recherche" },
      { status: 500 }
    );
  }
}