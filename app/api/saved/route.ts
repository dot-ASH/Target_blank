import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await sql`SELECT * FROM saved;`;
  return NextResponse.json(categories.rows, { status: 200 });
}
