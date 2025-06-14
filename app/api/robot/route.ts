import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const piUrl = process.env.PI_URL;
    if (!piUrl) {
      return NextResponse.json(
        { error: "PI_URL not configured" },
        { status: 500 },
      );
    }

    const { algorithm } = await req.json();

    console.log(algorithm);

    const response = await fetch(`${piUrl}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ algorithm }),
    });

    const data = await response.text();
    console.log(data);
    try {
      return NextResponse.json(JSON.parse(data), { status: response.status });
    } catch {
      return new NextResponse(data, { status: response.status });
    }
  } catch (error) {
    console.error("Error proxying to PI_URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
