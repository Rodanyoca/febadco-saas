import { NextResponse } from "next/server"
export async function GET() { return NextResponse.json({ error: "Fichier non connecté dans la démonstration locale FEBADCO." }, { status: 404 }) }
