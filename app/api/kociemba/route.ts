import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // get the cube from the query params

  const cubeString = req.nextUrl.searchParams.get("cubeString");

  console.log(cubeString);

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
