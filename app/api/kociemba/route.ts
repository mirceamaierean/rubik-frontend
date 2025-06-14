import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const cubeString = req.nextUrl.searchParams.get("cubeString");

  const response = await fetch(
    `${process.env.FLASK_URL}/kociemba?cubeString=${cubeString}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "content-type": "application/json" },
  });
}
