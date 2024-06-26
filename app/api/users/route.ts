import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

type MyData = {
  full_name: string;
  email: string;
  thumb: string;
  id: string;
};

export async function GET() {
  const posts = await sql`SELECT * FROM users;`;
  return NextResponse.json(posts.rows, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const res: MyData = await request.json();

  if (!res) {
    return new NextResponse(
      JSON.stringify({ error: "Please provide something to search for" }),
      { status: 500 }
    );
  }

  try {
    const result = await sql`UPDATE users
  SET full_name = ${res.full_name}, 
      email = ${res.email}, 
      thumb = ${res.thumb}
  WHERE id = ${res.id};`;

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
