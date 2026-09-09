import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { CanvasFactory } from "pdf-parse/worker"; // ⚠️ doit être importé AVANT pdf-parse
import { PDFParse } from "pdf-parse";
import { getDb } from "../../../../prisma/db";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const titre = formData.get("titre") as string | null;
    const matiereId = formData.get("matiereId") as string | null;

    if (!file || !titre || !matiereId) {
      return NextResponse.json(
        { error: "Fichier, titre et matiereId sont requis" },
        { status: 400 }
      );
    }

    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parser = new PDFParse({ data: new Uint8Array(buffer), CanvasFactory });
    let texteExtrait: string;
    try {
      const result = await parser.getText();
      texteExtrait = result.text.trim();
    } finally {
      await parser.destroy();
    }

    const db = await getDb();
    const cours = await db.orm.public.Cours.create({
      titre,
      url: blob.url,
      texteExtrait,
      matiereId: parseInt(matiereId, 10),
    });

    return NextResponse.json({ cours }, { status: 201 });
  } catch (error) {
    console.error("Erreur upload cours:", error);
    return NextResponse.json(
      { error: "Échec de l'upload ou de l'extraction" },
      { status: 500 }
    );
  }
}