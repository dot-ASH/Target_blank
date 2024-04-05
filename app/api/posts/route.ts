import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await sql`SELECT * FROM posts;`;
  return NextResponse.json(posts.rows, { status: 200 });
}